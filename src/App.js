import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom'

import { createTheme } from 'themes/createTheme'

import { Home } from 'pages/Home'
import { Banimentos } from 'pages/Banimentos'
import { SelecaoCampeoes } from 'pages/SelecaoCampeoes'

import { Box } from 'components/Box'

import bg from 'assets/background.jpg'
import { Side } from 'pages/Side'

const BackgroundImage = styled(Box)`
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
`

export default () => {
  const theme = createTheme({
    name: 'Moba AID',
    colors: {
      primary: '#1A1FDF',
      secondary: '#F79900',
      textColor: '#FFFFFF',
      textButtonColor: '#FFFFFF'
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <BackgroundImage>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/side">
              <Side />
            </Route>
            <Route path="/bans">
              <Banimentos />
            </Route>
            <Route path="/picks">
              <SelecaoCampeoes />
            </Route>
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </BackgroundImage>
    </ThemeProvider>
  )
}
