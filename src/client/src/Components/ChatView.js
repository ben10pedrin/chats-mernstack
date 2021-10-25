import "./ChatList.css";
import "./ChatView.css";
import { useState, useEffect, useRef, useContext } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";

const ChatView = ({ messages, setMessages }) => {
  const [text, setText] = useState("");
  const { socket, userId } = useContext(AppContext);
  const list = useRef(null);
  let { roomId } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`./api/messages/${roomId}`);
      const newMessages = await res.json();
      console.log(newMessages);
      setMessages(newMessages);
      scrollToBottom();
    };

    fetchMessages();
  }, [roomId, setMessages]);

  const scrollToBottom = () => {
    list.current.scrollTop = list.current.scrollHeight;
  };

  const handleClick = (e) => {
    e.preventDefault();
    const newText = text.trim();
    if (newText.length === 0) return;
    socket.emit("new-message", { content: newText, roomId, userId });
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
        <div className="status-container">
          <div className="name contrastName">Pedro</div>
          {/* {typingText && <div className="status">{typingText}</div>} */}
        </div>
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
        <textarea onChange={(e) => setText(e.target.value)} value={text} />
        <button onClick={handleClick}>
          <RiSendPlaneFill />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
