import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
    name: "room",
    initialState: {
        room: null
    },
    reducers: {

        roomJoined: (state, action) => {
            state.room = action.payload
        }
    }
})

export const { roomJoined } = roomSlice.actions
export default roomSlice.reducer