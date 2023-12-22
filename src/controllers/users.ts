import express from 'express';

import { getAllUsers } from '../db/users';

export const allUsers = async (req: express.Request, res: express.Response) => {

	try {

		const users = await getAllUsers();

		if (!users) {
			return res.sendStatus(400);
		}

		return res.status(200).json(users);

	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}

}