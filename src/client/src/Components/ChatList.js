import "./ChatList.css";
import { useEffect, useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { NavLink } from "react-router-dom";

const ChatList = () => {
  const { userId } = useContext(AppContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`./api/chats?userId=${userId}`);
      const newChats = await res.json();
      console.log(newChats);
      setChats(newChats);
    };

    fetchChats();
  }, [userId]);

  return (
    <div className="list-container">
      <div className="header">Chats</div>
      {chats.map((chat) => (
        <NavLink
          className="list-item"
          to={`/${chat.roomId}`}
          key={chat.roomId}
          activeClassName="list-item-active"
        >
          <div className="avatar">{chat.roomName[0].toUpperCase()}</div>
          <p className="name">{chat.roomName}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default ChatList;
