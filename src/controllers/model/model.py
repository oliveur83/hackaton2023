import json
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.impute import SimpleImputer

import sys
def my_python_function(poub):
    # Ouvrir le fichier JSON
    json_file_path = './src/data_communes/{}.json'.format(poub.upper())
    toto=[]
    # Ouvrir le fichier JSON
    with open(json_file_path, 'r') as file:
        # Charger les données JSON
        data = json.load(file)

    # Créer une liste pour stocker les données
    all_data = []

    # Parcourir les données pour créer une liste de dictionnaires
    i=1
    trashcans_length=2
  
    while i<trashcans_length + 1:
        for day_data in data:
            trashcans_length = len(day_data["trashcans"])
            for trashcan_data in day_data["trashcans"]:
            
                if trashcan_data["name"] == f"poubelle {i}":
                    entry = {
                        "jour": day_data["jour"],
                        "date": day_data["date"],
                        "poubelle": trashcan_data["name"],
                        "gps": trashcan_data["gps"],
                        "remplissage": trashcan_data["remplissage"],
                        "coef": trashcan_data["coef"]
                    }
                    all_data.append(entry)

        # Créer une DataFrame Pandas à partir de la liste de dictionnaires
        df = pd.DataFrame(all_data)

        # Remplacer les valeurs NaN dans la colonne "gps" par une valeur par défaut, par exemple, "Non défini"
        df["gps"].fillna("Non défini", inplace=True)

        # Convertir les coordonnées GPS en nombres (remplaçant les caractères non numériques)
        df["gps"] = pd.to_numeric(df["gps"], errors="coerce")

        # Imputer les valeurs manquantes avec la moyenne (vous pouvez ajuster la stratégie selon vos besoins)
        imputer = SimpleImputer(strategy='mean')
        df["gps"] = imputer.fit_transform(df[["gps"]])

        # Créer un modèle de régression linéaire
        model = LinearRegression()

        # Préparer les données d'entraînement
        X = df[["gps", "coef"]]
        y = df["remplissage"]

        # Entraîner le modèle
        model.fit(X, y)

        # Préparer les données pour la prédiction (par exemple, pour une poubelle hypothétique)
        poubelle_hypothetique = pd.DataFrame({"gps": [42.0], "coef": [1]})

        # Imputer la valeur manquante dans la colonne "gps" pour la poubelle hypothétique
        poubelle_hypothetique["gps"] = imputer.transform(poubelle_hypothetique[["gps"]])

        # Prédire le remplissage pour la poubelle hypothétique
        remplissage_pred = model.predict(poubelle_hypothetique[["gps", "coef"]])
        toto.append(remplissage_pred[0])
        # Afficher la prédiction
        i=i+1
    return toto
if __name__ == "__main__":
    commune = sys.argv[1]
   
    print(my_python_function(commune))