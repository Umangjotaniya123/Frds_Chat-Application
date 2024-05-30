import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase.js';
// import { Box, Container, Heading, Input, VStack, Button, Text } from '@chakra-ui/react';


const Login = () => {

  const navigate = useNavigate();
  const [err, setErr] = useState(false);

  const handleSubmite = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");

    } catch (error) {
      setErr(true);
    }
  }

  return (
    <>
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Frds_Chat</span>
          <span className="title">Login</span>
          <form onSubmit={handleSubmite}>
            <input type="email" placeholder='Email' />
            <input type="password" placeholder='Password' />
            <button>Sign in</button>
            {err && <span>Something went wrong</span>}
          </form>
          <p>You don't have any account? <Link to='/register'>Register</Link></p>
        </div>
      </div>
    </>
  )
}

export default Login