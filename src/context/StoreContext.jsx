import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [token, setToken] = useState("");
  // const [food_list,setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }


  if (token) {
    await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}});
   }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url+"/api/cart/remove", {itemId},{headers:{token}});
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItems){
      if (cartItems[item]>0){
        let itemInfo = food_list.find((product)=>product._id === item);
        // totalAmount += itemInfo.price*cartItems[item];

        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        } else {
          console.warn(`Item with id ${item} not found in food_list`);
        }
      }
    }
    return totalAmount;
  }

  // const fetchFoodList = async () => {
  //   const response = await axios.get(url+"/api/food/list");
  //   setFoodList(response.data.data);
  // }

  const loadCartData = async (token) => {
    try {
     const response = await axios.post(url+"/api/cart/get",{}, {headers:{token}});
     if (response.data.success){
     setCartItems(response.data.cartData);
     }
  } catch (error) {
    console.log("Error loading cart data:", error);
  }
}

  // useEffect(() => {
  //   console.log(cartItems);
  // }, [cartItems]);

  const clearCart = () => {
    setCartItems({});
  };

  useEffect(() => {
    if (token){
      loadCartData(token);
    } else {
      clearCart();
    }
  }, [token]);

  // useEffect(() => {
  //   localStorage.setItem("cartItems", JSON.stringify(cartItems));
  // }, [cartItems]);

  useEffect(()=>{
    async function loadData() {
      // await fetchFoodList();

      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

       if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  },[]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    url,
    token,
    setToken
  };
  
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
