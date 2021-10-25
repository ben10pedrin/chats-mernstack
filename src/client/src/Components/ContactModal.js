import { useContext, useEffect, useState } from "react";
import ListItem from "./ListItem";
import Modal from "./Modal";
import { AppContext } from "../AppContext";
import { useHistory } from "react-router";

const ContactModal = ({ setOpen }) => {
  const [contacts, setContacts] = useState([]);
  const { userId } = useContext(AppContext);
  let history = useHistory();

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await fetch(`./api/users`);
      const newContacts = await res.json();
      setContacts(newContacts);
    };

    fetchContacts();
  }, [setContacts, userId]);

  const createRoom = async (arrayOfUsers) => {
    const res = await fetch(`./api/joinRoom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arrayOfUsers),
    });
    const roomId = await res.json();
    history.push(`/${roomId}`);
    setOpen(false);
  };

  return (
    <Modal setOpen={setOpen} title="Choose a Contact">
      {contacts.length > 0 &&
        contacts.map((contact) => (
          <ListItem
            name={contact.username}
            className="list-item"
            to={``}
            key={contact._id}
            onClick={() => createRoom([userId, contact._id])}
          />
        ))}
    </Modal>
  );
};

export default ContactModal;
