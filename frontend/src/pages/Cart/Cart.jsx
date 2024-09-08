import React, { useContext, useEffect } from 'react';
import './cart.css';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Cart = () => {
  const url = 'http://localhost:8000';

  const { cartItems, food_list, cartData, fetchCart, setCartData, getTotalCartAmount } = useContext(StoreContext);

  useEffect(() => {
    fetchCart();
  }, []);

  // Function to decrease the quantity or remove an item from the cart
  const removeFromCart = async (itemId) => {
    // Call the backend to reduce quantity or remove the item
    const response = await fetch(`${url}/api/cart/remove`, { // Updated URL
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId: itemId, // Pass itemId in the request body
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      // Update cart data on the frontend
      setCartData((prevCartData) => {
        const updatedCartData = { ...prevCartData };
        if (updatedCartData[itemId] > 1) {
          updatedCartData[itemId] -= 1; // Decrease the quantity
        } else {
          delete updatedCartData[itemId]; // Remove the item if quantity is 0
        }
        return updatedCartData;
      });
    } else {
      console.error('Error removing item from cart');
    }
  };

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title titles'>
          <p className='item_image'>Items</p>
          <p>Title</p>
          <p className='center'>Price</p>
          <p className='center'>Quantity</p>
          <p className='center'>Total</p>
          <p className='center'>Remove</p>
        </div>

        {food_list.map((item) => {
          if (cartData && cartData[item._id] > 0) {
            return (
              <div className='cart-items-title cart-items-item' key={item._id}>
                <div className='item_image'>
                  <img src={`${url}/images/${item.image}`} alt='item' width='50px' />
                </div>
                <p>{item.name}</p>
                <p className='center'>${item.price}</p>
                <p className='center'>{cartData[item._id]}</p>
                <p className='center'>${Number(item.price) * cartData[item._id]}</p>
                <p className='center pointer' onClick={() => removeFromCart(item._id)}>x</p>
              </div>
            );
          }
          return null; // Avoid warning for missing return
        })}
      </div>

      {cartData && Object.keys(cartData).length !== 0 && (
        <div className='bill'>
          <h3>Total Cost</h3>
          <div className='bill-tags'>
            <div>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <div>
              <p>Delivery Fee</p>
              <p>$7</p>
            </div>
            <div>
              <p>Taxes</p>
              <p>$3</p>
            </div>
            <div>
              <p>Discount</p>
              <p>$6</p>
            </div>
          </div>
          <div className='bill-total'>
            <p>Total</p>
            <p>${getTotalCartAmount() + 4}</p>
          </div>

          <Link to='/placeOrder' className='bill-order_button'>Place Order</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
