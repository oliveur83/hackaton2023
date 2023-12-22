
import express from 'express';
// Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire
import { all_ville } from '../controllers/dijkstra';
import { ville_gps } from '../controllers/dijkstra'; 
import { model } from '../controllers/model'; 
import { getCommune, getCommuneDate } from '../controllers/recupDonnee';

const router = express.Router();

// Définition et exportation de la fonction qui renvoie le routeur
export default () => {
 
   router.get('/all_ville', all_ville);
    router.post('/dijkstra', ville_gps);

    router.get('/getcommune/:nom', getCommune);
    router.get('/getcommunedate/:nom/:date', getCommuneDate);
    router.get('/model/:commune', model);
    return router;
};
