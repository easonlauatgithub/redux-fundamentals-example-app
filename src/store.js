import { createStore, compose, applyMiddleware } from 'redux'
//import { createStore } from './redux/miniReduxStoreExample'
import rootReducer from './reducer'
import { sayHiOnDispatch, includeMeaningOfLife } from './exampleAddons/enhancers'
import {print1, print2, exampleMiddleware} from './exampleAddons/middleware'

const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)
const middlewareEnhancer = applyMiddleware(print1, exampleMiddleware, print2)

const store = createStore(rootReducer)
//const store = createStore(rootReducer, composedEnhancer)
//const store = createStore(rootReducer, middlewareEnhancer)

export default store
