import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import Modal from 'react-modal';


import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import axios from 'axios';

// import getStripe from '../lib/getStripe'

const customStyles = {
  overlay: {
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    width: '450px', // or any other value
    height: 'auto', // or any other value
    margin: 'auto',
    padding: '20px', // or any other value
    backgroundColor: 'white', // or any other value
    border: '1px solid #ccc', // or any other value
    borderRadius: '4px', // or any other value
    position: 'relative',
  },
};

const Cart = (props) => {

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    closeModal();
    setShowCart(false);
    
    yoco.showPopup({
      amountInCents: totalPrice * 100,
      currency: 'ZAR',
      name: 'Your Store or Product',
      description: generateDescription(),
      callback: async function (result) {
        if (result.error) {
          const errorMessage = result.error.message;
          setShowCart(true);
          toast.error("Error occurred: " + errorMessage + ". Please try again.");
        } else {
          try {
            const response = await axios.post('/api/charge', {
              token: result.id,
              amountInCents: totalPrice * 100,
            });
      
            clearCart();
            toast.success('Payment successful!');
          } catch (error) {
            setShowCart(true);
            toast.error("Error occurred: " + error.message + ". Please try again.");
          }
        }
      },
    });
  };
  

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
        openModal();
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


  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div>
      <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Shipping Details Modal"
    style={customStyles} // Add this line
    >
    <h2>Enter Shipping Details</h2>
    <br></br>
    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <label>
      Company:
      <input type="text" name="name" style={{ width: '100%' }} required/>
    </label>
    <label>
      Name:
      <input type="text" name="name" style={{ width: '100%' }} required/>
    </label>
    <label>
      Address:
      <input type="text" name="address" style={{ width: '100%' }} required/>
    </label>
    <label>
      City:
      <input type="text" name="city" style={{ width: '100%' }} required/>
    </label>
    <label>
      Zip:
      <input type="text" name="zip" style={{ width: '100%' }} required/>
    </label>
    <label>
      Contact Number:
      <input type="text" name="zip" style={{ width: '100%' }} required/>
    </label>
    <button type="submit" style={{...customStyles.close, marginTop: '5px'}} className="btn">Submit</button>
    <button className="btn" style={{...customStyles.close, marginTop: '5px'}} onClick={closeModal}>Close</button>
  </form>

</Modal>
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
              <button type="button" className="btn" onClick={openModal} id="checkout-button">
                Proceed to shipping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);


          }
export default Cart;



