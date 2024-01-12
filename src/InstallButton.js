import React from "react";
import Flex from "./UIComponents/Flex";

const InstallButton = () => {
  return (
    <Flex justify="center">
      <input
        className="install-button"
        type="button"
        onClick={() => (window.location.href = "oauth/install")}
        value="Install In HubSpot"
      />
    </Flex>
  );
};

export default InstallButton;
