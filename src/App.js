import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { createTheme, MuiThemeProvider } from '@material-ui/core'
import MainLayout from 'layout/MainLayout'
import NavBar from 'layout/NavBar'
import Login from 'components/Auth/Login'
import ProtectedRoute from 'components/Auth/ProtectedRoute'
import Dashboard from 'components/Dashboard/Dashboard'
import SignUp from 'components/Auth/SignUp'
import Routes from 'routes'

import 'react-toastify/dist/ReactToastify.css'

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

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <MainLayout>
          <NavBar />
          <div className='flex-1'>
            <Router>
              <Switch>
                <Route path={Routes.Login.path} component={Login} />
                <Route path={Routes.CreateWallet.path} component={SignUp} />
                <ProtectedRoute
                  path={Routes.Dashboard.path}
                  component={Dashboard}
                />
              </Switch>
            </Router>
          </div>
          <ToastContainer />
        </MainLayout>
      </MuiThemeProvider>
    </QueryClientProvider>
  )
}

export default App
