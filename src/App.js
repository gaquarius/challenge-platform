import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { createTheme, MuiThemeProvider } from '@material-ui/core'
import 'react-toastify/dist/ReactToastify.css'
import { makeStyles } from '@material-ui/styles'
import MainLayout from 'layout/MainLayout'
import NavBar from 'layout/NavBar'
import Login from 'components/Auth/Login'
import ProtectedRoute from 'components/Auth/ProtectedRoute'
import Dashboard from 'components/Dashboard/Dashboard'
import SignUp from 'components/Auth/SignUp'
import Profile from 'components/Profile/Profile'
import ProfileById from 'components/Profile/ProfileById'
import Routes from 'routes'

import ChallengeList from 'components/Challenge/ChallengeList'
import EditChallenge from 'components/Challenge/EditChallenge'
import AppStateProvider from './context/stateContext'
import ChallengeDetail from 'components/Challenge/ChallengeDetail'

const theme = createTheme({
  palette: {
    primary: {
      main: '#3280f6',
    },
  },
  typography: {
    fontFamily: ['Poppins', '-apple-system', 'BlinkMacSystemFont'].join(','),
  },
})

const useStyles = makeStyles(() => ({
  content: {
    flex: 1,
    padding: theme.spacing(4),
    backgroundColor: `rgb(241, 242, 244)`,
  },
}))

const queryClient = new QueryClient()

const App = () => {
  const classes = useStyles()

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <AppStateProvider>
          <Router>
            <MainLayout>
              <NavBar />
              <div className={classes.content}>
                <Switch>
                  <Route path={Routes.Login.path} component={Login} />
                  <Route path={Routes.CreateWallet.path} component={SignUp} />
                  <Route path={Routes.Profile.path} exact component={Profile} />
                  <ProtectedRoute
                    path={Routes.Challenges.path}
                    exact
                    component={ChallengeList}
                  />
                  <ProtectedRoute
                    path={Routes.CreateChallenge.path}
                    exact
                    component={EditChallenge}
                  />
                  <ProtectedRoute
                    path={Routes.EditChallenge.path}
                    exact
                    component={EditChallenge}
                  />
                  <ProtectedRoute
                    path={Routes.ChallengeDetail.path}
                    exact
                    component={ChallengeDetail}
                  />
                  <ProtectedRoute
                    path={Routes.ProfileById.path}
                    exact
                    component={ProfileById}
                  />
                  <ProtectedRoute
                    path={Routes.Dashboard.path}
                    component={Dashboard}
                  />
                </Switch>
              </div>
              <ToastContainer />
            </MainLayout>
          </Router>
        </AppStateProvider>
      </MuiThemeProvider>
    </QueryClientProvider>
  )
}

export default App
