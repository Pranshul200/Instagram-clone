import React, {useState, useEffect} from 'react';
import './Post.css';
//Used Material Ui to import the Avatar
import { Avatar } from '@material-ui/core';
import { db } from './Firebase';
import firebase from 'firebase';


function Post({postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = React.useState([]);
    const [comment, setComment] = React.useState('');
    React.useEffect(() =>{
        let unsubscribe;
        if(postId){
        unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((doc) =>doc.data()));
        });

        return () =>{
            unsubscribe();
        };
    }
    // here postId id dependency
    }, [postId]);

    const postcomment = (event) =>{
      event.preventDefault();
      db.collection("posts").doc(postId).collection("comments").add({
          text:comment,
          username:user.displayName,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()
      });
      setComment('');

    }

    return (
        <div className="post">
            <div className="post_header">
                {/* header -> avatar + username */}
                <Avatar 
                        className="post_Avatar"
                        alt="Pranshul200k"
                        src="/static/images/avatar/1.jpg"
                        
                />
                <h3>{username}</h3>
            </div>
            <img className="postimage" src={imageUrl} alt=""
            />
            {/* image */} 
            <h4 className="post_Text"><strong>{username}</strong> {caption}</h4>

            <div className="post_comments">
                {comments.map((comment) =>(
                    <p>
                    <strong>{comment.username}</strong>{comment.text}
                    </p>
                ))}

            </div>

            {/* usernamer + caption */}
            {user && (
                <form className="post_commentBox">
                <input
                  className="post_input"
                  type="text"                
                  placeholder="Add a Comment .."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button 
                  className="post_button"  
                  disabled={!comment}
                  type="submit"
                  onClick={postcomment}
                >Post</button>

        
            </form>

            )}



          
            
        </div>
    )
}

export default Post
