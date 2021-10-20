import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import { convertFromUTC } from 'utils/date'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`challenge-tabpanel-${index}`}
      aria-labelledby={`challenge-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `challenge-tab-${index}`,
    'aria-controls': `challenge-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    marginLeft: theme.spacing(1),
  },
}))

export default function ChallengeView(props) {
  const { challenges, user } = props

  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const previousChallenges = useMemo(() => {
    return challenges.filter(
      (challenge) => convertFromUTC(challenge.start_date) <= new Date()
    )
  }, [challenges])

  const upcomingChallenges = useMemo(() => {
    return challenges.filter(
      (challenge) => convertFromUTC(challenge.start_date) > new Date()
    )
  }, [challenges])

  return (
    <div className={classes.root}>
      <Paper square>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
        >
          <Tab label='Previous' {...a11yProps(0)} />
          <Tab label='Upcoming' {...a11yProps(1)} />
        </Tabs>
      </Paper>
      {[previousChallenges, upcomingChallenges].map(
        (filteredChallenges, index) => (
          <TabPanel value={value} index={index} key={`tabPanel-${index}`}>
            <List>
              {!filteredChallenges.length && <>Nothing to show</>}
              {filteredChallenges.map((challenge, index) => (
                <ListItem key={`challenge-${index}`} button>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        {challenge.name}
                        {challenge.coordinator === user.username && (
                          <Chip
                            size='small'
                            label='Creator'
                            color='secondary'
                            className={classes.chip}
                          />
                        )}
                      </>
                    }
                    secondary={challenge.description}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        )
      )}
    </div>
  )
}

ChallengeView.propTypes = {
  challenges: PropTypes.array,
  user: PropTypes.any,
}
