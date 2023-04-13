IS4242 Intelligent Systems and Techniques Group Project

Note: Due to the large size of the dataset and models, they have exceeded the limit for storage on GitHub. Therefore, we will provide a link to the external storage location where they can be accessed.

Link to the dataset: https://drive.google.com/drive/folders/1tZ0w1-zcuxzZ95uaLy9zLA9Zvn4dm0D6
Link to the models used: https://drive.google.com/drive/folders/1VKKxMlpr_E7ndMadFKkqE30Jm-mZuaWz
 
Running of ipynb File
1. Open Google Drive and add the folder "IS4242 Project" to MyDrive.
2. Open ipynb file and run in Google Colab.
3. Some of cells especially those cells involve model training and hyperparameter tuning may take more than 7 hours to run.

Content Structure of ipynb File
1. Data Exploration
2. Define common functions required for subsequent model training
   - Functions for File Movement
   - Functions for Image Processing
   - Functions for Cross Validation and Model Training
   - Functions for Performance Metrics Calculation
3. Training of 5 CNN models 
   - Self Constructed CNN (Hyperparameter Tunning using Bayesian Optimisation, Model Training, Model Performance Evaluation)
   - VGG19 (Hyperparameter Tunning using Bayesian Optimisation, Unfreezing Layers, Model Training, Model Performance Evaluation) 
   - VGG16, InceptionV3, ResNet50 (Model Training, Model Performance Evaluation) 
4. LIME for Model Explanability
   - Compare results of self constructed CNN and VGG19
   - Look at images from True Positive and True Negative predictions of both models to deduce the important features extract by the models


Setting up backend
1. Install the backend dependencies with pip. Navigate to the backend folder and run the below command:
pip install -r requirements.txt

Setting up frontend
1. Install the frontend dependencies with npm. Navigate to the frontend folder and run the below command:
npm install

Get started
1. Upload file 'model_vgg19_train1.hdf5' into backend folder
1. Navigate to the frontend folder
2. Run the command to start both the backend and the frontend:
npm run start:server-dev
