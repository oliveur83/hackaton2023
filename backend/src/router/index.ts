import express from 'express';
// Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire
import { astar  } from '../controllers/astar';  // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire
import { model_ia } from '../controllers/model_ia';  // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire
import { all_ville } from '../controllers/dijkstra';
import { ville_gps } from '../controllers/dijkstra'; 

const router = express.Router();

// Définition et exportation de la fonction qui renvoie le routeur
export default () => {
 
    router.get('/astar', astar);
    router.get('/model_ia', model_ia);
    router.get('/all_ville', all_ville);
    router.get('/dijkstra', ville_gps);
    return router;
};
