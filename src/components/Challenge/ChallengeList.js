import React from 'react'
import { Box, Button, CircularProgress, Container } from '@material-ui/core'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import EnhancedTable from 'components/common/EnhancedTable/EnhancedTable'
import { getChallenges } from 'services/challenge'
import { useHistory } from 'react-router'
import { useAppState } from '../../context/stateContext'
import { convertFromUTC } from 'utils/date'

export default function ChallengeList() {
  const history = useHistory()

  const { mutate: mutateGetChallenges } = useMutation(getChallenges)
  const [loading, setLoading] = React.useState(true)
  const [challenges, setChallenges] = React.useState([])
  const [filteredData, setFilteredData] = React.useState([])

  const { currentUser, useFetchUser } = useAppState()

  useFetchUser()

  React.useEffect(() => {
    mutateGetChallenges(
      {},
      {
        onSuccess: ({ data }) => {
          setChallenges(data.data)
          setFilteredData(data.data)
          setLoading(false)
        },
        onError: () => {
          toast.error(`Can't get challenges list.`)
        },
      }
    )
  }, [mutateGetChallenges])

  const handleFilter = React.useCallback(
    (filters) => {
      const { upcoming, coordinator, goal, startDate } = filters

      const data = challenges.filter((challenge) => {
        let result = true
        // upcoming filter
        result &= startDate
          ? convertFromUTC(challenge.start_date) >= startDate
          : true

        // coordinator filter
        result &= coordinator ? challenge.coordinator === coordinator : true

        // goal filter
        result &= goal && goal !== 'all' ? challenge.goal === goal : true

        // upcoming filter
        result &= upcoming
          ? convertFromUTC(challenge.start_date) > new Date()
          : true

        return result
      })
      setFilteredData(data)
    },
    [challenges]
  )

  const handleCreate = React.useCallback(() => {
    history.push('/challenge/create')
  }, [history])

  const coordinators = React.useMemo(() => {
    const result = []
    challenges.forEach((challenge) => {
      if (!challenge.coordinator || result.includes(challenge.coordinator)) {
        return
      }
      result.push(challenge.coordinator)
    })
    return result
  }, [challenges])

  const onOpen = React.useCallback(
    (id) => {
      history.push(`/challenge/${id}`)
    },
    [history]
  )

  const onEdit = React.useCallback(
    (id) => {
      history.push(`/challenge/${id}/edit`)
    },
    [history]
  )

  return (
    <Container maxWidth='lg'>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box display='flex' justifyContent='flex-end' mb={2}>
            <Button variant='contained' color='primary' onClick={handleCreate}>
              + Create New Challenge
            </Button>
          </Box>
          <EnhancedTable
            data={filteredData}
            onFilter={handleFilter}
            users={coordinators}
            currentUser={currentUser}
            onOpen={onOpen}
            onEdit={onEdit}
          />
        </>
      )}
    </Container>
  )
}
