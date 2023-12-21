import express from 'express';
import path from 'path';
import XLSX from 'xlsx';
interface PoubelleData {
    "__EMPTY": string;
    "__EMPTY_1": number;
    [key: string]: string | number;
}
export const astar= (req: express.Request, res: express.Response) => {
    try {

        const excelFilePath = path.join(__dirname, '../data.xlsx');
        const workbook = XLSX.readFile(excelFilePath);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: PoubelleData[] = XLSX.utils.sheet_to_json(worksheet);

        // Récupérer les données GPS pour toutes les poubelles
        const poubellesGPS: string[] = [];
        const poubellescoef: string[] = [];
        const poubellesremp: string[] = [];
        for (let i = 1; i < data.length; i++) {
            const poubelleData: PoubelleData = data[i];
         
            // Pour chaque poubelle, ajouter les coordonnées GPS à la liste
            for (let j = 1; j <= 7; j++) {
                const co=j*2;
                const r=co+1;
                const poubelleGPS: string = poubelleData[`poubelle ${j}`] as string;
                const coeftourist: string = poubelleData[`__EMPTY_${co}`] as string;
                const remplissgae: string = poubelleData[`__EMPTY_${r}`] as string;
               
       
                if (poubelleGPS) {
                    poubellesGPS.push(poubelleGPS);
                    poubellescoef.push(coeftourist);
                    poubellesremp.push(remplissgae);
                }
            }
        }
        console.log("toto",poubellesGPS)
        console.log("toto",poubellescoef)
        console.log("toto",poubellesremp)

    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}