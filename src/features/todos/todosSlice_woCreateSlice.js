import { client } from '../../api/client'
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle',
  entities: {}
}
 
function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
          const todo = action.payload
          return {
            ...state,
            entities: {
              ...state.entities,
              [todo.id]: todo
            }
          }
        }
        case 'todos/todoToggled': {
          const todoId = action.payload
          const todo = state.entities[todoId]
          return {
            ...state,
            entities: {
              ...state.entities,
              [todoId]: {
                ...todo,
                completed: !todo.completed
              }
            }
          }
        }
        case 'todos/colorSelected': {
          const { color, todoId } = action.payload
          const todo = state.entities[todoId]
          return {
            ...state,
            entities: {
              ...state.entities,
              [todoId]: {
                ...todo,
                color
              }
            }
          }
        }
        case 'todos/todoDeleted': {
          const newEntities = { ...state.entities }
          delete newEntities[action.payload]
          return {
            ...state,
            entities: newEntities
          }
        }
        case 'todos/allCompleted': {
          const newEntities = { ...state.entities }
          Object.values(newEntities).forEach(todo => {
            newEntities[todo.id] = {
              ...todo,
              completed: true
            }
          })
          return {
            ...state,
            entities: newEntities
          }
        }
        case 'todos/completedCleared': {
          const newEntities = { ...state.entities }
          Object.values(newEntities).forEach(todo => {
            if (todo.completed) {
              delete newEntities[todo.id]
            }
          })
          return {
            ...state,
            entities: newEntities
          }
        }
        case 'todos/todosLoading': {
          return {
            ...state,
            status: 'loading'
          }
        }
        case 'todos/todosLoaded': {
          const newEntities = {}
          action.payload.forEach(todo => {
            newEntities[todo.id] = todo
          })
          return {
            ...state,
            status: 'idle',
            entities: newEntities
          }
        }
        default:
            return state
    }
}

//SELECTOR FUNCTION
export const selectStatus = state => {
  return state.todos.status
}
const selectTodoEntities = state => state.todos.entities
export const selectTodos = createSelector(selectTodoEntities, entities =>
  Object.values(entities)
)
export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}
// export const selectTodos = state => {
//   return state.todos.entities
// }
// export const selectTodoById = (state, todoId) => {
//   return selectTodos(state).find(todo => todo.id === todoId)
// }
//THUNK FUNCTION
export async function fetchTodos1(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}
export function fetchTodos2() {
  return async function fetchTodosThunk(dispatch, getState) {
    const response = await client.get('/fakeApi/todos')
    // const stateBefore = getState(); console.log('Todos before dispatch: ', stateBefore.todos.length);
    dispatch(todosLoaded(response.todos))
    // const stateAfter = getState(); console.log('Todos after dispatch: ', stateAfter.todos.length);
  }
}
// Same thing as the above example!
export const fetchTodos = () => async dispatch => {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
  }
}

//ACTION CREATOR
export const todosLoading = () => {
  return {
    type: 'todos/todosLoading'
  }
}
export const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos
  }
}

export const todoAdded1 = todo => {
  return {
    type: 'todos/todoAdded',
    payload: todo
  }
}
export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })

//MEMOIZED SELECTORS - CACHE
export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments and 
  // returns a final result value
  todos => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: current status filter
  state => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) { return todos }
    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter(todo => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  filteredTodos => { 
    return filteredTodos.map(todo => todo.id) 
  }
)