/**
 * Author: Chandra Kishore Danduri
 */
import SettingsReducer from "./slice";

/* This code is defining a `rootReducer` object that contains a `settings` property, which is assigned
the value of the `SettingsReducer` function. This is typically used in a Redux store to combine
multiple reducers into a single reducer function that can be used to manage the state of the
application. */
const rootReducer = {
  settings: SettingsReducer,
};

export default rootReducer;
