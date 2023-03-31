from tensorflow.keras.preprocessing import image
from keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.imagenet_utils import preprocess_input
import numpy as np
from numpy import expand_dims
from PIL import ImageFile, Image
import os
from flask import Flask, render_template, request
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
ImageFile.LOAD_TRUNCATED_IMAGES = True

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = load_model(os.path.join(BASE_DIR, 'resnet_model.hdf5'))

def getPrediction(img_bytes, model):
    
    # Loads the image and transforms it to (224, 224, 3) shape
    original_image = Image.open(img_bytes)
    app.logger.info('test2')
    app.logger.info(original_image)
    original_image = original_image.convert('RGB')
    original_image = original_image.resize((224, 224), Image.NEAREST)

    numpy_image = image.img_to_array(original_image)
    image_batch = expand_dims(numpy_image, axis=0)

    processed_image = preprocess_input(image_batch, mode='caffe')
    preds = model.predict(processed_image)

    return preds


def classifyImage(file):
    # Returns a probability scores matrix
    app.logger.info('test')
    preds = getPrediction(file, model)
    result = np.argmax(preds, axis=1)
  
    return str(result[0])
