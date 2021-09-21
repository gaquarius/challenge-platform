import React from 'react'
import PropTypes from 'prop-types'

export const StateContext = React.createContext(null)

export default function AppStateProvider(props) {
  const [user, setUser] = React.useState(null)

  const contextValue = {
    user,
    setUser,
  }

  return (
    <StateContext.Provider value={contextValue}>
      {props.children}
    </StateContext.Provider>
  )
}

export function useAppState() {
  const context = React.useContext(StateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider')
  }
  return context
}

AppStateProvider.propTypes = {
  children: PropTypes.any,
}
