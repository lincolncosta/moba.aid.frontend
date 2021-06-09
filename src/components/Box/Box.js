import styled, { css } from "styled-components";
import {
  space,
  color,
  border,
  borderColor,
  borderRadius,
  fontFamily,
  fontSize,
  width,
  height,
  display,
  flexDirection,
  justifyContent,
  alignItems,
  backgroundImage,
  maxWidth,
  flex,
  borderBottom,
  minWidth,
  grid,
  flexWrap,
  minHeight,
  backgroundSize,
} from "styled-system";

export const Box = styled.div`
  ${backgroundSize}
  ${minHeight}
  ${grid}
  ${space}
  ${flex}
  ${color}
  ${border}
  ${borderColor}
  ${borderRadius}
  ${borderBottom}
  ${fontFamily}
  ${fontSize}
  ${width}
  ${height}
  ${display}
  ${flexDirection}
  ${flexWrap}
  ${justifyContent}
  ${alignItems}
  ${backgroundImage}
  ${maxWidth}
  ${minWidth}

  ${(
    props
  ) =>
    props.overflow &&
    css`
      overflow: ${props.overflow};
    `}

  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `}
`;
