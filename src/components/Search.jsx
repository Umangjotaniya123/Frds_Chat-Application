import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import Message from "./Message";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);

  const handleSearch = async () => {
    setUser(null);
    setErr(false);
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    const querySnapshot = await getDocs(q);
    try {
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {

    const chats = Object.entries(document.getElementsByClassName("chats"))[0][1];
    const sidebar = Object.entries(document.getElementsByClassName("sidebar"))[0][1];
    const chat = Object.entries(document.getElementsByClassName("chat"))[0][1];
    sidebar.classList.add("sidebar_mobile");
    chat.classList.remove("chat_mobile");

    //check whether the group(chats in firestore) exists, if not create
    dispatch({type: "CHANGE_USER", payload: user});
    const combinedId = currentUser.displayName > user.displayName
    ? currentUser.displayName + user.displayName
    : user.displayName + currentUser.displayName;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { 
          [currentUser.displayName]: [],
          [user.displayName]: [],
        });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.displayName), {
          [combinedId + ".userInfo"]: {
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".count"] : 0,
          [combinedId + ".lastMessage"]: {
            count: "count",
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.displayName), {
          [combinedId + ".userInfo"]: {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".count"] : 0,
          [combinedId + ".lastMessage"]: {
            count: "count",
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }

    const userChat = Object.entries(document.getElementsByClassName(`${user?.displayName}`));
    for (let c of chats.childNodes) {
      if(c.classList.contains("bgColor")){
        c.classList.remove("bgColor");
      }
    }
    userChat[0][1].classList.add("bgColor");

    setUser(null);
    setUsername("")
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;