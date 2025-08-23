import { memo } from "react";

const InputsContainer = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export default memo(InputsContainer);
