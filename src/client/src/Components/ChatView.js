import "./ChatList.css";
import "./ChatView.css";
import { useState, useEffect, useRef, useContext } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";

const ChatView = () => {
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId } = useContext(AppContext);
  const list = useRef(null);
  let { roomId } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`./api/messages?roomId=${roomId}`);
      const newMessages = await res.json();
      console.log(newMessages);
      console.log(userId);
      setMessages(newMessages);
      scrollToBottom();
    };

    fetchMessages();

    const newSocket = io();

    newSocket.on("message", (message) => {
      console.log(message);
      setMessages((oldMessages) => [...oldMessages, message]);
      // TODO: scroll only if username == user
      scrollToBottom();
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, roomId, userId]);

  const scrollToBottom = () => {
    list.current.scrollTop = list.current.scrollHeight;
  };

  const handleClick = (e) => {
    const newText = text.trim();
    if (newText.length === 0) return;
    e.preventDefault();
    socket.emit("message", newText, roomId, userId);
    setText("");
  };

  const formatHour = (numericDate) => {
    let d = new Date(numericDate);
    let hour = d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return hour.toString();
  };

  return (
    <div className="chat-view">
      <div className="appbar">
        <div className="avatar contrastAvatar">P</div>
        <div className="name contrastName">Pedro</div>
      </div>
      <div className="messages" ref={list}>
        {messages &&
          messages.map((message, idx) => (
            <div
              className={
                "message-box " +
                (message.user._id === userId
                  ? "message-box-right"
                  : "message-box-left")
              }
              key={idx}
            >
              <span className="message-content">{message.content}</span>
              <span className="message-date">{formatHour(message.date)}</span>
            </div>
          ))}
      </div>
      <div className="input-box">
        <textarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyPress={(e) => (e.key === "Enter" ? handleClick(e) : null)}
        />
        <button onClick={handleClick}>
          <RiSendPlaneFill />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
