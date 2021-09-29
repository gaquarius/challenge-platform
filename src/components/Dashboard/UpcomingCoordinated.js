import { useMemo, useEffect, useState } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { convertFromUTC } from 'utils/date'
import PageWrapper from '../common/PageWrapper/PageWrapper'

export default function UpcomingCoordinated(props) {
  const { user, challenges } = props

  const [liveTimes, setLiveTimes] = useState({})

  const data = useMemo(
    () =>
      challenges.filter(
        (challenge) =>
          challenge.start_date &&
          convertFromUTC(challenge.start_date) > new Date() &&
          challenge.participants &&
          challenge.participants.includes(user.username)
      ),
    [challenges, user.username]
  )

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date()

      let times = {}
      data.forEach((challenge) => {
        let delta
        if (challenge.start_date && challenge.end_date) {
          if (convertFromUTC(challenge.start_date) > now) {
            delta = Math.floor(
              (convertFromUTC(challenge.start_date) - now.getTime()) / 1000
            )

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
            times[challenge._id] = {
              days,
              hours,
              minutes,
              seconds,
            }
          } else {
            times[challenge._id] = {
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
            }
          }
        }
      })

      setLiveTimes(times)
    }, 1000)

    return () => clearInterval(timerId)
  }, [data, liveTimes])

  return (
    <PageWrapper title='Upcoming Coordinated Challenges'>
      <Box>
        <List>
          {data.map((item, index) => (
            <ListItem button key={`challenge-${index}`}>
              <ListItemText
                primary={item.name}
                secondary={item.participants.join()}
              />
              <Typography color='secondary'>
                {liveTimes[item._id] &&
                  `${liveTimes[item._id].days} Day${
                    liveTimes[item._id].days > 1 ? 's' : ''
                  } ${liveTimes[item._id].hours} h ${
                    liveTimes[item._id].minutes
                  } min ${liveTimes[item._id].seconds} s`}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </PageWrapper>
  )
}

UpcomingCoordinated.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.any,
}
