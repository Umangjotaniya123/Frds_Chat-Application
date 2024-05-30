import React, { useState } from 'react'
import Add from '../images/addAvatar.png'
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";



const Register = () => {

  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmite = async (e) => {
    e.preventDefault();
    setLoading(true);
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    // console.log(displayName);

    try {
      //creat user...
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name...
      
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName}` + date);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", `${displayName}`), {
              displayName,
              email,
              photoURL: downloadURL,
              password: password,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", `${displayName}`), {});
            navigate("/");

          } catch (error) {
            console.log("err-", error);
            setErr(true);
            setLoading(false);
          }
        })
      })

    } catch (error) {
      setErr(true);
      console.log(error);
      setLoading(false);
    }

  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Frds_Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmite}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;