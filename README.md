
# Find Your Dogo 

Find Your Dogo est une application web qui permet d’identifier la race d’un chien à partir d’une photo.
Elle s’appuie sur un modèle d’intelligence artificielle entraîné grâce au Transfer Learning à partir d’EfficientNetV2 sur un dataset de 20 580 images réparties en 120 races différentes.
Le but est d'offrir un outil rapide et précis pour reconnaître la race d’un chien.



## Architecture : EfficientNetV2B0 pré-entraîné sur ImageNet

Nombre de classes : 120

Précision top-1 : ~89 %

Précision top-5 : ~99 %

Dataset : 20k+ images organisées par race

## Technologies utilisées
Backend : Flask (Python)

Modèle IA : TensorFlow / Keras

Frontend : HTML, CSS, JavaScript (Fetch API)

Serveur : API REST pour la prédiction

Entraînement : Transfer Learning + Fine-tuning


# Lancement en Local

Pour faire tourner le projet il faut : 

### 1 Créer le venv

```bash
  python -m venv env
``` 
Ensuite : 
```bash
  env\Scripts\activate
```

### 2 Installer les dépendances

```bash
  pip install -r requirements.txt
```
### 3 Lancer l'application
```bash
  python app.py
```
L’application sera accessible sur :
```bash
  http://127.0.0.1:5000
```


# Route API

#### Faire une prédiction

```http
  POST /predict
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `file` | Le lien vers votre fichier |

**Type de réponse :** 
```json
{
  "predictions": [
    { "label": "golden_retriever", "score": 0.9981 },
    { "label": "labrador_retriever", "score": 0.0015 },
    { "label": "cocker_spaniel", "score": 0.0003 }
  ]
}
```




## Roadmap

- ~~Faire un Modèle CNN~~

- ~~Faire un Modèle Transfert Learning~~

- ~~Faire un Backend~~

- ~~Faire un Frontend~~

- Ajouter un systeme pour mettre plusieurs image en meme temps

- Améliorer le Modèle pour une précision parfaite

- Embellir le Frontend


# Authors

## Chef de projet : Nicolas Draperi

Modèle CNN :
- Nicolas Draperi
- Nail Benhamer

Modèle Transfer Learning :
- Nicolas Draperi
- Deep Kalyan

Backend :
- Hugo Khaled Broton
- Nicolas Draperi

Frontend : 
- Hugo Khaled Broton
- Jules Capel


## Information Supplémentaire

### Structure du projet : 

```bash
dog-breed-classifier/
├── notebooks/
│   ├── berger.webp
│   ├── best_finetune.keras
│   ├── best_head.keras
│   ├── class_names.json
│   ├── DogBreedPredictionTrainingModdel.ipynb
│   ├── DogBreedPredictionTransferLearning.ipynb
│   ├── DogBreedsPredictionWithAlreadyTrainedModel.ipynb
│   └── model_3_dogs_breeds.keras
├── static/
│   └── style.css
├── templates/
│   └── index.html
├── .gitattributes
├── app.py
├── Dockerfile
├── README.md
└── requirements.txt
``` 

Fichier utilisé pour entrainer le model CNN :
- notebooks/DogBreedPredictionTrainingModdel.ipynb 
Fichier utilisé pour le Transfer Learning :
- notebooks/DogBreedPredictionTransferLearning.ipynb 
Modèle utilisé pour l'application :
- notebooks/best_finetune.keras
Modèle non utilisé :
- notebooks/best_head.keras
- notebooks/model_3_dogs_breeds.keras
Fichier Principal : 
- app.py







