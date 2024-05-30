import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.js';

const Navbar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className='navbar'>
        <span className="logo">Frds_Chat</span>
        <div className="user">
            <img src={currentUser.photoURL} alt="" />
            <span>{currentUser.displayName}</span>
            <button onClick={()=> signOut(auth)}>Logout</button>
        </div>
    </div>
  )
}

export default Navbar;