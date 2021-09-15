import React from 'react'
import { CircularProgress, Container } from '@material-ui/core'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import EnhancedTable from 'components/common/EnhancedTable/EnhancedTable'
import { getChallenges } from 'services/challenge'
import { utcDate, utcNow } from 'utils/date'

const ChallengeList = () => {
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

  const coordinators = React.useMemo(() => {
    const result = []
    challenges.forEach((challenge) => {
      if (result.includes(challenge.coordinator)) return
      result.push(challenge.coordinator)
    })
    return result
  }, [challenges])

  return (
    <Container maxWidth='lg'>
      {loading ? (
        <CircularProgress />
      ) : (
        <EnhancedTable
          data={filteredData}
          onFilter={handleFilter}
          users={coordinators}
        />
      )}
    </Container>
  )
}

export default ChallengeList
