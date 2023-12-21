import express from 'express';

export const astar= (req: express.Request, res: express.Response) => {
    try {
        console.log('tom est un gros astar');
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}