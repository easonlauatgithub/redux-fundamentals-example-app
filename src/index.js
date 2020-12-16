import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import './api/server'
// import './redux/dispatchAction2.js'
import { Provider } from 'react-redux'
import store from './store'
import { fetchTodos } from './features/todos/todosSlice'

//able to dispatch(thunkFunction) after applyMiddleware(thunkMiddleware) in store.js
store.dispatch(fetchTodos())

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
