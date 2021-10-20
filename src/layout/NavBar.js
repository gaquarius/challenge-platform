import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Box from '@material-ui/core/Box'
import { isAuthenticated } from 'utils'
import { useHistory, useLocation } from 'react-router-dom'
import { logOut } from 'utils/auth'

const useStyles = makeStyles((theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
  },
}))

const NavBar = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const history = useHistory()
  const location = useLocation()
  const open = Boolean(anchorEl)
  const [auth, setAuth] = useState(isAuthenticated())

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [location.pathname])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = React.useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleProfile = React.useCallback(() => {
    history.push(`/profile`)
    handleClose()
  }, [handleClose, history])

  const handleLogout = React.useCallback(() => {
    logOut()

    history.push('/login')
    handleClose()
  }, [history, handleClose])

  const handleLogin = React.useCallback(() => {
    history.push('/login')
    handleClose()
  }, [history, handleClose])

  const onChallenges = React.useCallback(() => {
    history.push('/challenges')
  }, [history])

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Goal/Challenge Platform
          </Typography>
          {auth ? (
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Typography
                variant='h6'
                className={classes.title}
                onClick={onChallenges}
              >
                Challenges
              </Typography>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Typography
                variant='h6'
                className={classes.title}
                onClick={handleLogin}
              >
                Login
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default NavBar
