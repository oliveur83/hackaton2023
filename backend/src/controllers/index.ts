import express from 'express';

export const test = (req: express.Request, res: express.Response) => {
    try {
        console.log('tom est un gros connard');
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}