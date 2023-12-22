import express from 'express';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

	try{

		const sessionToken = req.cookies["SITEC-AUTH"];

		if (!sessionToken) {
			return res.status(400).json({erreur: "Votre session n'est pas valide"});;
		}

		const existingUser = await getUserBySessionToken(sessionToken);

		if (!existingUser) {
			return res.status(400).json({erreur: "L'utilisateur avec cette session n'existe pas"});;
		}

		return next();

	} catch (error) {
		console.log(error);
		return res.status(400);
	}
}