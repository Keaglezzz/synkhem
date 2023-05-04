import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

  

  const onAdd = (product, quantity, selectedVolumePrice, selectedVolume = {}) => {
    // Create a new _id with volume size
    const productWithVolumeId = `${product._id}-${selectedVolumePrice}`;
    
  
    setTotalPrice((prevTotalPrice) => prevTotalPrice + selectedVolumePrice * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
  
    const productWithVolume = {
      ...product,
      _id: productWithVolumeId,
      quantity,
      selectedVolume,
      selectedVolumePrice,
      price: selectedVolume ? selectedVolumePrice : product.price,
    };
    setCartItems([...cartItems, productWithVolume]);
  
    toast.success(`${quantity} ${product.name} added to the cart.`);
  };
  
  
  
  
  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);
  
    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.selectedVolumePrice * foundProduct.quantity);
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  }
  

  const toggleCartItemQuanitity = (id, value) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id) {
        const updatedItem = { ...item };
        if (value === 'inc') {
          updatedItem.quantity += 1;
          setTotalPrice((prevTotalPrice) => prevTotalPrice + updatedItem.price);
          setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if (value === 'dec' && updatedItem.quantity > 1) {
          updatedItem.quantity -= 1;
          if (updatedItem.selectedVolume) {
            setTotalPrice((prevTotalPrice) => prevTotalPrice - updatedItem.selectedVolume.price);
          } else {
            setTotalPrice((prevTotalPrice) => prevTotalPrice - updatedItem.price);
          }
          setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
        }
        return updatedItem;
      } else {
        return item;
      }
    });
    
    const newTotalPrice = updatedCartItems.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );
    
    const newTotalQuantities = updatedCartItems.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0
    );
    setCartItems(updatedCartItems);
    setTotalPrice(newTotalPrice);
    setTotalQuantities(newTotalQuantities);
  };
  
  
  
  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
  };
  
  
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  }

  const decQty = () => {
    setQty((prevQty) => {
      if(prevQty - 1 < 1) return 1;
     
      return prevQty - 1;
    });
  }

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        clearCart, 
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context);