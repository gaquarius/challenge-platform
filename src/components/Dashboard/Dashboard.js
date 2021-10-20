import { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import { CircularProgress, Container, Box } from '@material-ui/core'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'
import Masonry from 'react-masonry-css'
import { getChallenges } from 'services/challenge'
import PastParticipated from './PastParticipated'
import { getUser } from 'services/user'
import PastCoordinated from './PastCoordinated'
import CurrentlyParticipated from './CurrentlyParticipated'
import { TEST_DATA } from '../../shared/test'
import CurrentlyCoordinated from './CurrentlyCoordinated'
import UpcomingParticipated from './UpcomingParticipated'
import UpcomingCoordinated from './UpcomingCoordinated'

const useStyles = makeStyles((theme) => ({
  masonryGrid: {
    display: 'flex',
    marginLeft: theme.spacing(-4),
    width: 'inherit',
  },
  masonryColumn: {
    paddingLeft: theme.spacing(4),
    backgroundClip: 'padding-box',
  },
}))

const Dashboard = () => {
  const classes = useStyles()

  const { mutate: mutateGetChallenges } = useMutation(getChallenges)
  const { mutate: mutateGetUser } = useMutation(getUser)
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState([])
  const [user, setUser] = useState({})
  const theme = useTheme()

  useEffect(() => {
    mutateGetUser(
      {},
      {
        onSuccess: ({ data }) => {
          setUser(data.data)
          setLoading(false)
        },
        onError: () => {
          toast.error(`Can't get profile data`)
        },
      }
    )
  }, [mutateGetUser])

  useEffect(() => {
    mutateGetChallenges(
      {},
      {
        onSuccess: () => {
          // setChallenges(data.data)
          setChallenges(TEST_DATA)
          setLoading(false)
        },
        onError: () => {
          toast.error(`Can't get challenges list.`)
        },
      }
    )
  }, [mutateGetChallenges])

  const breakpointCols = {
    default: 2,
    [theme.breakpoints.values.xl]: 2,
    [theme.breakpoints.values.lg]: 2,
    [theme.breakpoints.values.md]: 1,
    [theme.breakpoints.values.sm]: 1,
    [theme.breakpoints.values.xs]: 1,
  }

  return (
    <Container maxWidth='lg'>
      {loading ? (
        <CircularProgress />
      ) : (
        <Masonry
          breakpointCols={breakpointCols}
          className={classes.masonryGrid}
          columnClassName={classes.masonryColumn}
        >
          <Box mb={2}>
            <PastParticipated challenges={challenges} user={user} />
          </Box>
          <Box mb={2}>
            <PastCoordinated challenges={challenges} user={user} />
          </Box>
          <Box mb={2}>
            <CurrentlyParticipated challenges={challenges} user={user} />
          </Box>
          <Box mb={2}>
            <CurrentlyCoordinated challenges={challenges} user={user} />
          </Box>
          <Box mb={2}>
            <UpcomingParticipated challenges={challenges} user={user} />
          </Box>
          <Box mb={2}>
            <UpcomingCoordinated challenges={challenges} user={user} />
          </Box>
        </Masonry>
      )}
    </Container>
  )
}

export default Dashboard
