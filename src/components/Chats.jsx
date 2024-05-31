import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Chats = () => {

  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.displayName), (chat) => {
        setChats(chat.data());
      });

      return () => unsub();
    };

    currentUser.displayName && getChats();
  }, [currentUser.displayName]);

  // console.log(Object.entries(chats));

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });

    const chats = Object.entries(document.getElementsByClassName("chats"))[0][1];
    const user = Object.entries(chats.getElementsByClassName(`${u.displayName}`))[0][1];
    for (let c of chats.childNodes) {
      if(c.classList.contains("bgColor")){
        c.classList.remove("bgColor");
      }
    }
    user.classList.add("bgColor");
  };

  return (
    <div className="chats" >
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        <div
          className={`userChat ${chat[1].userInfo?.displayName}`}
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;