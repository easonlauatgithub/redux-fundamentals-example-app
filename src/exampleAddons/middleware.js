import { client } from '../api/client'
import { useDispatch } from 'react-redux';

export const delayedMessageMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload);
      next(action);
    }, 1000)
  }
  return next(action)
}

const fetchTodosMiddleware = storeAPI => next => action => {
  const dispatch = useDispatch()
  if (action.type === 'todos/fetchTodos') {
    // Make an API call to fetch todos from the server
    client.get('todos').then(todos => {
      // Dispatch an action with the todos we received
      dispatch({ type: 'todos/todosLoaded', payload: todos })
    })
  }
  return next(action)
}

// Middleware written as ES5 functions
// Outer function:
export function exampleMiddleware(storeAPI) {
  console.log("exampleMiddleware START ---------------");
  console.log("exampleMiddleware storeAPI");console.log(storeAPI);
  return function wrapDispatch(next) {
    console.log("exampleMiddleware next");console.log(next);
    return function handleAction(action) {
      console.log("exampleMiddleware action");console.log(action);
      // Do anything here: pass the action onwards with next(action),
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here
      console.log("exampleMiddleware END ---------------");
      return next(action)
    }
  }
}

export const alwaysReturnHelloMiddleware = storeAPI => next => action => {
  const originalResult = next(action);
  // Ignore the original result, return something else
  return 'Hello!'
}

export const loggerMiddleware = storeAPI => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', storeAPI.getState())
  return result
}

export const print1 = (storeAPI) => (next) => (action) => {
  console.log('print1 START --------------------');
  console.log('print1 storeAPI');
  console.log(storeAPI);
  console.log('print1 next');
  console.log(next);
  console.log('print1 action');
  console.log(action);
  console.log('print1 END --------------------');
  return next(action)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('print2 START --------------------');
  console.log('print2 storeAPI');
  console.log(storeAPI);
  console.log('print2 next');
  console.log(next);
  console.log('print2 action');
  console.log(action);  
  console.log('print2 END --------------------');
  return next(action)
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action)
}
