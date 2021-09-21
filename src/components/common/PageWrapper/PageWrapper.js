import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2),
  },
  header: {
    padding: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
  },
  footer: {},
}))

const PageWrapper = (props) => {
  const { title } = props

  const classes = useStyles()
  return (
    <Paper className={classes.wrapper}>
      <Box className={classes.header}>
        <Typography variant='h5'>
          <strong>{title}</strong>
        </Typography>
      </Box>
      <Box className={classes.content}>{props.children}</Box>
    </Paper>
  )
}

PageWrapper.propTypes = {
  title: PropTypes.string,
  content: PropTypes.any,
  children: PropTypes.element,
}

export default PageWrapper
