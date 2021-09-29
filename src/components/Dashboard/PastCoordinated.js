import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { convertFromUTC } from 'utils/date'
import PageWrapper from '../common/PageWrapper/PageWrapper'

const useStyles = makeStyles((theme) => ({
  chip: {
    marginLeft: theme.spacing(1),
  },
  alignCenter: {
    textAlign: 'center',
  },
}))

export default function PastCoordinated(props) {
  const classes = useStyles()
  const { user, challenges } = props

  const data = useMemo(
    () =>
      challenges.filter(
        (challenge) =>
          challenge.end_date &&
          convertFromUTC(challenge.end_date) < new Date() &&
          challenge.coordinator === user.username
      ),
    [challenges, user.username]
  )

  const totalParticipants = useMemo(
    () =>
      data.reduce(
        (sum, current) =>
          sum + (current.participants ? current.participants.length : 0),
        0
      ),
    [data]
  )

  const successRate = useMemo(
    () =>
      data.length > 0
        ? (
            (data.filter((item) => item.success === true).length /
              data.length) *
            100
          ).toFixed(0)
        : 0,
    [data]
  )

  return (
    <PageWrapper title='Past Coordinated Challenges'>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} container spacing={2} direction='column'>
          <Grid item>
            <Typography variant='h5' className={classes.alignCenter}>
              Total Participants:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='h4' className={classes.alignCenter}>
              <strong>{totalParticipants}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='h5' className={classes.alignCenter}>
              Success Rate:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='h4' className={classes.alignCenter}>
              <strong>{successRate}%</strong>
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <List>
            {data.map((item, index) => (
              <ListItem button key={`challenge-${index}`}>
                <ListItemText primary={item.name} />
                {item.success ? (
                  <Chip
                    label='Succeed'
                    color='primary'
                    className={classes.chip}
                  />
                ) : (
                  <Chip
                    label='Failed'
                    color='secondary'
                    className={classes.chip}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

PastCoordinated.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.any,
}
