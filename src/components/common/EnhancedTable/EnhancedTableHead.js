import PropTypes from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

const headCells = [
  { id: 'name', disablePadding: true, label: 'Name', sortable: true },
  { id: 'status', disablePadding: false, label: 'Status', sortable: true },
  {
    id: 'start_date',
    disablePadding: false,
    label: 'Start Time',
    sortable: true,
  },
  { id: 'end_date', disablePadding: false, label: 'End Time', sortable: true },
  {
    id: 'coordinator',
    disablePadding: false,
    label: 'Coordinator',
    sortable: true,
  },
  {
    id: 'description',
    disablePadding: false,
    label: 'Description',
    sortable: false,
  },
  { id: 'content', disablePadding: false, label: 'Content', sortable: false },
  { id: 'action', disablePadding: false, label: 'Action', sortable: false },
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='normal' align='center'>
          No
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={
              headCell.sortable && orderBy === headCell.id ? order : false
            }
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <>{headCell.label}</>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

export default EnhancedTableHead
