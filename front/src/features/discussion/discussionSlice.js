import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDiscussion,
  existingDiscussion,
  getAllDiscussion,
} from "../../services/discussionAPI";

const initialDiscussion = [];

const initialState = {
  discussionData: initialDiscussion,
  currentDiscussion: undefined,
  loading: false,
  error: null,
};

export const PostDiscussion = createAsyncThunk(
  "discussions/createDiscussion",
  async (payload) => {
    console.log("slice discussion : ", payload);
    const response = await addDiscussion(payload);
    return response;
  }
);

export const GetExistingDiscussion = createAsyncThunk(
  "discussions/ExistingDiscussion",
  async (payload) => {
    const response = await existingDiscussion(payload);
    return response;
  }
);

export const fetchAllDiscussion = createAsyncThunk(
  "discussions/getAllDiscussion",
  getAllDiscussion
);

export const AddDiscussion = createAsyncThunk(
  "discussions/addDiscussion",
  async (payload) => {
    return payload.discussion;
  }
);

export const discussionSlice = createSlice({
  name: "discussion",
  initialState,
  reducers: {
    changeCurrentDiscussion: (state, action) => {
      state.discussionData.map((item) => {
        if (item.id === action.payload) {
          state.currentDiscussion = item;
        }
      });
    },
    changeUserCurrentDiscussion: (state, action) => {
      state.currentDiscussion = {
        ...state.currentDiscussion,
        Users: action.payload,
      };
    },
    addMessageCurrentDiscussion: (state, action) => {
      console.log("hello add mesage slice ", action.payload);
      if (state.currentDiscussion && action.payload) {
        console.log("hello payload ! ");
        state.currentDiscussion = {
          ...state.currentDiscussion,
          lastMessage: action.payload,
          idLastMessage: action.payload.id,
          messages: [
            ...(state.currentDiscussion?.messages || []),
            action.payload,
          ],
        };
      }
      console.log(state.currentDiscussion);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDiscussion.fulfilled, (state, action) => {
        state.discussionData = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(PostDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDiscussion = action.payload;
      })
      .addCase(PostDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(AddDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        state.discussionData.unshift(action.payload);
      })
      .addCase(AddDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(GetExistingDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetExistingDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentDiscussion = action.payload;
        } else {
          state.currentDiscussion = null;
        }
      })
      .addCase(GetExistingDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const {
  changeUserCurrentDiscussion,
  addMessageCurrentDiscussion,
  changeCurrentDiscussion,
} = discussionSlice.actions;

export const selectDiscussions = (state) => state.discussion.discussionData;
export const selectCurrentDiscussion = (state) =>
  state.discussion.currentDiscussion;
export const selectLoadingDiscussions = (state) => state.discussion.loading;
export const selectErrorDiscussions = (state) => state.discussion.error;

export default discussionSlice.reducer;
