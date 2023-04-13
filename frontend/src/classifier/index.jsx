import React, { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect";
import Button from '@material-ui/core/Button';
import CircularProgress from '@mui/material/CircularProgress';

const Classifier = () => {

  const [model, setModel] = useState("vgg19");
  const [result, setResult] = useState("");
  const [imageFile, setImageFile] = useState(false);
  const [image, setImage] = useState(false);
  const [imagePrediction, setImagePrediction] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  });

  const handleSwitch = async (model) => {

    setLoading(true)
    setModel(model)
    setTimeout(() => setLoading(false), 1000);

    const response = await fetch('/switch', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({model_type: model})
    });

    if (response.status === 200) {
      console.log('success')
    } else {
      console.log('failed')
    }
  }

  const handleFileInput = (event) => {
    setImagePrediction(false);

    if (event.target.files[0]) {
      // converts image to url
      setImageFile(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    } else {
      setImageFile(false);
    }
  }

  const clearUserInput = (event) => {
    setImagePrediction(false);
    setImageFile(false);
  }

  const handlePrediction = async (event) => {
    // clear previous predictions
    setImagePrediction(false);

    if (image) {
      // run the prediction
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/classify', {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const text = await response.text();
        setResult(text);
        console.log('success')
      } else {
        console.log('failed')
        setResult("Error from API.");
      }

      // setImagePrediction(predictions);
      setLoading(false);
    } else {
      alert('Please upload an image');
    }
  }

  return (
    <>
      <section className='hero'>
        <div className='heroContent'>
          <h3 className='fontSize' data-aos='fade-right'>
            IS4242 Group 6
          </h3>
          <h1>
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString('CHEATING DETECTOR')
                  .start();
              }}
            />
          </h1>
          <Button
            variant="contained"
            component="span"
            onClick={() => handleSwitch('cnn')}
            style={{ backgroundColor: model == 'cnn' ? "#e0a80d" : "transparent", color: 'white', borderRadius: 50, border: '2px solid', borderColor: "#e0a80d", marginLeft: '20px' }}>
            CNN
          </Button>
          <Button
            variant="contained"
            component="span"
            onClick={() => handleSwitch('vgg16')}
            style={{ backgroundColor: model == 'vgg16' ? "#e0a80d" : "transparent", color: 'white', borderRadius: 50, border: '2px solid', borderColor: "#e0a80d", marginLeft: '20px' }}>
            VGG-16
          </Button>
          <Button
            variant="contained"
            component="span"
            onClick={() => handleSwitch('vgg19')}
            style={{ backgroundColor: model == 'vgg19' ? "#e0a80d" : "transparent", color: 'white', borderRadius: 50, border: '2px solid', borderColor: "#e0a80d", marginLeft: '20px' }}>
            VGG-19
          </Button>
          <Button
            variant="contained"
            component="span"
            onClick={() => handleSwitch('incepv3')}
            style={{ backgroundColor: model == 'incepv3' ? "#e0a80d" : "transparent", color: 'white', borderRadius: 50, border: '2px solid', borderColor: "#e0a80d", marginLeft: '20px' }}>
            Inception V3
          </Button>
          <Button
            variant="contained"
            component="span"
            onClick={() => handleSwitch('rn')}
            style={{ backgroundColor: model == 'rn' ? "#e0a80d" : "transparent", color: 'white', borderRadius: 50, border: '2px solid', borderColor: "#e0a80d", marginLeft: '20px' }}>
            RESNET50
          </Button>
          {loading
            ? <div className='spinner'> <CircularProgress /><br />Loading model...</div>
            :
            <img className='feedContent'
              src="http://localhost:5000/video_feed"
              alt="Video">
            </img>
          }
          {/* <div className='imageUploadInput'>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="contained-button-file"
              onChange={handleFileInput}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                style={{ backgroundColor: 'transparent', color: 'white', borderRadius: 50, border: '2px solid', borderColor: "#e0a80d", marginLeft: '20px' }}>
                Upload
              </Button>
            </label>
            <Button
              variant="contained"
              component="span"
              onClick={clearUserInput}
              style={{ backgroundColor: '#e0a80d', borderRadius: 50, marginLeft: '20px', border: '2px solid', borderColor: "#e0a80d" }}>
              Clear
            </Button>
          </div>
          {imageFile && <img id='recogImage' className='imageUploadPreview' src={imageFile} alt='Upload be predicted' />}
          <div>
            {imageFile &&
              <Button
                variant="contained"
                component="span"
                onClick={handlePrediction}
                style={{ backgroundColor: 'transparent', color: 'white', borderRadius: 50, border: '2px solid', borderColor: "#e0a80d", marginLeft: '20px' }}>
                Classify
              </Button>
            }
          </div>
          <p>The predicted class is: {result}</p> */}
        </div>
      </section>
    </>
  )
};

export default Classifier;