import express from 'express';
import path from 'path';
import XLSX from 'xlsx';
interface PoubelleData {
    "__EMPTY": string;
    "__EMPTY_1": number;
    [key: string]: string | number;
}
class Node {
    constructor(public id: string, public coordinates: string, public fillLevel: number) {}
}

class Edge {
    constructor(public startNode: Node, public endNode: Node, public cost: number) {}
}
function calculateDistance(coord1: string, coord2: string): number {
    const toRadians = (angle: number) => (angle * Math.PI) / 180;

    // Extraction des composantes des coordonnées
    const [lat1, lon1] = coord1
        .match(/([0-9]+°[0-9]+'[0-9]+"[NS])\s+([0-9]+°[0-9]+'[0-9]+"[WE])/)!
        .slice(1)
        .map((component) => {
            const parts = component.split(/°|'|"/).filter((part) => part !== '');
            const degrees = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseInt(parts[2]);
            const direction = parts[3];

            const decimalDegrees = degrees + minutes / 60 + seconds / 3600;
            return direction === 'S' || direction === 'W' ? -decimalDegrees : decimalDegrees;
        });

    const [lat2, lon2] = coord2
        .match(/([0-9]+°[0-9]+'[0-9]+"[NS])\s+([0-9]+°[0-9]+'[0-9]+"[WE])/)!
        .slice(1)
        .map((component) => {
            const parts = component.split(/°|'|"/).filter((part) => part !== '');
            const degrees = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseInt(parts[2]);
            const direction = parts[3];

            const decimalDegrees = degrees + minutes / 60 + seconds / 3600;
            return direction === 'S' || direction === 'W' ? -decimalDegrees : decimalDegrees;
        });

    const R = 6371; // Rayon moyen de la Terre en kilomètres

    // Conversion des degrés en radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Formule de Haversine
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance en kilomètres
    const distance = R * c;

    return distance;
}
export const astar= (req: express.Request, res: express.Response) => {
    try {

        const excelFilePath = path.join(__dirname, '../data.xlsx');
        const workbook = XLSX.readFile(excelFilePath);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: PoubelleData[] = XLSX.utils.sheet_to_json(worksheet);
        const nodes: Node[] = [];
        const edges: Edge[] = [];
        // Récupérer les données GPS pour toutes les poubelles
        const poubellesGPS: string[] = [];

        const poubellesremp: string[] = [];
        for (let i = 1; i < data.length; i++) {
            const poubelleData: PoubelleData = data[i];
         
            // Pour chaque poubelle, ajouter les coordonnées GPS à la liste
            for (let j = 1; j <= 7; j++) {
                const co=j*2;
                const r=co+1;
                const poubelleGPS: string = poubelleData[`poubelle ${j}`] as string;
               const remplissgae: string = poubelleData[`__EMPTY_${co}`] as string;
               const remplissgaee: number = poubelleData[`__EMPTY_${co}`] as number;

       
                if (poubelleGPS) {
                    const node = new Node(`poubelle${i}_${j}`, poubelleGPS, remplissgaee);
                    nodes.push(node);
                    poubellesGPS.push(poubelleGPS);
                   
                    poubellesremp.push(remplissgae);
                }
            }
        }
                // Récupérer les données GPS et de remplissage pour toutes les poubelles
             
        for (let i = 0; i < nodes.length - 1; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const startNode = nodes[i];
                const endNode = nodes[j];

                // Calculer la distance euclidienne (simplifiée pour cet exemple)
                const distance = calculateDistance(startNode.coordinates, endNode.coordinates);

                // Coût de l'arête : distance * niveau de remplissage
                const cost = distance * (startNode.fillLevel + endNode.fillLevel) / 2;

                const edge = new Edge(startNode, endNode, cost);
                edges.push(edge);
            }
        }

        const startNode = nodes[0]; 
    
       // console.log(poubellesGPS)
            console.log(nodes);
            console.log(edges);
        //console.log(poubellesremp)
        //console.log(startNode)
} catch (error) {
        console.log(error);
        res.sendStatus(404);
    }


}