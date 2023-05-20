/**
 * Author: Chandra Kishore Danduri
 */
import type { AppDispatch, AppState } from "./store";
import { useDispatch, useSelector } from "react-redux";

import type { TypedUseSelectorHook } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
/* `export const useAppDispatch: () => AppDispatch = useDispatch;` is creating a custom hook called
`useAppDispatch` that can be used throughout the app to dispatch actions to the Redux store. It is
using the `useDispatch` hook from the `react-redux` library to get the `dispatch` function from the
store, and then assigning it to the `useAppDispatch` hook. This custom hook can be used instead of
the `useDispatch` hook directly, making it easier to dispatch actions in a type-safe way. */
export const useAppDispatch: () => AppDispatch = useDispatch;
/* `export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;` is creating a custom
hook called `useAppSelector` that can be used throughout the app to access the state stored in the
Redux store. It is using the `useSelector` hook from the `react-redux` library to select a specific
piece of state from the store. The `TypedUseSelectorHook` type is used to ensure that the selected
state is of the correct type, which in this case is `AppState`. This custom hook can be used instead
of the `useSelector` hook directly, making it easier to access the state in a type-safe way. */
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
