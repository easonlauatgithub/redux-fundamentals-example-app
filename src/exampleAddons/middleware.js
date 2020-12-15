// Middleware written as ES5 functions
// Outer function:
export function exampleMiddleware(storeAPI) {
  console.log("storeAPI");console.log(storeAPI);
  return function wrapDispatch(next) {
    console.log("next");console.log(next);
    return function handleAction(action) {
      console.log("action");console.log(action);
      // Do anything here: pass the action onwards with next(action),
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here
      return next(action)
    }
  }
}

export const delayedMessageMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload)
    }, 1000)
  }
  return next(action)
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
  console.log('1')
  return next(action)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2')
  return next(action)
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action)
}
