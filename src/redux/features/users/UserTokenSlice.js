import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
};

const userTokenAccessSlice = createSlice({
  name: "userAccessToken",
  initialState,
  reducers: {
    addUserAccessToken: (state, action) => {
      state.token = action.payload;
    },
    removeUserAccessToken: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

export const { addUserAccessToken, removeUserAccessToken } =
  userTokenAccessSlice.actions;
export default userTokenAccessSlice.reducer;
