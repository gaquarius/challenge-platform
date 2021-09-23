import { useEffect, useState, useCallback } from 'react'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  CircularProgress,
} from '@material-ui/core'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import PageWrapper from 'components/common/PageWrapper/PageWrapper'
import { useHistory, useParams } from 'react-router'
import { useMutation } from 'react-query'
import {
  createChallenge,
  getChallenge,
  updateChallenge,
} from 'services/challenge'
import { toast } from 'react-toastify'
import { useAppState } from '../../context/stateContext'
import { convertDateToUTCString } from 'utils/date'

export const CREATE_MODE = 0
export const EDIT_MODE = 1

const useStyles = makeStyles((theme) => ({
  label: {
    textAlign: 'end',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'start',
    },
  },
}))

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Challenge Title is required'),
  description: Yup.string().required('Description is required'),
  goal: Yup.string().required('Goal Type is required'),
  goal_threshold: Yup.number()
    .min(0, 'Min value 0.')
    .required('Goal Threshold is required'),
  goal_increments: Yup.number()
    .min(0, 'Min value 0.')
    .required('Goal Increments is required'),
  start_date: Yup.date().required('Start Date is required'),
  end_date: Yup.date().required('End Date is required'),
  status: Yup.string().required('Status is required'),
  visible: Yup.boolean(),
  recipient_address: Yup.string(),
})

const defaultValues = {
  name: '',
  description: '',
  goal: 'count',
  goal_threshold: 0,
  goal_increments: 1,
  start_date: new Date(),
  end_date: new Date(),
  status: 'open',
  visible: true,
}

