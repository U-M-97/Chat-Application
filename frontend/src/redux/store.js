import { configureStore, combineReducers } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import roomSlice from "./roomSlice"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
    key: "root",
    version: 1,
    storage,
}

const rootReducer = combineReducers({ user: userSlice , room: roomSlice})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer
})
 
export let persistor = persistStore(store)