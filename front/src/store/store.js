import { configureStore } from "@reduxjs/toolkit";
import discussionReducer from "../features/discussion/discussionSlice";

const store = configureStore({
  reducer: {
    discussion: discussionReducer,
  },
});

export default store;
