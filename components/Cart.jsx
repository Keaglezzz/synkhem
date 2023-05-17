import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import axios from 'axios';
import Ptest from './Ptest';

const Cart = (props) => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove, clearCart } = useStateContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("pickup"); // default to pickup
  const [region, setRegion] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showModal, setShowModal] = useState(false);

  const getPriceForSelectedVolume = (item) => {
    if (item && item.selectedVolume && item.selectedVolume.price) {
      return item.selectedVolume.price;
    } else {
      // Handle cases where selectedVolume is undefined (e.g., return a default price or 0)
      return 0;
    }
  };

  const generateDescription = () => {
    let description = cartItems
      .map(
        (item) =>
          `${item.name} - ${
            item.volumes.find(
              (volume) => volume.price === item.selectedVolumePrice
            )?.size
          } x ${item.quantity}`
      )
      .join(', ');
  
    // Add user info to description
    description += ` Customer: ${name}, ${email}, ${contactNumber}. `;
    if (deliveryOption === "delivery") {
      description += `Delivery to ${deliveryAddress}, ${region}.`;
    } else {
      description += "In-store pickup.";
    }
  
    return description;
  };

  const handleYocoPayment = async () => {
    setShowCart(false); 
      
    new window.YocoSDK({
      publicKey: 'pk_test_d5670e23vnkJO8Na29d4',
    }).showPopup({
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
          try {
            const response = await axios.post('/api/charge', {
              token: result.id,
              amountInCents: totalPrice * 100,
            });
      
            // Handle successful payment
            clearCart(); // Clear the cart on a successful payment
            toast.success('Payment successful!');
            // Clear the cart and redirect the user, or show a success message.
          } catch (error) {
            setShowCart(true); // Reopen the cart on an unsuccessful payment
            toast.error("Error occurred: " + error.message + ". Please try again.");
          }
        }
      },          
    });
  };
      
  const checkoutButton = document.querySelector('#checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      // Show the modal for user information when the checkout button is clicked
      setShowModal(true);
    });
  }

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const handleModalSubmit = () => {
    // Close the modal and start the payment process after the user information form is submitted
    setShowModal(false);
    handleYocoPayment();
  };


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
            {/* Azure Test */}
            <div className="btn-container">
              <button type="button" className="btn" id="checkout-button">
                Pay
              </button>
            </div>
          </div>  // This closing tag was missing
        )}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            <div className="modal">
              <form onSubmit={handleModalSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="text" placeholder="Contact Number" value={contactNumber} onChange={e => setContactNumber(e.target.value)} />
                <select value={deliveryOption} onChange={e => setDeliveryOption(e.target.value)}>
                  <option value="pickup">In-store Pickup</option>
                  <option value="delivery">Delivery</option>
                </select>
                {deliveryOption === "delivery" && (
                  <>
                    <select value={region} onChange={e => setRegion(e.target.value)}>
                      <option value="">Select Region</option>
                      <option value="gauteng">Gauteng</option>
                      <option value="westernCape">Western Cape</option>
                      <option value="easternCape">Eastern Cape</option>
                      {/* Add more options as needed... */}
                    </select>
                    <input type="text" placeholder="Delivery Address" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
                  </>
                )}
                <button type="submit">Submit</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  )
}

export default Cart;