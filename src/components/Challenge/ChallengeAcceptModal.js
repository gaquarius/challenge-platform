import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import PropTypes from 'prop-types'

export default function ChallengeAcceptModal(props) {
  const { open, setOpen } = props

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        {'Do you agree with the following rules?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <ul>
            <li>All funds will be held in escrow.</li>
            <li>Funds will onlybe returned if the challenge completed.</li>
            <li>
              Anyday without a step input will have zero recorded for the day,
              that inputs are immutable, and the user is sole party.
            </li>
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Disagree
        </Button>
        <Button onClick={handleClose} color='primary' autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ChallengeAcceptModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
}
