import { client } from '../../api/client'
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = [
    // { id: 0, text: 'Learn React', completed: true },
    // { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    // { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
]
 
//COMMON FUNCTION 
function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export const selectTodos = state => state.todos

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find(todo => todo.id === todoId)
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
          // Return a new todos state array with the new todo item at the end
          return [...state, action.payload]
        }
        case 'todos/todoAdded2': {
            // Can return just the new todos array - no extra object around it
            return [
              ...state,
              {
                id: nextTodoId(state),
                text: action.payload,
                completed: false
              }
            ]
        }
        case 'todos/todoToggled': {
            return state.map(todo => {
              if (todo.id !== action.payload) {
                return todo
              }
      
              return {
                ...todo,
                completed: !todo.completed
              }
            })
        }
        case 'todos/colorSelected': {
            const { color, todoId } = action.payload
            return state.map((todo) => {
              if (todo.id !== todoId) {
                return todo
              }
      
              return {
                ...todo,
                color,
              }
            })
        }
        case 'todos/todoDeleted': {
            return state.filter((todo) => todo.id !== action.payload)
        }
        case 'todos/allCompleted': {
            return state.map((todo) => {
              return { ...todo, completed: true }
            })
        }
        case 'todos/completedCleared': {
            return state.filter((todo) => !todo.completed)
        }
        case 'todos/todosLoaded': {
          return action.payload
        }            
        default:
            return state
    }
}

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

//MEMOIZED SELECTORS
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
  filteredTodos => filteredTodos.map(todo => todo.id)
)