import React, { useContext, useState, useEffect } from "react";
import Img from "../images/img.png"
import Attach from "../images/attach.png"
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { onSnapshot, serverTimestamp, Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Input = () => {

    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [cnt, setCnt] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const chatId = data.chatId;
    // console.log(data.chatId);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", `${data.user.displayName}`), (doc) => {
                setCnt(doc.data()[chatId]?.count);
            });

            return () => {
                unsub();
            };
        };

        data.user.displayName && getChats();
    }, [data.user.displayName]);

    const handleSend = async () => {

        if (img) {
            const storageRef = ref(storage, uuid());
            await uploadBytesResumable(storageRef, img).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateDoc(doc(db, 'chats', data.chatId), {
                        [currentUser.displayName + ".messages"] : arrayUnion({
                            id: uuid(),
                            text,
                            senderId: currentUser.displayName,
                            date: Timestamp.now(),
                            img: downloadURL,
                        }),
                        [data.user.displayName + ".messages"] : arrayUnion({
                            id: uuid(),
                            text,
                            senderId: currentUser.displayName,
                            date: Timestamp.now(),
                            img: downloadURL,
                        }),
                    });
                });
            })
        }
        else if (text) {
            await updateDoc(doc(db, "chats", data.chatId), {
                [currentUser.displayName + ".messages"]: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.displayName,
                    date: Timestamp.now(),
                }),
                [data.user.displayName + ".messages"]: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.displayName,
                    date: Timestamp.now(),
                }),
            });
        }

        if (text) {
            await updateDoc(doc(db, "userChats", currentUser.displayName), {
                [data.chatId + ".send"]: "send",
                [data.chatId + ".seen"]: "",
                [data.chatId + ".lastMessage"]: {
                    text,
                    count: 'count',
                    image: img ? 'show' : '',
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.displayName), {
                [data.chatId + ".seen"]: "",
                [data.chatId + ".send"]:  "",
                [data.chatId + ".count"]: cnt + 1,
                [data.chatId + ".lastMessage"]: {
                    text,
                    className: "userChatMsg",
                    count: "countInfo",
                    image: img ? 'show' : '',
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
        }
        else if (img) {
            await updateDoc(doc(db, "userChats", currentUser.displayName), {
                [data.chatId + ".seen"]: "",
                [data.chatId + ".send"]: "send",
                [data.chatId + ".lastMessage"]: {
                    text: "Image",
                    count: 'count',
                    image: 'show',
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.displayName), {
                [data.chatId + ".seen"]: "",
                [data.chatId + ".send"]:  "",
                [data.chatId + ".count"]: cnt + 1,
                [data.chatId + ".lastMessage"]: {
                    text: "Image",
                    className: "userChatMsg",
                    count: "countInfo",
                    image: 'show',
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
        }


        setText("");
        setImg(null);

    }

    return (
        <div className="input">
            <input
                type="text"
                placeholder="Type something..."
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <div className="send">
                <img src={Attach} alt="" />
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="file"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="file">
                    <img src={Img} alt="" />
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Input;