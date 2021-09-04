import { Button } from '@material-ui/core';
import React,{useState} from 'react';
// Here it comes when we use the storage of fire base to send our post there
import {db , storage} from './Firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [image, setImage] = React.useState(null);
    // progress bar will show how much our post upload is completed
    const [progress, SetProgress] = React.useState(0);
    const [caption, setCaption] = React.useState('');

    // e = any
    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        } 
    }

    const handleUpload = () =>{
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
          "state_changed",
          (snapshot) =>{
              //   progress function ... 
              // this below equation just give me a no.for the progress
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              SetProgress(progress); 
          },
          (error) =>{
            //   Error Func .. 
              console.log(error);
              console.log(error.message);
          },
          () =>{
            //   just copied it snippet of code
            //    complete funtion
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url, 
                    username

                });
                SetProgress(0);
                setCaption("");
                setImage(null);
            });

          }


      );
    };
    return (
        <div className="ImageUpload">
          {/* 1 caption input */}
          {/* 2 file picker */}
          {/* 3 post button  */}
          <progress className="imageUplaod_progress" value={progress} max="100"/>
          <input type="text" placeholder="Enter a Caption.." onChange={event => setCaption(event.target.value)}/>
          <input type="file" onChange={handleChange}/>
          <Button  onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
