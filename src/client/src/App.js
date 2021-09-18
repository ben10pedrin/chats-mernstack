import { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import ChatPage from "./Routes/ChatPage";
import LoginPage from "./Routes/LoginPage";
import { AppContext } from "./AppContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userId,
        setUserId,
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <ProtectedRoute path="/">
            <ChatPage />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
