import React, { useContext } from 'react'
import Messages from './Messages';
import Arrow from '../images/arrow.webp';
import { useNavigate } from 'react-router-dom';
import Delete from '../images/delete.png';
import { db, storage } from "../firebase";
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import Input from './Input';
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const Chat = () => {

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { dispatch } = useContext(ChatContext);
  const user = data.user.displayName;
  const navigate = useNavigate();
  // console.log(data);

  const handleClick = () => {
    dispatch({ type: "REMOVE_USER", payload: {} });

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

  const handleDelete = async () => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: []
    });

    await updateDoc(doc(db, "userChats", data.user.displayName), {
      [data.chatId + ".count"]: 0,
      [data.chatId + ".seen"]: "",
      [data.chatId + ".send"]:  "",
      [data.chatId + ".lastMessage"]: {
        count: "count",
        text: "",
      },
    });

    await updateDoc(doc(db, "userChats", currentUser.displayName), {
      [data.chatId + ".count"]: 0,
      [data.chatId + ".send"]: "",
      [data.chatId + ".seen"]: "",
      [data.chatId + ".lastMessage"]: {
        text: "",
        count: "count",
      },
    });

  }

  return (
    <div className='chat chat_mobile'>
      {user && <>
        <div className="chatInfo">
          <img className='back' onClick={handleClick} src={Arrow} alt='' />
          <span>{data.user?.displayName}</span>
          <div className="chatIcons">
            <img onClick={handleDelete} src={Delete} alt="" />
          </div>
        </div>
        <Messages />
        <Input />
      </>}
    </div>
  )
}

export default Chat;