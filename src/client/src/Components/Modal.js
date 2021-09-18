import "./Modal.css";
import { RiCloseFill } from "react-icons/ri";
import IconButton from "./IconButton";

const Modal = ({ setOpen, title, children }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <div className="bar">
          <p className="title">{title}</p>
          <IconButton onClick={() => handleClose()}>
            <RiCloseFill />
          </IconButton>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
