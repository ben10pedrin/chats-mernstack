import "./ChatList.css";
import { useEffect, useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { AiOutlinePlus } from "react-icons/ai";
import IconButton from "./IconButton";
import ContactModal from "./ContactModal";
import ListItem from "./ListItem";

const ChatList = () => {
  const { userId } = useContext(AppContext);
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`./api/rooms/${userId}`);
      const newChats = await res.json();
      console.log(newChats);
      setChats(newChats);
    };

    fetchChats();
  }, [userId]);

  return (
    <>
      <div className="list-container">
        <div className="header">
          <p className="title">Chats</p>
          <IconButton onClick={() => setOpen(true)}>
            <AiOutlinePlus />
          </IconButton>
        </div>
        {chats.map((chat) => (
          <ListItem
            name={chat.roomName}
            className="list-item"
            to={`/${chat.roomId}`}
            key={chat.roomId}
            activeClassName="list-item-active"
          />
        ))}
        {open && <ContactModal setOpen={setOpen} />}
      </div>
    </>
  );
};

export default ChatList;
