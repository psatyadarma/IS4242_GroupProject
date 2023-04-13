from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.imagenet_utils import preprocess_input
from tensorflow.keras import backend as K 
import numpy as np
from numpy import expand_dims
import time
from PIL import ImageFile, Image
import os
from flask import Flask, render_template, request
import cv2
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
ImageFile.LOAD_TRUNCATED_IMAGES = True

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# cnn = load_model(os.path.join(BASE_DIR, 'model_cnn.hdf5'))
# vgg16 = load_model(os.path.join(BASE_DIR, 'model_vgg16.hdf5'))
vgg19 = load_model(os.path.join(BASE_DIR, 'model_vgg19_train1.hdf5'))
# incepv3 = load_model(os.path.join(BASE_DIR, 'model_incepv3.hdf5'))
# rn = load_model(os.path.join(BASE_DIR, 'model_rn50.hdf5'))
model = vgg19

label_dict = {0: 'Normal', 1: 'Suspicious'}
prob_list = []
max_probs = 50

# camera = cv2.VideoCapture('')  # use 0 for web camera
camera = cv2.VideoCapture(0)

def getPrediction(img_bytes, model):

    # Loads the image and transforms it to (224, 224, 3) shape
    original_image = Image.open(img_bytes)
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

def switchModel(model_type):
    global model
    global prob_list
    prob_list = []
    K.clear_session()

    if model_type == 'cnn':
        model = vgg19
    elif model_type == 'vgg16':
        model = vgg19
    elif model_type == 'vgg19':
        model = vgg19
    elif model_type == 'rn':
        model = vgg19
    elif model_type == 'incepv3':
        model = vgg19
    else: 
        model = vgg19

    # model = load_model(os.path.join(BASE_DIR, model_file))
    # while not model:  # wait until model is loaded
    #     time.sleep(5)
    
# you can shift this fn to the classifier.py if you want
def gen_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            image = frame.copy()
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # if model == cnn:
            #   rgb = cv2.resize(rgb, (100, 100)).astype('float32')
            # else:
            rgb = cv2.resize(rgb, (224, 224)).astype('float32')
            rgb = rgb/255.0

            app.logger.info(model.name)

            prob = model.predict(np.expand_dims(rgb, axis=0), verbose=0)[0]
            if len(prob_list) < max_probs:
                prob_list.append(prob)
            else:
                prob_list.pop()
                prob_list.append(prob)

            # prob_avg = np.array(prob_list).mean(axis=0)
            pred_label = np.argmax(prob)
            desc = label_dict[pred_label]
            prob_display = prob[1].item() if pred_label == 1 else prob[0].item()
            text = f'{desc} Behaviour: {round(prob_display,3)}'
            color = (0, 0, 255) if pred_label == 1 else (255, 0, 0)
            image = cv2.putText(image, text, (15, 40), cv2.FONT_HERSHEY_SIMPLEX,
                                1.25, color, 3)
            ret, buffer = cv2.imencode('.jpg', image)

            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result
