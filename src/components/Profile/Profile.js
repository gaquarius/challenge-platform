import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import { updateUser } from 'services/user'
import PageWrapper from 'components/common/PageWrapper/PageWrapper'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from '@material-ui/core'
import { getAvatarString } from 'utils'
import { useAppState } from '../../context/stateContext'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
  },
  avatar: {
    width: 130,
    height: 130,
    fontSize: 70,
    [theme.breakpoints.down('xs')]: {
      width: 60,
      height: 60,
      fontSize: 30,
    },
  },
  textInput: {
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}))

const Profile = () => {
  const styles = useStyles()
  const { mutate: mutateUpdateUser } = useMutation(updateUser)
  const { currentUser, useFetchUser } = useAppState()
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)

  useFetchUser()

  React.useEffect(() => {
    if (currentUser) {
      setLoading(false)
      setUser(currentUser)
    }
  }, [currentUser])

  const onSave = React.useCallback(() => {
    mutateUpdateUser(user, {
      onSuccess: ({ data }) => {
        toast.success(`Successfully updated profile data`)
        localStorage.setItem('token', data.msg)
      },
      onError: () => {
        toast.error(`Can't update profile data`)
      },
    })
  }, [mutateUpdateUser, user])

  return (
    <Container maxWidth='md' className={styles.container}>
      <PageWrapper title={'Profile'}>
        <Box display='flex' alignItems='center' flexDirection='column'>
          {loading && <CircularProgress />}
          {!loading && (
            <Grid container direction='column' spacing={3} alignItems='center'>
              <Grid item>
                <Avatar className={styles.avatar}>
                  {getAvatarString(user.username)}
                </Avatar>
              </Grid>
              <Grid item>
                <TextField
                  className={styles.textInput}
                  variant='outlined'
                  label='Username'
                  value={user.username}
                  onChange={({ target: { value } }) =>
                    setUser({ ...user, username: value })
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  className={styles.textInput}
                  variant='outlined'
                  label='Bio'
                  value={user.bio}
                  onChange={({ target: { value } }) =>
                    setUser({ ...user, bio: value })
                  }
                  multiline
                  rows={5}
                />
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  className={styles.button}
                  onClick={onSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </PageWrapper>
    </Container>
  )
}

export default Profile
