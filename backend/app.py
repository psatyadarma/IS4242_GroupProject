import os
from flask import Flask, render_template, request
from reverseProxy import proxyRequest
from classifier import classifyImage

MODE = os.getenv('FLASK_ENV')
DEV_SERVER_URL = 'http://localhost:3000/'

app = Flask(__name__)

# Ignore static folder in development mode.
if MODE == "development":
    app = Flask(__name__, static_folder=None)

@app.route('/')
@app.route('/<path:path>')
def index(path=''):
    if MODE == 'development':
        return proxyRequest(DEV_SERVER_URL, path)
    else:
        return render_template("index.html") 

@app.route('/classify', methods=['POST'])
def classify():
    if (request.files['image']): 
        file = request.files['image']

        result = classifyImage(file)
        app.logger.info('Model classification: ' + result)
        return result

'''
from flask import Flask, render_template, Response
import cv2
from tensorflow import keras
import numpy as np
m = keras.models.load_model('model')
label_dict = {0:'Normal', 1:'Suspicious'}
prob_list = []
max_probs = 50

app = Flask(__name__)

#camera = cv2.VideoCapture('')  # use 0 for web camera
camera = cv2.VideoCapture(0)

# you can shift this fn to the classifier.py if you want
def gen_frames():  
    while True:
        success, frame = camera.read()  
        if not success:
            break
        else:
            image = frame.copy()
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            rgb = cv2.resize(rgb,(224,224)).astype('float32')
            rgb = rgb/255.0
            prob = m.predict(np.expand_dims(rgb,axis=0),verbose=0)[0]
            if len(prob_list) < max_probs:
                prob_list.append(prob)
            else:
                prob_list.pop()
                prob_list.append(prob)

            prob_avg = np.array(prob_list).mean(axis=0)
            
            pred_label = np.where(prob_avg > 0.5,1,0)[0]
            desc = label_dict[pred_label]
            text = f'{desc} Behaviour'
            color = (0,0,255) if pred_label == 1 else (255,0,0)
            image = cv2.putText(image, text, (15,40), cv2.FONT_HERSHEY_SIMPLEX,
                    1.25, color, 3)
            ret, buffer = cv2.imencode('.jpg', image)

            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result

# i've used flask for the test web app that i made, i think you can just switch the routes to the one you used in react
@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)'''