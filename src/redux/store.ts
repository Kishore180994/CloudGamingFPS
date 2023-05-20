/**
 * Author: Chandra Kishore Danduri
 */
import { applyMiddleware, compose, configureStore } from "@reduxjs/toolkit";

import { batchedSubscribe } from "redux-batched-subscribe";
import debounce from "lodash.debounce";
import { persistStore } from "redux-persist";
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";

/* `const debounceNotify = debounce((notify) => notify());` is creating a debounced version of the
`notify` function. The `notify` function is passed as an argument to the `debounce` function, which
returns a new function that will only be executed after a certain amount of time has passed since
the last time it was called. In this case, the debounced function will call the `notify` function
after a delay, which can help to reduce the number of unnecessary updates or re-renders in the
application. */
const debounceNotify = debounce((notify) => notify());
/* The `enhancer` constant is a composed function that enhances the Redux store with additional
functionality. It includes three middleware functions: `applyMiddleware(thunk)`,
`batchedSubscribe((notify) => { notify(); })`, and `batchedSubscribe(debounceNotify)`. */
const enhancer = compose(
  applyMiddleware(thunk),
  batchedSubscribe((notify) => {
    notify();
  }),
  batchedSubscribe(debounceNotify)
);
/* This code is creating a Redux store using the `configureStore` function from the `@reduxjs/toolkit`
library. The store is configured with a root reducer (`rootReducer`), an enhancer (`enhancer`), and
middleware that disables the serializable check. The `store` constant is then exported so that it
can be used throughout the application to access the Redux store. */
export const store = configureStore({
  reducer: rootReducer,
  enhancers: [enhancer],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
/* `export const persistor = persistStore(store);` is creating a `persistor` object using the
`persistStore` function from the `redux-persist` library. The `persistStore` function takes the
Redux `store` as an argument and returns a persistor object that can be used to persist and
rehydrate the Redux store across sessions. The `persistor` object can be used to control the
persistence behavior, such as manually triggering a rehydration or purging the persisted state. The
`persistor` object is then exported so that it can be used throughout the application to access the
persistor functionality. */
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
