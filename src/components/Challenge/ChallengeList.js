import React from 'react'
import { Box, Button, CircularProgress, Container } from '@material-ui/core'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import EnhancedTable from 'components/common/EnhancedTable/EnhancedTable'
import { getChallenges } from 'services/challenge'
import { utcDate, utcNow } from 'utils/date'
import { useHistory } from 'react-router'

const ChallengeList = () => {
  const history = useHistory()

  const { mutate: mutateGetChallenges } = useMutation(getChallenges)
  const [loading, setLoading] = React.useState(true)
  const [challenges, setChallenges] = React.useState([])
  const [filteredData, setFilteredData] = React.useState([])

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
      const { upcoming, coordinator, startDate } = filters
      const data = challenges.filter((challenge) => {
        let result = true
        // upcoming filter
        result &= startDate ? utcDate(challenge.start_date) >= startDate : true

        // coordinator filter
        result &= coordinator ? challenge.coordinator === coordinator : true

        // goal filter

        // upcoming filter
        result &= upcoming ? utcDate(challenge.start_date) > utcNow() : true

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
      if (result.includes(challenge.coordinator)) return
      result.push(challenge.coordinator)
    })
    return result
  }, [challenges])

  const onItemClick = React.useCallback(
    (id) => {
      history.push(`/challenge/${id}`)
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
            onItemClick={onItemClick}
          />
        </>
      )}
    </Container>
  )
}

export default ChallengeList
