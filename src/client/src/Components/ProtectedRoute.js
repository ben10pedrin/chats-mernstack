import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AppContext } from "../AppContext";

export default function ProtectedRoute({ children, ...rest }) {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <Route
      {...rest}
      render={() => {
        return isLoggedIn === true ? children : <Redirect to="/login" />;
      }}
    />
  );
}
