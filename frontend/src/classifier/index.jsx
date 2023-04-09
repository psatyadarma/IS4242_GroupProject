import React, { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect";
import Button from '@material-ui/core/Button';

const Classifier = () => {

  const [result, setResult] = useState("");

  const [imageFile, setImageFile] = useState(false);
  const [image, setImage] = useState(false);
  const [imagePrediction, setImagePrediction] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <img className='feedContent'
            src="http://localhost:5000/video_feed"
            alt="Video">
          </img>
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