import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import { isAuthenticated } from 'utils'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
}

export default ProtectedRoute
