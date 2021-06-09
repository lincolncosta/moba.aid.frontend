import React from "react";

import styled, { keyframes } from "styled-components";

import { Box } from "components/Box";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled(Box)`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 5px solid white;
  border-right: 5px solid white;
  border-bottom: 5px solid white;
  border-left: 5px solid transparent;
  background: transparent;
  border-radius: 50%;
`;

export const Loading = ({ full, ...props }) => {
  if (full) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        width="100%"
      >
        <Spinner {...props} />
      </Box>
    );
  }

  return <Spinner {...props} />;
};
