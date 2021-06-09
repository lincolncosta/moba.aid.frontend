import React from "react";
import styled from "styled-components";
import { Box } from "../Box/Box";

const IconStyled = styled(Box)`
  background-image: url(${(props) => props.img});
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export const Icon = ({ img, ...props }) => {
  return <IconStyled {...props} style={{ backgroundImage: `url(${img})` }} />;
};

Icon.defaultProps = {
  width: 24,
  height: 24,
};
