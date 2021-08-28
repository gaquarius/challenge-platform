import { Component } from 'react'

import './app.styles.scss'

class App extends Component {
  render() {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-black font-bold rounded-lg border shadow-lg p-10 m-20'>
          <div>
            Welcome to Dash Goal/Challenge Platform!
            <div className={'bg-red-500 text-white'}>
              process.env.API_URL:{process.env.API_URL} !!! Make sure to put
              both .env.* files in gitignore.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
