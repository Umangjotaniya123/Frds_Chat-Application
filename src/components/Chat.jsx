import React, { useContext } from 'react'
import Messages from './Messages';
import Input from './Input';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';

const Chat = () => {

  const { data } = useContext(ChatContext);
  // console.log(data);

  return (
    <div className='chat chat_mobile'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat;