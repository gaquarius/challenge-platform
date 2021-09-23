import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-query'
import { getUser } from 'services/user'
import { toast } from 'react-toastify'

export const StateContext = React.createContext(null)

export default function AppStateProvider(props) {
  const [currentUser, setCurrentUser] = React.useState(null)

  const useFetchUser = () => {
    const { mutate: mutateGetUser } = useMutation(getUser)

    React.useEffect(() => {
      if (currentUser) return

      mutateGetUser(
        {},
        {
          onSuccess: ({ data }) => {
            setCurrentUser(data.data)
          },
          onError: () => {
            toast.error(`Can't get profile data`)
          },
        }
      )
    }, [mutateGetUser])
  }

  const contextValue = {
    currentUser,
    setCurrentUser,
    useFetchUser,
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
