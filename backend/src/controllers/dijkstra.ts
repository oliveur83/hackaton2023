import express from 'express';
import path from 'path';
import XLSX from 'xlsx';


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

interface Graph {
    [poubelle: string]: { [neighbor: string]: number };
}

function dijkstra(graph: Graph, start: string): { [key: string]: number } {
    const distances: { [key: string]: number } = {};
    const visited: { [key: string]: boolean } = {};
    const queue: string[] = [];

    // Initialiser les distances
    for (const node in graph) {
        distances[node] = Infinity;
    }
    distances[start] = 0;

    // Ajouter le nœud de départ à la file d'attente
    queue.push(start);

    while (queue.length) {
        // Extraire le nœud avec la distance minimale de la file d'attente
        const currentNode = queue.shift() as string;

        if (!visited[currentNode]) {
            // Marquer le nœud comme visité
            visited[currentNode] = true;

            // Parcourir les voisins du nœud actuel
            for (const neighbor in graph[currentNode]) {
                const distance = distances[currentNode] + graph[currentNode][neighbor];

                // Mettre à jour la distance si une distance plus courte est trouvée
                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    queue.push(neighbor);
                }
            }
        }
    }

    return distances;
}

function convertToGraph(poubellesGPS: string[]): Graph {
    const graph: Graph = {};

    for (let i = 0; i < poubellesGPS.length; i++) {
        for (let j = i + 1; j < poubellesGPS.length; j++) {
            const distance = calculateDistance(poubellesGPS[i], poubellesGPS[j]);
            
            if (!graph[poubellesGPS[i]]) {
                graph[poubellesGPS[i]] = {};
            }
            if (!graph[poubellesGPS[j]]) {
                graph[poubellesGPS[j]] = {};
            }

            graph[poubellesGPS[i]][poubellesGPS[j]] = distance;
            graph[poubellesGPS[j]][poubellesGPS[i]] = distance;
        }
    }

    return graph;
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


         // Convertir les coordonnées GPS en une structure de graphe
 
         const poubellesSupprimees = [];
// Tant que le tableau de poubelles n'est pas vide
while (poubellesGPS.length > 0) {
    // Exécuter Dijkstra à partir d'un nœud de départ
    const startNode = poubellesGPS[0];
    const shortestDistances = dijkstra(convertToGraph(poubellesGPS), startNode);

    // Convertir l'objet en tableau de paires clé-valeur
    const distancesArray = Object.entries(shortestDistances);

    // Trier le tableau en fonction des distances (de la plus courte à la plus longue)
    distancesArray.sort((a, b) => a[1] - b[1]);

    // Le point GPS le plus court est maintenant dans la première position du tableau
    const shortestPoint = distancesArray[0][0];
    const shortestDistance = distancesArray[0][1];
    poubellesSupprimees.push(shortestPoint);
    console.log("Point GPS le plus court :", shortestPoint);
    console.log("Distance la plus courte :", shortestDistance);

    // Supprimer la poubelle GPS associée au point le plus court
    const indexToRemove = poubellesGPS.findIndex(poubelle => poubelle === shortestPoint);
    if (indexToRemove !== -1) {
        poubellesGPS.splice(indexToRemove, 1);
    }
}

        res.status(200).json({poubellesSupprimees });
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
};
