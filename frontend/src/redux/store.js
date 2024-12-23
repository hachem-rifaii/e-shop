import {configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/user'
import sellerReducer from "./reducers/seller";
import productReducer from "./reducers/product"
import eventReducer from "./reducers/event";
import cartReducer from "./reducers/cart";
import WishlistReducer from "./reducers/wishlist";
import orderReducer from "./reducers/order";

const store = configureStore({
    reducer:{
        user:userReducer,
        seller:sellerReducer,
        products:productReducer,
        events:eventReducer,
        cart : cartReducer,
        wishlist:WishlistReducer,
        order:orderReducer,  
    }
})

export default store;