import React, { useEffect } from 'react'
import 'date-fns'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FilterListIcon from '@material-ui/icons/FilterList'
import {
  Box,
  Checkbox,
  Grid,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Autocomplete } from '@material-ui/lab'

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  title: {
    flex: '1 1 100%',
  },
  label: {
    whiteSpace: 'nowrap',
  },
}))

const EnhancedTableToolbar = (props) => {
  const { onFilter, users } = props

  const classes = useToolbarStyles()
  const [filters, setFilters] = React.useState({
    startDate: new Date(),
    goal: 'all',
    upcoming: false,
    coordinator: '',
  })
  const [showFilters, setShowFilters] = React.useState(true)

  useEffect(() => {
    onFilter(filters)
  }, [filters, onFilter])

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Toolbar className={classes.root}>
        <Box flex={1}>
          <Typography
            className={classes.title}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            Challenges
          </Typography>
          {showFilters && (
            <Box pt={4} p={2}>
              <Grid container spacing={4} alignItems='center'>
                <Grid item xs={12} sm={8} md={6} lg={4}>
                  <Box display='flex' alignItems='center'>
                    <Box mr={2}>
                      <Typography className={classes.label}>
                        Start Date:
                      </Typography>
                    </Box>
                    <KeyboardDatePicker
                      disableToolbar
                      variant='inline'
                      inputVariant='outlined'
                      format='MM/dd/yyyy'
                      margin='normal'
                      id='date-picker-inline'
                      label='Start Date'
                      value={filters.startDate}
                      onChange={(date) =>
                        setFilters({ ...filters, startDate: date })
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      fullWidth
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={8} md={6} lg={4}>
                  <Box display='flex' alignItems='center'>
                    <Box mr={2}>
                      <Typography className={classes.label}>
                        Goal Type:
                      </Typography>
                    </Box>
                    <Select
                      value={filters.goal}
                      onChange={({ target: { value } }) =>
                        setFilters({ ...filters, goal: value })
                      }
                      variant='outlined'
                      fullWidth
                    >
                      <MenuItem value={'all'}>All</MenuItem>
                      <MenuItem value={'count'}>Count</MenuItem>
                      <MenuItem value={'distance'}>Distance</MenuItem>
                    </Select>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={8} md={6} lg={4}>
                  <Box display='flex' alignItems='center'>
                    <Box mr={2}>
                      <Typography className={classes.label}>
                        Coordinator:
                      </Typography>
                    </Box>
                    <Autocomplete
                      options={users}
                      getOptionLabel={(option) => option}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Name'
                          variant='outlined'
                        />
                      )}
                      value={filters.coordinator}
                      onChange={(event, newValue) =>
                        setFilters({ ...filters, coordinator: newValue })
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={8} md={6} lg={4}>
                  <Box display='flex' alignItems='center'>
                    <Box mr={2}>
                      <Typography className={classes.label}>
                        Upcoming:
                      </Typography>
                    </Box>
                    <Checkbox
                      checked={filters.upcoming}
                      onChange={() =>
                        setFilters({ ...filters, upcoming: !filters.upcoming })
                      }
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        <Tooltip title='Filter list'>
          <IconButton
            aria-label='filter list'
            onClick={() => {
              setShowFilters(!showFilters)
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </MuiPickersUtilsProvider>
  )
}

EnhancedTableToolbar.propTypes = {
  onFilter: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.string),
}

export default EnhancedTableToolbar
