import React, { useContext, useState, useEffect } from 'react'
import Message from './Message';
import { ChatContext } from '../Context/ChatContext';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from '../Context/AuthContext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const name = currentUser.displayName;

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data()[name].messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // console.log(messages);


  return (
    <div className="messages">
      {messages?.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;