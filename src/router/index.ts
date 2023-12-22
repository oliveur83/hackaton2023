import express from 'express';
// Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire
import { all_ville, ville_gps } from '../controllers/dijkstra';
import { getCommune, getCommuneDate, modifFile } from '../controllers/recupDonnee';
import { isAuthenticated } from '../middlewares/index';
import { register, login, logout } from '../controllers/authentication';
import { allUsers } from '../controllers/users';
import { model } from '../controllers/model'; 

const router = express.Router();

// Définition et exportation de la fonction qui renvoie le routeur
export default () => {
 
    //API CARTE
    router.get('/all_ville', all_ville);
    // router.post('/dijkstra', ville_gps);
    router.post('/dijkstra/:date', ville_gps);

    router.get('/communes/:nom', getCommune);
    router.get('/communes/:nom/:date', getCommuneDate);

    router.post('/modifFile', modifFile);

    //API UTILISATEUR
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post('/auth/logout', logout);
    router.get('/users', isAuthenticated, allUsers);
    // router.get('/users', allUsers);

    router.get('/model/:commune', model);

    return router;
};