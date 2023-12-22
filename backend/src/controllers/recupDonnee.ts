import express from 'express';
import path from 'path';
import XLSX from 'xlsx';
import fs from 'fs';

interface TrashcanData {
    name: string;
    gps: string | "NaN";
    remplissage: number;
    coef: number;
}

interface DailyData {
    jour: string;
    date: string;
    trashcans: TrashcanData[];
}

export const modifFile = (req: express.Request, res: express.Response): any => {
    try {
        // Importer les données JSON
        const filePath = path.join(__dirname, '..', 'data_communes', 'vallecalle.json');
        let rawData = fs.readFileSync(filePath, 'utf8');

        // Remplacer NaN par "NaN" ou null
        rawData = rawData.replace(/NaN/g, '"NaN"');

        const data: DailyData[] = JSON.parse(rawData);
        const allGps: { [key: string]: string } = {};

        for (let i = 0; i < data.length; i++) {
            if (i == 0) {
                for (let j = 0; j < data[i].trashcans.length; j++) {
                    let name: string = data[i].trashcans[j].name as string;
                    let gps: string = data[i].trashcans[j].gps as string;
                    allGps[name] = gps;
                }
            } else {
                for (let j = 0; j < data[i].trashcans.length; j++) {
                    let nomPoubelle: string = data[i].trashcans[j].name as string;
                    data[i].trashcans[j].gps = allGps[nomPoubelle];
                }
            }
        }

        // Écrire les données modifiées dans le fichier JSON
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
};

export const getCommune = (req: express.Request, res: express.Response) => {
    try {
        const { nom } = req.params

        const filePath = path.join(__dirname, `../data_communes/${nom}.json`);
        let rawData = fs.readFileSync(filePath, 'utf8');

        rawData.replace(/NaN/g, "'NaN'");
        const data: DailyData[] = JSON.parse(rawData);

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
}

const frenchDateToEnglish = (date: string): string => {
    const dateParts = date.split('-'); // Sépare la date en parties
                if (dateParts.length === 3) {
                    const year = dateParts[2];
                    const month = dateParts[1];
                    const day = dateParts[0];
            
                    const americanDate = `${year}-${month}-${day}`;

                    return americanDate;
                }
}


export const getCommuneDate = (req: express.Request, res: express.Response) => {
    try {
        var { nom, date } = req.params;

        const filePath = path.join(__dirname, `../data_communes/${nom}.json`);
        let rawData = fs.readFileSync(filePath, 'utf8');

        rawData.replace(/NaN/g, "'NaN'");
        const data: DailyData[] = JSON.parse(rawData);

        const frenchDateFormat = /\d{2}\-\d{2}\-\d{4}$/;

        const englishDateFormat = /\d{4}\-\d{2}\-\d{2}$/;

        let ifFrench: boolean = frenchDateFormat.test(date);

        let ifEnglish: boolean = englishDateFormat.test(date);

        if (ifFrench) {
            date = frenchDateToEnglish(date);
        } else {
            if (!ifEnglish) {
                return res.status(400).json({erreur: "Mauvaise type de date"});
            }
        }

        for (let i = 0 ; i < data.length ; i++) {
            if (data[i].date == date) {
                return res.status(200).json(data[i]);
            }

        }

        return res.status(400).json({ erreur: "La date passé n'a pas été trouvé" });

    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
}