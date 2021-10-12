import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { useCallback } from 'react'

export default function ChallengeAcceptModal(props) {
  const { open, setOpen, onAgree } = props

  const handleClose = () => {
    setOpen(false)
  }

  const handleAgree = useCallback(() => {
    onAgree()
    setOpen(false)
  }, [onAgree, setOpen])

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
        <Button onClick={handleClose} color='secondary'>
          Disagree
        </Button>
        <Button onClick={handleAgree} color='primary' autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ChallengeAcceptModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onAgree: PropTypes.func,
}
