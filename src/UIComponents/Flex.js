import React from "react";

const Flex = ({ children, className, direction, align, justify, gap }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap,
      }}
    >
      {children}
    </div>
  );
};

export default Flex;
