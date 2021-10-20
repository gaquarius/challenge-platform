import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core'
import PageWrapper from 'components/common/PageWrapper/PageWrapper'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useMutation } from 'react-query'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { getChallenge, joinChallenge } from 'services/challenge'
import { convertFromUTC } from 'utils/date'
import { useAppState } from '../../context/stateContext'
import ChallengeAcceptModal from './ChallengeAcceptModal'

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
  },
}))

const STATUS_UPCOMING = 'upcoming'
const STATUS_STARTED = 'started'
const STATUS_ENDED = 'ended'

export default function ChallengeDetail() {
  const classes = useStyles()
  const { currentUser, useFetchUser } = useAppState()
  const { id } = useParams()
  const { mutate: mutateGetChallenge } = useMutation(getChallenge)
  const { mutate: mutateJoinChallenge } = useMutation(joinChallenge)

  const [challenge, setChallenge] = useState({
    start_date: '2020-1-1',
    end_date: '2020-1-1',
  })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState()
  const [liveTime, setLiveTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [openAcceptModal, setOpenAcceptModal] = useState(false)

  useFetchUser()

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date()
      let delta
      if (challenge.start_date && challenge.end_date) {
        if (convertFromUTC(challenge.end_date) > now) {
          if (convertFromUTC(challenge.start_date) > now) {
            delta = Math.floor(
              (convertFromUTC(challenge.start_date) - now.getTime()) / 1000
            )
            setStatus(STATUS_UPCOMING)
          } else {
            delta = Math.floor(
              (convertFromUTC(challenge.end_date) - now.getTime()) / 1000
            )
            setStatus(STATUS_STARTED)
          }

          let days = Math.floor(delta / 86400)
          delta -= days * 86400

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24
          delta -= hours * 3600

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60
          delta -= minutes * 60

          // what's left is seconds
          let seconds = delta % 60
          setLiveTime({
            days,
            hours,
            minutes,
            seconds,
          })
        } else {
          setStatus(STATUS_ENDED)
          setLiveTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          })
          clearInterval(timerId)
        }
      }
    }, 1000)

    return () => clearInterval(timerId)
  }, [challenge])

  const joinAvailability = useMemo(
    () =>
      !status === STATUS_STARTED ||
      (challenge.participants
        ? challenge.participants.findIndex(
            (user) => user === currentUser.username
          )
        : false),
    [challenge.participants, currentUser, status]
  )

  const handleJoin = useCallback(() => {
    setOpenAcceptModal(true)
  }, [])

  const handleAgree = useCallback(() => {
    setLoading(true)
    mutateJoinChallenge(
      {
        id,
        data: {
          username: currentUser.username,
        },
      },
      {
        onSuccess: () => {
          setLoading(false)
        },
        onError: () => {
          toast.error(`Can't join the challenge.`)
        },
      }
    )
  }, [currentUser, id, mutateJoinChallenge])

  const reload = useCallback(() => {
    if (id) {
      mutateGetChallenge(id, {
        onSuccess: ({ data }) => {
          setChallenge(data.data)
          setLoading(false)
        },
        onError: () => {
          toast.error(`Can't get challenge.`)
        },
      })
    } else {
      setLoading(false)
    }
  }, [id, setLoading, mutateGetChallenge])

  return (
    <Container maxWidth='md' className={classes.container}>
      <PageWrapper>
        <Box display='flex' alignItems='center' flexDirection='column'>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant='h3'>
                <strong>{challenge.name}</strong>
              </Typography>
              <Box mb={3} />
              {status === STATUS_UPCOMING && (
                <Chip label='UPCOMING' color='secondary' />
              )}
              {status === STATUS_STARTED && (
                <Chip label='ACTIVE' color='primary' />
              )}
              {status === STATUS_ENDED && <Chip label='Already Ended.' />}
              <Typography variant='h5'>
                {`${liveTime.days} Day${liveTime.days > 1 ? 's' : ''} ${
                  liveTime.hours
                } h ${liveTime.minutes} min ${liveTime.seconds} s`}
              </Typography>
              <Box mt={4}>
                <Typography variant='h6'>
                  Total Participants:&nbsp;
                  {challenge.participants ? challenge.participants.length : 0}
                </Typography>
              </Box>
              <Box mt={4}>
                <Typography variant='h6'>
                  Coordinator:&nbsp;
                  <Link href={`/profile/${challenge.coordinator}`}>
                    {challenge.coordinator}
                  </Link>
                </Typography>
              </Box>
              {status === STATUS_ENDED && <>Success Rate: 0</>}
              <Box mt={4} width={400} maxWidth='100%'>
                <Button
                  variant='contained'
                  color='primary'
                  disabled={joinAvailability}
                  fullWidth
                  size='large'
                  onClick={handleJoin}
                >
                  Join
                </Button>
              </Box>
            </>
          )}
        </Box>
      </PageWrapper>
      <ChallengeAcceptModal
        open={openAcceptModal}
        setOpen={setOpenAcceptModal}
        onAgree={handleAgree}
      />
    </Container>
  )
}
