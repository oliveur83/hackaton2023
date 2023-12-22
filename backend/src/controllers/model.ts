import express from 'express';
import path from 'path';
import { execSync } from 'child_process';


export const getCommune = (req: express.Request, res: express.Response) => {
    try {
        const { date } = req.params;

        return res.status(200).json({ date: date });
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
};

interface PoubelleData {
    "__EMPTY": string;
    "__EMPTY_1": number;
    [key: string]: string | number;
}

export const model = (req: express.Request, res: express.Response) => {
    try {
        const { commune} = req.params;
        console.log(commune)
        // Exécute le script Python en tant que sous-processus
        const pythonScriptPath = path.join(__dirname, 'model/model.py');
        const result = execSync(`python ${pythonScriptPath} ${commune}`).toString();

       // Convertir la chaîne JSON en tableau TypeScript
const arrayFromJson: number[] = JSON.parse(result);

// Utiliser le tableau
console.log(arrayFromJson);
        return res.status(200).json({ arrayFromJson });
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
};

//{
 //   "result": "[37.4748594]\r\n"
//}
