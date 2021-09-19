import "./ChatPage.css";
import ChatList from "../Components/ChatList";
import ChatView from "../Components/ChatView";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const ChatPage = () => {
  let { path } = useRouteMatch();

  return (
    <div className="main">
      <ChatList />
      <Switch>
        <Route exact path={path}>
          <h3>Please select a chat</h3>
        </Route>
        <Route path={`/:roomId`}>
          <ChatView />
        </Route>
      </Switch>
    </div>
  );
};

export default ChatPage;
