import express from 'express';
import path from 'path';
import { execSync } from 'child_process';

export const model = (req: express.Request, res: express.Response) => {
    try {
        const { commune } = req.params;
        // Exécute le script Python en tant que sous-processus
        const pythonScriptPath = path.join(__dirname, 'model/model.py');
        const result = execSync(`python ${pythonScriptPath} ${commune}`).toString();

       // Convertir la chaîne JSON en tableau TypeScript
        const arrayFromJson: number[] = JSON.parse(result);

        // Utiliser le tableau
                return res.status(200).json({ arrayFromJson });
            } catch (error) {
                console.log(error);
                return res.sendStatus(404);
            }
};

//{
 //   "result": "[37.4748594]\r\n"
//}
