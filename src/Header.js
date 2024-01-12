import React from "react";
import InstallButton from "./InstallButton";
import Flex from "./UIComponents/Flex";

const Header = () => {
  return (
    <Flex className="header" align="center" direction="column">
      <img src="/waldo.png" style={{ width: "85px" }} alt="waldo" />
      <span className="p-bottom-10">Where's Waldo HubSpot App</span>
      <InstallButton />
    </Flex>
  );
};

export default Header;
