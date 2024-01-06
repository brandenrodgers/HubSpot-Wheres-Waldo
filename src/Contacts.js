import axios from "axios";
import React, { useState, useEffect } from "react";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get("/api/contacts");
      setContacts(data);
    } catch (e) {
      console.log(e);
    }
  };

  const renderContact = (contact, i) => {
    return <div>{contact.properties.firstname.value}</div>;
  };

  return (
    <div>
      <h2>Contacts from connected account:</h2>
      {contacts.map(renderContact)}
    </div>
  );
};

export default Contacts;
