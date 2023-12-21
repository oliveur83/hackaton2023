import express from 'express';
import path from 'path';
import XLSX from 'xlsx';
export const getCommune = (req: express.Request, res: express.Response) => {
    try {
        const { date } = req.params

        return res.status(200).json({date: date})
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
}
interface PoubelleData {
    "__EMPTY": string;
    "__EMPTY_1": number;
    [key: string]: string | number;
}
export const getCommuneDate = (req: express.Request, res: express.Response) => {
    
    try {
        const { commune, date } = req.params;


    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
}