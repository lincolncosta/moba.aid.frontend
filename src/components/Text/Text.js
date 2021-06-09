import styled, { css } from "styled-components";
import {
  space,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  textAlign,
  letterSpacing,
  display,
  maxHeight,
} from "styled-system";

export const Text = styled.span`
  ${display}
  ${maxHeight}
  ${fontSize};
  ${space};
  ${color};
  ${fontFamily};
  ${fontWeight};
  ${textAlign};
  ${letterSpacing};
  ${(props) =>
    props.textTransform &&
    css`
      text-transform: ${props.textTransform};
    `};

  ${(props) =>
    props.truncate &&
    css`
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    `};

  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `};

  ${(props) =>
    props.overflow &&
    css`
      overflow: ${props.overflow};
    `};

  ${(props) =>
    props.lineCamp &&
    css`
      -webkit-line-clamp: ${props.lineCamp};
    `};
`;
