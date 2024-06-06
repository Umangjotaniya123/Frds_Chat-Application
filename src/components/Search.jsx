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

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

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
    } catch (erroor) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    dispatch({type: "CHANGE_USER", payload: user});
    const combinedId = currentUser.displayName > user.displayName
    ? currentUser.displayName + user.displayName
    : user.displayName + currentUser.displayName;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.displayName), {
          [combinedId + ".userInfo"]: {
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.displayName), {
          [combinedId + ".userInfo"]: {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {}

    const chats = Object.entries(document.getElementsByClassName("chats"))[0][1];
    const userChat = Object.entries(chats.getElementsByClassName(`${user.displayName}`))[0][1];
    for (let c of chats.childNodes) {
      if(c.classList.contains("bgColor")){
        c.classList.remove("bgColor");
      }
    }
    userChat.classList.add("bgColor");

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