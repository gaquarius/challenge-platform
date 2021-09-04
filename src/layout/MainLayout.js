import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(() => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}))
const MainLayout = ({ children }) => {
  const styles = useStyles()

  return <div className={styles.container}>{children}</div>
}

MainLayout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
}

export default MainLayout
