import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
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

  const handleSelect = async (u) => {
    dispatch({ type: "CHANGE_USER", payload: u.userInfo });

    const chats = Object.entries(document.getElementsByClassName("chats"))[0][1];
    const user = Object.entries(chats.getElementsByClassName(`${u.userInfo.displayName}`))[0][1];
    for (let c of chats.childNodes) {
      if (c.classList.contains("bgColor")) {
        c.classList.remove("bgColor");
      }
    }
    user.classList.add("bgColor");

    if (user.classList.contains("userChatMsg")) {
      user.classList.remove("userChatMsg");
      const chatId = currentUser.displayName > u.userInfo.displayName
        ? currentUser.displayName + u.userInfo.displayName
        : u.userInfo.displayName + currentUser.displayName;

      // console.log(chatId);
      await updateDoc(doc(db, "userChats", currentUser.displayName), {
        [chatId + ".count"]: 0,
        [chatId + ".lastMessage"]: {
          text: u.lastMessage.text,
          count: "count",
        },
      });
      console.log(user.classList);
    }


  };

  return (
    <div className="chats" >
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        <div
          className={`userChat ${chat[1]?.lastMessage?.className} ${chat[1].userInfo?.displayName}`}
          key={chat[0]}
          onClick={() => handleSelect(chat[1])}
        >
          <img src={chat[1].userInfo?.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo?.displayName}</span>
            <div className='msgInfo'>
              <div className="imgInfo">
                {/* <img className={`${chat[1]?.send}`} src={Send} alt="" />
                <img className={`${chat[1]?.seen}`} src={Seen} alt="" /> */}
              </div>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
          <div className={`${chat[1]?.lastMessage?.count}`}>{chat[1]?.count}</div>
        </div>
      ))}
    </div>
  );
};

export default Chats;