import React from "react";
import Flex from "./UIComponents/Flex";

const InfoSection = () => {
  return (
    <Flex className="info-section">
      <span className="p-bottom-10">
        Installing this app in your HubSpot account will automatically hide
        Waldo on one of your contacts using a custom property. Look for the
        Where's Waldo CRM card that will appear on each of your contacts. Make
        sure to mark Waldo as found whenever you find him! Marking him as found
        will update your score and then randomly hide Waldo on another one of
        your contacts.
      </span>
    </Flex>
  );
};

export default InfoSection;
