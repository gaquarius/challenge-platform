import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import EnhancedTableToolbar from './EnhancedTableToolbar'
import EnhancedTableHead from './EnhancedTableHead'
import { Box, IconButton } from '@material-ui/core'
import { Edit } from '@material-ui/icons'

const SHOW_ALL = 'All'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableRow: {
    cursor: 'pointer',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

export default function EnhancedTable(props) {
  const { data, onFilter, users, onOpen, onEdit, currentUser } = props

  const classes = useStyles()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('start_date')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    if (event.target.value === SHOW_ALL) {
      setRowsPerPage(SHOW_ALL)
    } else {
      setRowsPerPage(parseInt(event.target.value, 10))
    }
    setPage(0)
  }

  const handleFilter = React.useCallback(
    (filters) => {
      onFilter(filters)
    },
    [onFilter]
  )

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar onFilter={handleFilter} users={users} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            aria-label='enhanced table'
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={`table-data-${index}`}
                      onClick={() => onOpen(row._id)}
                      className={classes.tableRow}
                    >
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='row'
                        align='center'
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align='center'>
                        <Chip
                          label={row.status}
                          color={
                            row.status === 'open' ? 'primary' : 'secondary'
                          }
                        />
                      </TableCell>
                      <TableCell align='center'>{row.start_date}</TableCell>
                      <TableCell align='center'>{row.end_date}</TableCell>
                      <TableCell align='center'>{row.coordinator}</TableCell>
                      <TableCell align='left'>{row.description}</TableCell>
                      <TableCell align='left'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: row.content,
                          }}
                        />
                      </TableCell>
                      <TableCell align='left'>
                        {currentUser &&
                          currentUser.username === row.coordinator &&
                          new Date(row.start_date) > new Date() && (
                            <Box display='flex'>
                              <IconButton
                                aria-label='detail'
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  onEdit(row._id)
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Box>
                          )}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[
            10,
            20,
            50,
            { value: data.length, label: SHOW_ALL },
          ]}
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}

EnhancedTable.propTypes = {
  data: PropTypes.array,
  onFilter: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.string),
  onOpen: PropTypes.func,
  onEdit: PropTypes.func,
  currentUser: PropTypes.any,
}
