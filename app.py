from flask import Flask, request, jsonify, render_template
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import numpy as np
import json
import io

app = Flask(__name__)

# === Chargement du modèle entraîné ===
model_path = "notebooks/best_finetune.keras"  # adapte le chemin si besoin
model = keras.models.load_model(model_path)

# === Chargement des noms de classes ===
with open("notebooks/class_names.json", "r", encoding="utf-8") as f:
    class_names = json.load(f)

IMG_SIZE = (300, 300)  # même taille que l'entraînement

# === Prétraitement de l'image ===
def load_and_preprocess_image(image_stream):
    img = Image.open(image_stream).convert("RGB").resize(IMG_SIZE)
    x = np.array(img, dtype=np.float32)
    x = tf.keras.applications.efficientnet_v2.preprocess_input(x)
    x = np.expand_dims(x, axis=0)  # batch size = 1
    return x

# === Prédiction ===
def predict_image(image_stream, top_k=3):
    x = load_and_preprocess_image(image_stream)
    probs = model.predict(x, verbose=0)[0]  # softmax déjà appliqué dans ton modèle
    top_idx = probs.argsort()[-top_k:][::-1]
    return [
        {"label": class_names[i], "score": float(probs[i])}
        for i in top_idx
    ]

# === Routes Flask ===
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty file'}), 400

    try:
        predictions = predict_image(file.stream, top_k=3)
        return jsonify({"predictions": predictions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
