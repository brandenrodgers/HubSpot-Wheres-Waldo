import React from "react";
import Flex from "./UIComponents/Flex";

const Header = () => {
  return (
    <Flex className="header" align="center" direction="column">
      <img src="/waldo.png" style={{ width: "100px" }} alt="waldo" />
      Where's Waldo HubSpot App
    </Flex>
  );
};

export default Header;
