import express from 'express';

export const model_ia = (req: express.Request, res: express.Response) => {
    try {
        console.log('tom est un gros connard');
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}