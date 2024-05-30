import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();
    // console.log(currentUser);
    // console.log(data);


    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`message ${message.senderId === currentUser.displayName && "owner"}`}
        >
            <div className="messageInfo">
                <img
                    src={
                        message.senderId === currentUser.displayName
                            ? currentUser.photoURL
                            : data.user?.photoURL
                    }
                    alt=""
                />
                {/* <span>just now</span> */}
            </div>
            <div className="messageContent">
                {message.text && <p>{message.text}</p>}
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    );
};

export default Message;