import { createStore } from 'redux';
// const { createStore } = Redux;

const initialState = {
  todos: [],
  posts: [],
};

function myreducer(state = initialState, action) {
  // console.log(action, state);
  if (action.type == 'ADD_TODO') {
    // return {
    //   ...state,
    //   todos: [todo],
    // };
    return {
      ...state,
      todos: [...state.todos, action.todo],
    };
  }
  if (action.type == 'ADD_POST') {
    return {
      ...state,
      posts: [...state.posts, action.post],
    };
  }
}

const store = createStore(myreducer);

store.subscribe(() => {
  console.log('state updated');
  console.log(store.getState());
});

// const todoAction = { type: 'ADD_TODO', todo: 'buy milk' };
// store.dispatch(todoAction);

store.dispatch({ type: 'ADD_TODO', todo: 'buy milk' });
store.dispatch({ type: 'ADD_TODO', todo: 'sleep some more' });
store.dispatch({ type: 'ADD_POST', post: 'test post' });
