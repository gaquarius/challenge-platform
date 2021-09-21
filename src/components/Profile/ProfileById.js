import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { getUserByUsername } from 'services/user'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import PageWrapper from 'components/common/PageWrapper/PageWrapper'
import { getAvatarString } from 'utils'
import { getChallengesByUser } from 'services/challenge'
import ChallengeView from './ChallengeView'

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
  bio: {
    width: 400,
  },
}))

const Profile = () => {
  const styles = useStyles()
  const history = useHistory()

  const { mutate: mutateGetUser } = useMutation(getUserByUsername)
  const { mutate: mutateGetChallenges } = useMutation(getChallengesByUser)

  const [loadingUser, setLoadingUser] = React.useState(true)
  const [loadingChallenges, setLoadingChallenges] = React.useState(false)
  const [user, setUser] = React.useState({})
  const [challenges, setChallenges] = React.useState([])

  const { id } = useParams()

  React.useEffect(() => {
    if (!id) {
      history.push('/profile')
    }
    mutateGetUser(id, {
      onSuccess: ({ data }) => {
        setUser(data.data)
        setLoadingUser(false)
      },
      onError: () => {
        toast.error(`Can't get profile data`)
      },
    })
  }, [id, mutateGetUser, history])

  React.useEffect(() => {
    mutateGetChallenges(id, {
      onSuccess: ({ data }) => {
        if (data.data) {
          setChallenges(data.data)
        }
        setLoadingChallenges(false)
      },
      onError: () => {
        toast.error(`Can't get challenge list`)
      },
    })
  }, [id, mutateGetChallenges, history])

  return (
    <Container maxWidth='md' className={styles.container}>
      <Grid container spacing={2} direction='column'>
        <Grid item>
          <PageWrapper title={'Profile'}>
            <Box display='flex' alignItems='center' flexDirection='column'>
              {!loadingUser ? (
                <Grid
                  container
                  direction='column'
                  spacing={3}
                  alignItems='center'
                >
                  <Grid item>
                    <Avatar className={styles.avatar}>
                      {getAvatarString(user.username)}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant='h6'>
                      <strong>{user.username}</strong>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography align='center' className={styles.bio}>
                      <i>{user.bio}</i>
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </PageWrapper>
        </Grid>
        <Grid item>
          {!loadingChallenges ? (
            <ChallengeView challenges={challenges} user={user} />
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile
