import React, { useContext } from 'react'
import Messages from './Messages';
import Arrow from '../images/arrow.webp';
import { useNavigate } from 'react-router-dom';
import Delete from '../images/delete.png';
import Input from './Input';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';

const Chat = () => {

  const { data } = useContext(ChatContext);
  const { dispatch } = useContext(ChatContext);
  const user = data.user.displayName;
  const navigate = useNavigate();
  // console.log(data);

  const handleClick = () => {
    dispatch({ type: "REMOVE_USER", playload: {} });

    const chats = Object.entries(document.getElementsByClassName("chats"))[0][1].childNodes;
    for (let c of chats) {
      if (c.classList.contains("bgColor")) {
        c.classList.remove("bgColor");
      }
    }

    // const sidebar = Object.entries(document.getElementsByClassName("sidebar"))[0][1];
    // const chat = Object.entries(document.getElementsByClassName("chat"))[0][1];
    // sidebar.classList.remove("sidebar_mobile");
    // chat.classList.add("chat_mobile");

    navigate("/");
    // console.log(data);
  }

  return (
    <div className='chat chat_mobile'>
      {user && <>
        <div className="chatInfo">
          <img className='back' onClick={handleClick} src={Arrow} alt='' />
          <span>{data.user?.displayName}</span>
          <div className="chatIcons">
            <img src={Delete} alt="" />
          </div>
        </div>
        <Messages />
        <Input />
      </>}
    </div>
  )
}

export default Chat;