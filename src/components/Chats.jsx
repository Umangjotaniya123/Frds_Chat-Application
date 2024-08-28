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
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);

  const style = {
    color: 'rgb(255, 255, 255)',
    fontStyle: 'italic',
  };

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', `${currentUser.displayName}_${currentUser.uid}`), (chat) => {
        setChats(chat.data());
      });

      return () => unsub();
    };

    currentUser.displayName && getChats();
  }, [currentUser.displayName]);

  const handleSelect = async (u) => {

    const sidebar = Object.entries(document.getElementsByClassName("sidebar"))[0][1];
    const chat = Object.entries(document.getElementsByClassName("chat"))[0][1];
    sidebar.classList.add("sidebar_mobile");
    chat.classList.remove("chat_mobile");

    await dispatch({ type: "CHANGE_USER", payload: u.userInfo });

    if (u.count > 0) {
      const chatId = currentUser.displayName > u.userInfo.displayName
        ? (currentUser.displayName) + '_' + currentUser.uid + '_' + (u.userInfo.displayName) + '_' + u.userInfo.uid
        : (u.userInfo.displayName) + '_' + u.userInfo.uid + '_' + (currentUser.displayName) + '_' + currentUser.uid;
      let text = "";
      if (u?.lastMessage?.text) text = u.lastMessage.text;

      await updateDoc(doc(db, "userChats", `${currentUser.displayName}_${currentUser.uid}`), {
        [chatId + ".count"]: 0,
        [chatId + ".lastMessage"]: {
          text,
          image: u?.lastMessage?.image,
        },
      });
      await updateDoc(doc(db, "userChats", `${u.userInfo.displayName}_${u.userInfo.uid}`), {
        [chatId + ".send"]: "",
        [chatId + ".seen"]: "seen",
      });
    }
  };

  const handleChange = async (m) => {

    if (m.lastMessage && m.userInfo) {
      const chatId = currentUser.displayName > m?.userInfo?.displayName
        ? (currentUser.displayName) + '_' + currentUser.uid + '_' + (m?.userInfo?.displayName) + '_' + m?.userInfo?.uid
        : (m?.userInfo?.displayName) + '_' + m?.userInfo?.uid + '_' + (currentUser.displayName) + '_' + currentUser.uid;

      if (data?.user.displayName === m.userInfo.displayName) {
        const text = m?.lastMessage?.text;

        if (!m.count && m.send === "" && m.seen === "" && m?.lastMessage?.text) {
          await updateDoc(doc(db, "userChats", `${m.userInfo.displayName}_${m.userInfo.uid}`), {
            [chatId + ".send"]: "",
            [chatId + ".seen"]: "seen",
          });
        }
        await updateDoc(doc(db, "userChats", `${currentUser.displayName}_${currentUser.uid}`), {
          [chatId + ".count"]: 0,
          [chatId + ".lastMessage"]: {
            text,
            image: m?.lastMessage?.image,
          },
        });
      }

      if (!m?.lastMessage?.text) {
        await updateDoc(doc(db, "userChats", `${currentUser.displayName}_${currentUser.uid}`), {
          [chatId + ".seen"]: "",
        });
      }
    }


  }

  return (
    <div className="chats" >
      {Chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        <div
          className={`userChat ${chat[1].userInfo?.displayName}`}
          key={chat[0]}
          onClick={() => handleSelect(chat[1])}
          style={
            data?.user.displayName === chat[1].userInfo?.displayName ? 
            {backgroundColor: '#2f2d52'} : {}
          }
        >
          <img src={chat[1].userInfo?.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo?.displayName}</span>
            <div className='msgInfo'>
              <div className="imgInfo">
                {chat[1]?.send && <img src={Send} alt="" />}
                {chat[1]?.seen && <img src={Seen} alt="" />}
              </div>
              <div className='image' >
                {chat[1]?.lastMessage?.image && <img src={Photo} alt="" />}
                <p onChange={handleChange(chat[1])} style={
                  chat[1]?.count > 0 ? style : {}
                }>{chat[1]?.lastMessage?.text}</p>
              </div>
            </div>
          </div>
          {chat[1]?.count > 0 && <div className='countInfo'>{chat[1]?.count}</div>}
        </div>
      ))}
    </div>
  );
};

export default Chats;