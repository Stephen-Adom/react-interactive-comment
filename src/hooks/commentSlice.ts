import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentType } from "./states";

// Define a type for the slice state
interface CommentState {
  comments: CommentType[];
  showConfirmDialog: boolean;
  commentInfo: CommentType | null;
  infoType: string | null;
}

// Define the initial state using that type
const initialState: CommentState = {
  comments: [],
  showConfirmDialog: false,
  commentInfo: null,
  infoType: null,
};

export const commentSlice = createSlice({
  name: "comments",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    saveAllComments: (state, action: PayloadAction<CommentType[]>) => {
      state.comments = action.payload;
    },
    openConfirmDialog: (state) => {
      state.showConfirmDialog = true;
    },
    closeConfirmDialog: (state) => {
      state.showConfirmDialog = false;
    },
    setCommentInfo: (state, action: PayloadAction<CommentType>) => {
      state.commentInfo = action.payload;
    },
    removeCommentInfo: (state) => {
      state.commentInfo = null;
    },

    setInfoType: (state, action: PayloadAction<string>) => {
      state.infoType = action.payload;
    },

    resetInfoType: (state) => {
      state.infoType = null;
    },

    resetCommentState: (state) => {
      state.infoType = null;
      state.commentInfo = null;
      state.comments = [];
    },
  },
});

export const {
  saveAllComments,
  closeConfirmDialog,
  openConfirmDialog,
  setCommentInfo,
  removeCommentInfo,
  setInfoType,
  resetInfoType,
  resetCommentState,
} = commentSlice.actions;

export default commentSlice.reducer;
