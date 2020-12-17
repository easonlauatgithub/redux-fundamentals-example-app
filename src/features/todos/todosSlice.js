import { client } from '../../api/client'
import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: 'idle'
})

//THUNK FUNCTION
//createAsyncThunk(extraReducers prefix, payload creator)
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})
export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  return response.todo
})
 
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload
      state.entities[todo.id] = todo
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    //todoDeleted(state, action) {delete state.entities[action.payload]},
    todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true
      })
    },
    // completedTodosCleared(state, action) {
    //   Object.values(state.entities).forEach((todo) => {
    //     if (todo.completed) {
    //       delete state.entities[todo.id]
    //     }
    //   })
    // },
    completedTodosCleared(state, action) {
      const completedIds = Object.values(state.entities)
        .filter(todo => todo.completed)
        .map(todo => todo.id)
      // Use an adapter function as a "mutating" update helper
      todosAdapter.removeMany(state, completedIds)
    },
    todosLoading(state, action) {
      state.status = 'loading'
    },
    todosLoaded(state, action) {
      const newEntities = {}
      action.payload.forEach((todo) => {
        newEntities[todo.id] = todo
      })
      state.entities = newEntities
      state.status = 'idle'
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        // const newEntities = {}
        // action.payload.forEach(todo => {
        //   newEntities[todo.id] = todo
        // })
        // state.entities = newEntities
        todosAdapter.setAll(state, action.payload)
        state.status = 'idle'
      })
      // .addCase(saveNewTodo.fulfilled, (state, action) => {
      //   const todo = action.payload
      //   state.entities[todo.id] = todo
      // })
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
  }
})

export const {
  allTodosCompleted,
  completedTodosCleared,
  todoAdded,
  todoColorSelected,
  todoDeleted,
  todoToggled,
  todosLoaded,
  todosLoading,
} = todosSlice.actions

export default todosSlice.reducer

//SELECTOR FUNCTION
export const selectStatus = state => {
  return state.todos.status
}
const selectTodoEntities = state => {
  //return state.todos.entities
  return state.todos
}
// export const selectTodos = createSelector(selectTodoEntities, entities =>
//   Object.values(entities)
// )
// export const selectTodoById = (state, todoId) => {
//   return selectTodoEntities(state)[todoId]
// }
export const {
  selectAll: selectTodos,
  selectById: selectTodoById
} = todosAdapter.getSelectors(selectTodoEntities)

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