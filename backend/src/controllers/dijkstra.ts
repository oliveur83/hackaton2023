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

function convertToGraph(poubellesGPS: string[],toto: string[]): Graph {
    const graph: Graph = {};

    for (let i = 0; i < poubellesGPS.length; i++) {
        for (let j = i + 1; j < poubellesGPS.length; j++) {

            const distance = calculateDistance(poubellesGPS[i], poubellesGPS[j]);
            const cout= distance+Number(toto[j])
          
            if (!graph[poubellesGPS[i]]) {
                graph[poubellesGPS[i]] = {};
            }
            if (!graph[poubellesGPS[j]]) {
                graph[poubellesGPS[j]] = {};
            }

            graph[poubellesGPS[i]][poubellesGPS[j]] = cout;
            graph[poubellesGPS[j]][poubellesGPS[i]] = cout;
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

function convertToDMS(coord: number, type: 'latitude' | 'longitude'): string {
    const isNegative = coord < 0;
    coord = Math.abs(coord);

    const degrees = Math.floor(coord);
    const minutesFloat = (coord - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.floor((minutesFloat - minutes) * 60);

    let direction = '';
    if (type === 'latitude') {
        direction = isNegative ? 'S' : 'N';
    } else if (type === 'longitude') {
        direction = isNegative ? 'W' : 'E';
    }

    return `${degrees}°${minutes}'${seconds}"${direction}`;
}

function TriageWithNewPoint(poubellesGPS: string[], actualCoord: string): string[] {
    const newPoubellesGPS: string[] = [];

    newPoubellesGPS.push(actualCoord);

    poubellesGPS.forEach((value) => {
        newPoubellesGPS.push(value);
    });

    return newPoubellesGPS; 
}

function renewGps(djikstra: any[]): string[] {
    let newTab: string[] = [];

    for (let i = 0; i < djikstra.length; i++) {
        newTab.push(djikstra[i][0]);
    }
    
    return newTab;
}

export const ville_gps = (req: express.Request, res: express.Response) => {
    try {

        const { latitude, longitude } = req.body;

        // const latitude: number = 42.614167;
        // const longitude: number = 9.354722;

        const latitudeDMS: string = convertToDMS(latitude, 'latitude');
        const longitudeDMS: string = convertToDMS(longitude, 'longitude');

        const actualCoord: string = `${latitudeDMS} ${longitudeDMS}`;


        const excelFilePath = path.join(__dirname, '../data.xlsx');
        const workbook = XLSX.readFile(excelFilePath);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: PoubelleData[] = XLSX.utils.sheet_to_json(worksheet);

        // Récupérer les données GPS pour toutes les poubelles
        var poubellesGPS: string[] = [];
        var poubellesramp: string[] = [];
        for (let i = 1; i < data.length; i++) {
            const poubelleData: PoubelleData = data[i];
            // Pour chaque poubelle, ajouter les coordonnées GPS à la liste
            for (let j = 1; j <= 7; j++) {
                const co=j*2
                const poubelleGPS: string = poubelleData[`poubelle ${j}`] as string;
                const poubelleramp: string = poubelleData[`__EMPTY_${co}`] as string;
                
                if (poubelleGPS) {
                    poubellesGPS.push(poubelleGPS);
                    poubellesramp.push(poubelleramp);
                }
            }
        }
    console.log(poubellesramp)
        //Pour rajouter les coordonnées récupérer en post, pour le mettre comme point de depart
        poubellesGPS = TriageWithNewPoint(poubellesGPS, actualCoord);

        // for (const key in poubellesGPS) {
        //     let value = poubellesGPS[key];

        //     console.log(key, value);
        // }

         // Convertir les coordonnées GPS en une structure de graphe
         const poubellesSupprimees = [];
        var it: number = 0;
        var startNode: string;
        // Tant que le tableau de poubelles n'est pas vide
        while (poubellesGPS.length > 1) {
            // Exécuter Dijkstra à partir d'un nœud de départ
            if (it === 0) {
                startNode = poubellesGPS[0];
                it = 1;
            }
            const shortestDistances = dijkstra(convertToGraph(poubellesGPS,poubellesramp), startNode);
            
            // Convertir l'objet en tableau de paires clé-valeur
            const distancesArray = Object.entries(shortestDistances);

            // Trier le tableau en fonction des distances (de la plus courte à la plus longue)
            distancesArray.sort((a, b) => a[1] - b[1]);

            //Regarder le chemin le plus cours
            let dist: number;
            let sPoint: string;
           


            // Le point GPS le plus court est maintenant dans la première position du tableau
            const actualPoint = distancesArray[0][0];
            const shortestPoint = distancesArray[1][0];
            startNode = shortestPoint;
            const shortestDistance = distancesArray[1][1];
            
            poubellesSupprimees.push(distancesArray[0][0]);
            // console.log("Point GPS actuel :", actualPoint);
            // console.log("Point GPS le plus court :", shortestPoint);
            // console.log("Distance la plus courte :", shortestDistance);

            // Supprimer la poubelle GPS associée au point le plus court
            const indexToRemove = poubellesGPS.findIndex(poubelle => poubelle === distancesArray[0][0]);
            if (indexToRemove !== -1) {
                poubellesGPS.splice(indexToRemove, 1);
            }

            if (poubellesGPS.length == 1) {
                poubellesSupprimees.push(shortestPoint);
            }   


        }
        console.log(poubellesSupprimees)
        res.status(200).json({poubellesSupprimees });
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
};
