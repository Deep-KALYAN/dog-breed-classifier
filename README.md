# 🐶 Dog Breed Prediction App

This is a simple web application that allows you to upload a dog image or provide a URL to predict its breed using a pre-trained deep learning model from Hugging Face.

Built with:

- Python & Flask 🐍

- Hugging Face Transformers 🤗

- PyTorch

- Docker 🐳

### 🚀 Features

- Upload an image from your device or

- Paste an image URL

- Get the top 3 dog breed predictions

- View:

Image, Bar chart & pie chart of predicted probabilities

### 📦 Requirements

Docker installed
(No need to install Python, Pip, etc.)

### 🛠️ How to Run (Docker)

Clone the repository

1.  git clone https://github.com/yourusername/dog-breed-app.git
    cd dog-breed-app
2.  Build the Docker image
    docker build -t dog-breed-app .
3.  Run the container
    docker run -p 5000:5000 dog-breed-app
4.  Visit the app
    Open your browser and go to:
    👉 http://localhost:5000

### 🧠 Model

This app uses the model:
prithivMLmods/Dog-Breed-120 from Hugging Face 🤗

### 🗂️ Project Structure

project/
├── app.py # Main Flask app
├── Dockerfile
├── requirements.txt
├── templates/
│ └── index.html # Frontend UI
├── static/
│ └── style.css # Optional styling
└── README.md

### 🔐 Notes

For local files, only image formats like .jpg, .png are supported.

For image URLs, make sure they are publicly accessible and end in an image format.

---

If you don't want to use Docker
▶️

- Install required libraries:
  pip install flask transformers torch pillow
- Run the app:
  python app.py
- Open your browser:
  http://127.0.0.1:5000/
