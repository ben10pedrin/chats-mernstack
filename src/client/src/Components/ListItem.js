import { NavLink } from "react-router-dom";
import "./ListItem.css";

const ListItem = ({ name, ...rest }) => {
  return (
    <NavLink {...rest}>
      <div className="avatar">{name[0].toUpperCase()}</div>
      <p className="name">{name}</p>
    </NavLink>
  );
};

export default ListItem;
