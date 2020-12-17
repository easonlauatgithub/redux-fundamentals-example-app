import { createStore, compose, applyMiddleware } from 'redux'
//import { createStore } from './redux/miniReduxStoreExample'
import rootReducer from './reducer'
import { sayHiOnDispatch, includeMeaningOfLife } from './exampleAddons/enhancers'
import {print1, print2, exampleMiddleware} from './exampleAddons/middleware'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

//configureStore automatically added the thunk middleware
//added more middleware to check for common mistakes like accidentally mutating the state
//set up the Redux DevTools Extension connection
const store = configureStore({
    reducer: {
      // Define a top-level state field named `todos`, handled by `todosReducer`
      todos: todosReducer,
      filters: filtersReducer
    }
})

// const store = createStore(rootReducer)

//const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)
// const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
// const store = createStore(rootReducer, composedEnhancer)

//const middlewareEnhancer = applyMiddleware(print1, exampleMiddleware, print2)
// const store = createStore(rootReducer, middlewareEnhancer)

export default store
