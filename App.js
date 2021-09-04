import logo from './logo.svg';
import './App.css';
import Post from './Post';
import ImageUpload from './Imageupload';
import React,{useState, useEffect} from 'react';
import {db, auth} from './Firebase';
import {Button, makeStyles} from '@material-ui/core';
import { Modal } from '@material-ui/core';
import {ModalStyle} from '@material-ui/core';
import { Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';


// here comes the stying of modal css directly copied from Material.Ui

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
 
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [user, setUser] = React.useState(null);
  const [opensignIn, setOpensignIn] = React.useState(false);
  // we cannot write the posts again and again so we use hooto fetch it ,Here this posts variable is working like a array conataining elements post
  const [posts, setPosts] = React.useState([
    // {
    //   username:"pranshul200k",
    //   caption:"Always learn from your mistake",
    //   imageUrl:"https://www.fg-a.com/wallpapers/2020-mountain-granite-peak-image.jpg"
    // },
    // {
    //   username:"himanshi200k",
    //   caption:"Cutiepie",
    //   imageUrl:"https://cdn.i-scmp.com/sites/default/files/d8/images/methode/2019/12/12/2fa2638e-1ca7-11ea-8971-922fdc94075f_image_hires_174609.JPG"
    // }
  ]);
 
  React.useEffect(() =>{
    // this onAuthStateChanged keeps me logged in 
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        // Means user logged in
        console.log(authUser);
        // Now when someone logged in we need to set its state 
        setUser(authUser);
        
        
      }
      else{
        // means the user is logged out
        setUser(null);
      }
    })

    return () =>{
      // perfom the clean up of the last username when we change the username
      unsubscribe();
    }

  }, []);
  // useEffect another hook that we have which runs a piece of code based on a specific condition
  React.useEffect(() => {
    // this is where our code runs
    // this snapshot keyword basically used to take the snap at the instant every single time when someone change the data in firebase
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=> {
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const SignUp = (event) =>{
    // To prevent the form reload/refresh
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    // we need to clode the modal once done eith the sign in
    setOpen(false);

  }


  // login function

  const signIn = (event) =>{
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message));
    
    setOpensignIn(false);
  }
  

  return (
    
    <div className="App">

      {/* Here we deine a modal from materialUi basically it is the UI which something like popup and ask Username/email id and Password */}
     <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <div>
          <form className="app_signup"> 
            <center>
              <img className="App_headerimage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
            </center>
            <Input
             
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          
            <Input
              placeholder="email"
              type="text"
              
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              placeholder="password"
              type="password"
              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button  type="submit" onClick={SignUp}>Sign Up</Button>

          </form>
          
       
        </div>
      </div>
      </Modal>


      {/* for login button we need another modal */}
      <Modal
        open={opensignIn}
        onClose={() => setOpensignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <div>
          <form className="app_signup">  
            <center>
              <img className="App_headerimage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              placeholder="password"
              type="password"
              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button  type="submit" onClick={signIn}>Sign IN</Button>

          </form>
          
       
        </div>
      </div>
      </Modal>
      {/* So definately we need a button to login and all */}
     
      

      
      <div className="App-Header">
         <img className="App_headerimage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      
        ): (
        <div className="app_logincontiner">
          <Button onClick={() => setOpensignIn(true) }>Login</Button>
          <Button onClick={() => setOpen(true) }>Sign Up</Button>
        </div>
        )
        }  
      </div>
      
      {/* Obiously we dont want same post everytime so we need to pass the username post link and rest thing every time  */}
      {/* posts.map just call all the post one by one  */}
      <div className="app__posts">
        {
          posts.map(({id, post})=>(
              <Post key = {id} user={user} postId = {id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
          ))
        } 
        
      </div>
      <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        // clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />

      
      
      
    
      
      {/* Now i want some i can post my pic directly  and intead ofwriting here let me create another file */}
      {user?.displayName ? (
        <ImageUpload  username={user.displayName}/>
      ): (
        <h2>Sorry you need to Login to upload</h2>

      )
      }  

    </div>
  );

    }
export default App;
