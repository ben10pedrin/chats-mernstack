import { useState, useContext } from "react";
import "./LoginPage.css";
import { AppContext } from "../AppContext";
import { useHistory } from "react-router";
import { io } from "socket.io-client";

const LoginPage = () => {
  const [text, setText] = useState("");
  const { setIsLoggedIn, setUserId, setSocket } = useContext(AppContext);
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`./api/user/${text}`);
    const userId = await res.json();
    const newSocket = io();
    setSocket(newSocket);
    setUserId(userId);
    setIsLoggedIn(true);
    setText("");
    history.push("/");
  };

  return (
    <div className="loginpage">
      <form onSubmit={handleSubmit}>
        <p>Choose a username and remember it</p>
        <div className="input-login">
          <input
            type="text"
            placeholder="Username"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Log In</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
