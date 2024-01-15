import { configureStore } from "@reduxjs/toolkit";
import { createMiddleware } from "async-selector-kit";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { reducers } from "./reducers";

const logger = createLogger({
  collapsed: true,
});

export default configureStore({
  reducer: reducers,
});
