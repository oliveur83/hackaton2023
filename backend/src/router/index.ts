import express from 'express';
import { dijkstra  } from '../controllers/dijkstra';  // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire
import { astar  } from '../controllers/astar';  // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire
import { model_ia } from '../controllers/model_ia';  // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire

const router = express.Router();

// Définition et exportation de la fonction qui renvoie le routeur
export default () => {
    router.get('/dijkstra', dijkstra);
    router.get('/astar', astar);
    router.get('/model_ia', model_ia);
    return router;
};
