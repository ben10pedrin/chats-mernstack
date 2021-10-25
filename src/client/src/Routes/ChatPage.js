import "./ChatPage.css";
import ChatList from "../Components/ChatList";
import ChatView from "../Components/ChatView";
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../AppContext";

const ChatPage = () => {
  const { socket, userId } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  let { path } = useRouteMatch();
  let location = useLocation();

  useEffect(() => {
    const eventName = `new-message-${userId}`;
    console.log(`listening on ${eventName}`);
    socket.on(eventName, (newMessage, roomId) => {
      // Find the name of the sender
      //Put the name of the sender at the top of contact list
      //If the roomId of the new message is the actual route: show the new message, else: dont do anything, wait for user to change route and fetch all messages
      const routerRoomId = location.pathname.substring(1);
      if (routerRoomId === roomId) {
        console.log(newMessage);
        setMessages((oldMessages) => [...oldMessages, newMessage]);
      }
    });

    return () => socket.off(eventName);
  }, [userId, socket, location]);

  return (
    <div className="main">
      <ChatList />
      <Switch>
        <Route exact path={path}>
          <h3>Please select a chat</h3>
        </Route>
        <Route path={`/:roomId`}>
          <ChatView messages={messages} setMessages={setMessages} />
        </Route>
      </Switch>
    </div>
  );
};

export default ChatPage;
