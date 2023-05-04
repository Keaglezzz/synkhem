import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import axios from 'axios';

// import getStripe from '../lib/getStripe';

const Cart = (props) => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove, clearCart } = useStateContext();

  const getPriceForSelectedVolume = (item) => {
    if (item && item.selectedVolume && item.selectedVolume.price) {
      return item.selectedVolume.price;
    } else {
      // Handle cases where selectedVolume is undefined (e.g., return a default price or 0)
      return 0;
    }
  };

  const generateDescription = () => {
    return cartItems
      .map(
        (item) =>
          `${item.name} - ${
            item.volumes.find(
              (volume) => volume.price === item.selectedVolumePrice
            )?.size
          } x ${item.quantity}`
      )
      .join(', ');
  };
  

  useEffect(() => {
    if (typeof window !== 'undefined' && window.YocoSDK) {
      const yoco = new window.YocoSDK({
        publicKey: 'pk_test_d5670e23vnkJO8Na29d4',
      });
  
      const handleYocoPayment = async () => {
        setShowCart(false); // Add this line to close the cart
      
        yoco.showPopup({
          amountInCents: totalPrice * 100,
          currency: 'ZAR',
          name: 'Your Store or Product',
          description: generateDescription(),
          callback: async function (result) {
            if (result.error) {
              const errorMessage = result.error.message;
              setShowCart(true); // Reopen the cart on an unsuccessful payment
              toast.error("Error occurred: " + errorMessage + ". Please try again.");
            } else {
              // Handle successful payment
              clearCart(); // Clear the cart on a successful payment
              
              try {
                const response = await axios.post('/api/charge', {
                  token: result.id,
                  amountInCents: totalPrice * 100,
                });
      
                // Handle successful payment
                toast.success('Payment successful!');
                // Clear the cart and redirect the user, or show a success message.
              } catch (error) {
                toast.error("Error occurred: " + errorMessage + ". Please try again.");
              }
            }
          },
        });
      };
      
      const checkoutButton = document.querySelector('#checkout-button');
      if (checkoutButton) {
        checkoutButton.addEventListener('click', handleYocoPayment);
      }
  
      return () => {
        if (checkoutButton) {
          checkoutButton.removeEventListener('click', handleYocoPayment);
        }
      };
    }
  }, [totalPrice]);
  
  // const handleCheckout = async () => {
  //   const stripe = await getStripe();

  //   const response = await fetch('/api/stripe', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(cartItems),
  //   });

  //   if(response.statusCode === 500) return;
    
  //   const data = await response.json();

  //   toast.loading('Redirecting...');

  //   stripe.redirectToCheckout({ sessionId: data.id });
  // }

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
        type="button"
        className="cart-heading"
        onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping cart is empty</h3>
            <Link href="/services">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
        {cartItems.length >= 1 && cartItems.map((item) => {
        console.log('Item:', item);
        console.log('Selected Volume:', item.selectedVolume);
        const price = getPriceForSelectedVolume(item);
        return (
          <div className="product" key={item._id}>
            <img src={urlFor(item?.image[0])} className="cart-product-image" alt={item.name} />
            <div className="item-desc">
              <div className="flex top">
              <h5>
                {item.name} -{" "}
                {
                  item.volumes.find(
                    (volume) => volume.price === item.selectedVolumePrice
                  )?.size
                }
              </h5>
                <h4>R{item.selectedVolumePrice}</h4>
              </div>
              <div className="flex bottom">
                <div>
                  <p className="quantity-desc">
                    <span className="minus" onClick={() => toggleCartItemQuanitity(item._id, 'dec') }>
                      <AiOutlineMinus />
                    </span>
                    <span className="num" onClick="">{item.quantity}</span>
                    <span className="plus" onClick={() => toggleCartItemQuanitity(item._id, 'inc') }><AiOutlinePlus /></span>
                  </p>
                </div>
                <button
                  type="button"
                  className="remove-item"
                  onClick={() => onRemove(item)}
                >
                  <TiDeleteOutline />
                </button>
              </div>
            </div>
          </div>
        );
      })}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>R{totalPrice}</h3>
            </div>
            <div className="btn-container">
            <button type="button" className="btn" id="checkout-button">
              Pay
            </button>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart