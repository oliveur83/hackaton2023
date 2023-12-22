import express from 'express';

import { getUserByEmail, createUser } from '../db/users';

import { authentication, random } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {

	try {

		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res.sendStatus(400);
		}

		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			return res.sendStatus(400);
		}

		const salt = random();
		const createdUser = await createUser({
			username,
			email,
			authentication: {
				salt,
				'password': authentication(salt, password) 
			}
		});

		return res.status(200).json(createdUser);

	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}

} 

export const login = async (req:  express.Request, res: express.Response) => {
	
	try {

		if (req.cookies['SITEC-AUTH']) {
			return res.status(200).json({"logged": "You already logged bro"});
		}

		const { email, password } = req.body;

		const user = await getUserByEmail(email).select('+authentication.password +authentication.salt');

		if (!user) {
			res.sendStatus(401);
		}

		const expectedHash = authentication(user.authentication.salt, password);

		if (expectedHash != user.authentication.password) {
			return res.status(403).json({error: "Vous avez saisi un mauvais mot de passe"});
		}

		const salt = random();
		user.authentication.sessionToken = authentication(salt, user._id.toString());

		await user.save();

		res.cookie('SITEC-AUTH', user.authentication.sessionToken, {domain: "localhost", path: '/'});

		return res.status(200).json({user, "logged": "logged bro"});

	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}

}

export const logout = async (req: express.Request, res: express.Response) => {
	
	try {

		res.clearCookie('SITEC-AUTH');

		return res.status(200).json({success: "Succesfully logout"});

	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}

}

