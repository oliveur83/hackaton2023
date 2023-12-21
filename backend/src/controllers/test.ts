import express from 'express';
import path from 'path';
import XLSX from 'xlsx';
import { dijkstra } from './dijkstra';

export const all_ville = (req: express.Request, res: express.Response) => {
    try {
        const excelFilePath = path.join(__dirname, '../data.xlsx');
        const workbook = XLSX.readFile(excelFilePath);

        const sheetNames = workbook.SheetNames;

        res.status(200).json({ sheetNames });
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
};
interface PoubelleData {
    "__EMPTY": string;
    "__EMPTY_1": number;
    [key: string]: string | number;
}

export const ville_gps = (req: express.Request, res: express.Response) => {
    try {
        const excelFilePath = path.join(__dirname, '../data.xlsx');
        const workbook = XLSX.readFile(excelFilePath);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: PoubelleData[] = XLSX.utils.sheet_to_json(worksheet);

        // Récupérer les données GPS pour toutes les poubelles
        const poubellesGPS: string[] = [];

        for (let i = 1; i < data.length; i++) {
            const poubelleData: PoubelleData = data[i];
            
            // Pour chaque poubelle, ajouter les coordonnées GPS à la liste
            for (let j = 1; j <= 7; j++) {
                const poubelleGPS: string = poubelleData[`poubelle ${j}`] as string;
                if (poubelleGPS) {
                    poubellesGPS.push(poubelleGPS);
                }
            }
        }
       
        res.status(200).json({ poubellesGPS });
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
};
