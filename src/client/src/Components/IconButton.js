import "./IconButton.css";

const IconButton = ({ children, onClick }) => {
  return (
    <button className="icon-button" onClick={() => onClick()}>
      {children}
    </button>
  );
};

export default IconButton;
