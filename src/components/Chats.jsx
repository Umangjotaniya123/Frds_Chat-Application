import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Photo from '../images/photo.png';
import Seen from '../images/seen.png'
import Send from '../images/send.png'

const Chats = () => {

  const [chats, setChats] = useState([]);
  const [cnt, setCnt] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);

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

  // useEffect(() => {
  //   console.log(cnt);
  //   // handleChange();
  // }, [cnt]);

  const handleSelect = async (u) => {
    // console.log(u);

    dispatch({ type: "CHANGE_USER", payload: u.userInfo });

    const chats = Object.entries(document.getElementsByClassName("chats"))[0][1];
    const user = Object.entries(chats.getElementsByClassName(`${u.userInfo.displayName}`))[0][1];
    for (let c of chats.childNodes) {
      if (c.classList.contains("bgColor")) {
        c.classList.remove("bgColor");
      }
    }

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
          image: u.lastMessage.image,
        },
      });
      await updateDoc(doc(db, "userChats", u.userInfo.displayName), {
        [chatId + ".send"]: "",
        [chatId + ".seen"]: "seen",
      });
    }
    user.classList.add("bgColor");


  };

  const handleChange = async (m) => {
    // console.log(e);

    if(m.lastMessage && m.userInfo){
      const user = Object.entries(document.getElementsByClassName(`${m.userInfo.displayName}`));

      if (data?.user.displayName === m.userInfo.displayName) {
        const text = m.lastMessage?.text;
        // const Id = m.lastMessage?.Id;
        const chatId = currentUser.displayName > m.userInfo.displayName
        ? currentUser.displayName + m.userInfo.displayName
        : m.userInfo.displayName + currentUser.displayName;
        // console.log(m);

        if(!m.count && m.send === "" && m.seen === "" && m.lastMessage.text){
          await updateDoc(doc(db, "userChats", m.userInfo.displayName), {
            [data.chatId + ".send"]: "",
            [data.chatId + ".seen"]: "seen",
          });
        }
        await updateDoc(doc(db, "userChats", currentUser.displayName), {
          [chatId + ".count"]: 0,
          [chatId + ".lastMessage"]: {
            text,
            count: "count",
        },
        });
        user[0][1].classList.add("bgColor");

      }

    }
    
  }

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
                <img className={`${chat[1]?.send}`} src={Send} alt="" />
                <img className={`${chat[1]?.seen}`} src={Seen} alt="" />
              </div>
              <div className='image' >
                <img className={`${chat[1]?.lastMessage?.image}`} src={Photo} alt="" />
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          </div>
          <div className={`${chat[1]?.lastMessage?.count}`} onChange={handleChange(chat[1])}>{chat[1]?.count}</div>
        </div>
      ))}
    </div>
  );
};

export default Chats;