const EditChallenge = () => {
  const history = useHistory()
  const styles = useStyles()
  const { id } = useParams()
  const { mutate: mutateGetChallenge } = useMutation(getChallenge)
  const { mutate: mutateCreateChallenge } = useMutation(createChallenge)
  const { mutate: mutateUpdateChallenge } = useMutation(updateChallenge)

  const { currentUser, useFetchUser } = useAppState()
  const [mode, setMode] = useState()
  const [initialValues, setInitialValues] = useState(defaultValues)
  const [loading, setLoading] = useState(true)
  const [disable, setDisable] = useState(false)

  useFetchUser()

  useEffect(() => {
    if (id) {
      setMode(EDIT_MODE)
      mutateGetChallenge(id, {
        onSuccess: ({ data }) => {
          setInitialValues(data.data)
          setLoading(false)
        },
        onError: () => {
          toast.error(`Can't get challenge.`)
        },
      })
    } else {
      setMode(CREATE_MODE)
      setLoading(false)
    }
  }, [id, setMode, setInitialValues, setLoading, mutateGetChallenge])

  const handleSubmit = useCallback(
    (values) => {
      setDisable(true)

      const data = {
        ...values,
        coordinator: currentUser.username,
        start_date: convertDateToUTCString(values.start_date),
        end_date: convertDateToUTCString(values.end_date),
        goal_threshold: `${values.goal_threshold}`,
        goal_increments: `${values.goal_increments}`,
      }
      if (mode === CREATE_MODE) {
        mutateCreateChallenge(data, {
          onSuccess: () => {
            setDisable(false)
            history.push('/challenges')
          },
          onError: () => {
            setDisable(false)
            toast.error(`Can't create a challenge.`)
          },
        })
      } else {
        mutateUpdateChallenge(
          { id, data },
          {
            onSuccess: () => {
              setDisable(false)
              history.push('/challenges')
            },
            onError: () => {
              setDisable(false)
              toast.error(`Can't update the challenge.`)
            },
          }
        )
      }
    },
    [
      currentUser,
      mode,
      mutateCreateChallenge,
      history,
      mutateUpdateChallenge,
      id,
    ]
  )

  const handleCancel = useCallback(() => {
    history.push('/challenges')
  }, [history])

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth='md'>
        {loading ? (
          <CircularProgress />
        ) : (
          <PageWrapper
            title={mode === CREATE_MODE ? 'Create Challenge' : 'Edit Challenge'}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, touched, errors, handleChange, setFieldValue }) => {
                return (
                  <Form autoComplete='off'>
                    <Grid container direction='column' spacing={2}>
                      <Grid
                        item
                        container
                        direction='row'
                        alignItems='center'
                        spacing={2}
                      >
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            Header Image:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Button variant='contained' component='label'>
                            Upload File
                            <input type='file' hidden />
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        alignItems='center'
                        spacing={2}
                      >
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            Challenge Title:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            helperText={touched.name && errors.name}
                            value={values.name}
                            name='name'
                            onChange={handleChange}
                            label='Challenge Title'
                            variant='outlined'
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <Grid item container direction='row' spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <Typography
                            className={styles.label}
                            style={{ marginTop: 16 }}
                          >
                            Description:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <TextField
                            error={Boolean(
                              touched.description && errors.description
                            )}
                            helperText={
                              touched.description && errors.description
                            }
                            value={values.description}
                            onChange={handleChange}
                            label='Description'
                            variant='outlined'
                            name='description'
                            multiline
                            minRows={5}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        alignItems='center'
                        spacing={2}
                      >
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            Goal Type:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Select
                            error={Boolean(touched.goal && errors.goal)}
                            helperText={touched.goal && errors.goal}
                            value={values.goal}
                            onChange={handleChange}
                            label='Goal'
                            name='goal'
                          >
                            <MenuItem value={'count'}>Count</MenuItem>
                            <MenuItem value={'distance'}>Distance</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        alignItems='center'
                        spacing={2}
                      >
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            Goal Threshold:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <TextField
                            label='Goal Threshold'
                            variant='outlined'
                            name='goal_threshold'
                            type='number'
                            error={Boolean(
                              touched.goal_threshold && errors.goal_threshold
                            )}
                            helperText={
                              touched.goal_threshold && errors.goal_threshold
                            }
                            value={values.goal_threshold}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        alignItems='center'
                        spacing={2}
                      >
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            Goal Increments:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <TextField
                            label='Goal Increments'
                            variant='outlined'
                            name='goal_increments'
                            type='number'
                            error={Boolean(
                              touched.goal_increments && errors.goal_increments
                            )}
                            helperText={
                              touched.goal_increments && errors.goal_increments
                            }
                            value={values.goal_increments}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        alignItems='center'
                        spacing={2}
                      >
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            Start Date:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant='inline'
                            inputVariant='outlined'
                            format='MM/dd/yyyy'
                            margin='normal'
                            label='Start Date'
                            name='start_date'
                            error={Boolean(
                              touched.start_date && errors.start_date
                            )}
                            value={values.start_date}
                            onChange={(date) =>
                              setFieldValue('start_date', date)
                            }
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction='row'
                        alignItems='center'
                        spacing={2}
                      >
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            End Date:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant='inline'
                            inputVariant='outlined'
                            format='MM/dd/yyyy'
                            margin='normal'
                            label='End Date'
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            name='end_date'
                            error={Boolean(touched.end_date && errors.end_date)}
                            value={values.end_date}
                            onChange={(date) => setFieldValue('end_date', date)}
                          />
                        </Grid>
                      </Grid>
                      <Grid item container direction='row' spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <Typography className={styles.label}>
                            Status:
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Select
                            label='Status'
                            value={values.status}
                            onChange={handleChange}
                            name='status'
                          >
                            <MenuItem value={'open'}>Open</MenuItem>
                            <MenuItem value={'private'}>Private</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      {values.status === 'open' && (
                        <Grid
                          item
                          container
                          direction='row'
                          alignItems='center'
                          spacing={2}
                        >
                          <Grid item xs={12} sm={3}>
                            <Typography className={styles.label}>
                              Visible on search date:
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={9}>
                            <Checkbox
                              label='Visible in search date'
                              name='visible'
                              error={Boolean(touched.visible && errors.visible)}
                              helperText={touched.visible && errors.visible}
                              value={values.visible}
                              onChange={handleChange}
                            />
                          </Grid>
                        </Grid>
                      )}
                      {values.status === 'private' && (
                        <Grid
                          item
                          container
                          direction='row'
                          alignItems='center'
                          spacing={2}
                        >
                          <Grid item xs={12} sm={3}>
                            <Typography className={styles.label}>
                              Recipient Dash Address
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={9}>
                            <TextField
                              className={styles.textInput}
                              label='Recipient Dash Address'
                              variant='outlined'
                              name='recipient_address'
                              error={Boolean(
                                touched.recipient_address &&
                                  errors.recipient_address
                              )}
                              helperText={
                                touched.recipient_address &&
                                errors.recipient_address
                              }
                              value={values.recipient_address}
                              onChange={handleChange}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      )}
                      <Grid
                        item
                        container
                        justifyContent='flex-end'
                        spacing={2}
                      >
                        <Grid item>
                          <Button
                            variant='contained'
                            disabled={disable}
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                            disabled={disable}
                          >
                            {mode === CREATE_MODE ? 'Create' : 'Save'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                )
              }}
            </Formik>
          </PageWrapper>
        )}
      </Container>
    </MuiPickersUtilsProvider>
  )
}

export default EditChallenge
