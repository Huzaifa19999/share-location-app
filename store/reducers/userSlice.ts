import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid:'',
    userName: '',
    email: '',
    location: {
      latitude: null,
      longitude: null,
    },
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    logout: state => {
      (state.userName = ''),
        (state.email = ''),
        (state.location = {latitude: null, longitude: null});
      state.isAuthenticated = false;
    },
  },
});

export const {setUser, setLocation, logout} = userSlice.actions;
export default userSlice.reducer;
