import express from 'express';

export const dijkstra = (req: express.Request, res: express.Response) => {
    try {
        chemin_de_dijkstra()
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}
function chemin_de_dijkstra()
{

}

// note : plus influence plus elle se remplie vite 