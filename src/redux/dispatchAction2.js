import store from '../store'

//store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
// console.log('State after dispatch: ', store.getState())
const dispatchResult = store.dispatch({type: 'some/action'})
console.log("dispatchResult")
console.log(dispatchResult)
