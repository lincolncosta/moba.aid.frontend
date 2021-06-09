import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Text } from 'components/Text'
import { height } from 'styled-system'

export const ButtonStyled = styled.button`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  background-color: yellow;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
  border-radius: 10px;
  text-decoration: none;
  text-transform: uppercase;
  ${height}

  padding: 0px 15px;

  &:focus {
    border-color: black;
    box-shadow: inset 0px 0px 0px 1px white;

    &:hover {
      box-shadow: none;
    }
  }

  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.5s, opacity 1s;
  }

  ${(props) =>
    props.disabled &&
    css`
      &:active:after {
        transform: scale(0, 0);
        opacity: 0.4;
        transition: 0.5s;
      }
    `}
`

export const Button = ({ children, ...props }) => {
  const content = useMemo(() => {
    if (!children) {
      return null
    }

    return (
      <Text fontSize="default" fontWeight="bold">
        {children}
      </Text>
    )
  }, [children])

  return <ButtonStyled {...props}>{content}</ButtonStyled>
}

Button.defaultProps = {
  height: 48
}
