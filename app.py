from flask import Flask, request, render_template, jsonify
from transformers import pipeline
from PIL import Image
import os

app = Flask(__name__)
classifier = pipeline("image-classification", model="prithivMLmods/Dog-Breed-120")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty file'}), 400

    image = Image.open(file.stream).convert("RGB")
    predictions = classifier(image, top_k=3)

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
