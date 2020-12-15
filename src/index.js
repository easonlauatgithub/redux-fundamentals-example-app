import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import './api/server'
//import './redux/dispatchAction2.js'
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
  // Render a `<Provider>` around the entire `<App>`,
  // and pass the Redux store to as a prop
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
