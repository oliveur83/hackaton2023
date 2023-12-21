import express from 'express';
import { test } from '../controllers/index';  // Assurez-vous que le chemin d'importation est correct et utilisez des accolades si nécessaire

const router = express.Router();

// Définition et exportation de la fonction qui renvoie le routeur
export default () => {
    router.get('/test', test);
    return router;
};
