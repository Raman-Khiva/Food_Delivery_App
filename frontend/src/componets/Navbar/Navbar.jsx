import React, { useContext, useState, useEffect, useRef } from 'react';
import './navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ logOpen, setLogOpen }) => {
  const [menu, setMenu] = useState('home');
  const changeMenu = (menuItem) => () => setMenu(menuItem);
  const [barsOpen, setBarsOpen] = useState(false);
  const { token, setToken, fetchOrderData } = useContext(StoreContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null); // Ref for the profile dropdown

  // Function to handle logout and clear cookies
  const handleLogout = () => {
    // Clear the token from context
    setToken(null);
  
    // Remove token from cookies
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
    // Remove token from localStorage or sessionStorage if you are using it
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  
    // Navigate to the home page after logout without reloading the page
    window.location.href = '/';
  };
  

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false); // Close profile dropdown if click is outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef]);

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-logo_container'>
        <img src={assets.logo} alt='Tomato' className='logo' />
      </Link>
      <ul className='navbar-menu'>
        <Link to='/'>
          <li className={menu === 'home' ? 'active' : ''} onClick={changeMenu('home')}>
            Home
          </li>
        </Link>
        <Link to='/menu' className={menu === 'menu' ? 'active' : ''} onClick={changeMenu('menu')}>
          Menu
        </Link>
        <a>
          <li className={menu === 'mobile' ? 'active' : ''} onClick={changeMenu('mobile')}>
            Mobile App
          </li>
        </a>
        <a>
          <li className={menu === 'contact' ? 'active' : ''} onClick={changeMenu('contact')}>
            Contact Us
          </li>
        </a>
      </ul>

      <div className='navbar-right'>
        <div className='navbar-search-icon'>
          <Link to='/cart'>
            <img src={assets.basket_icon} alt='' width='22px' height='22px' />
          </Link>
          <div className='dot'></div>
        </div>
        {token ? (
          <div className='navbar-profile_container' ref={profileRef}>
            <img
              className='navbar-profile_icon'
              onClick={() => {
                setProfileOpen(!profileOpen);
              }}
              src={assets.profile_icon}
              alt='profile_icon'
            />
            {profileOpen && (
              <ul className='navbar-profile_options'>
                <li onClick={fetchOrderData} className='navbar-profile_options-link'>
                  <Link to='/orders' className='navbar-profile_options-link'>
                    <img src={assets.bag_icon} alt='bag_icon' />
                    <p>Orders</p>
                  </Link>
                </li>
                <hr />
                <li onClick={handleLogout} className='navbar-profile_options-link'>
                  <img src={assets.logout_icon} alt='logout_icon' />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button onClick={() => setLogOpen(true)}>sign in</button>
        )}
        <FaBars className='navbar-bars' onClick={() => setBarsOpen(!barsOpen)} />
        {barsOpen && (
          <div className='navbar-profile_options navbar-bars_options'>
            <Link to='/' className={menu === 'home' ? 'active navbar_bars-options-link' : 'navbar_bars-options-link'} onClick={changeMenu('home')}    >
              <p>Home</p>
            </Link>
            <Link to='/menu' className={menu === 'menu' ? 'active navbar_bars-options-link' : 'navbar_bars-options-link'} onClick={changeMenu('menu')}  >
              <p>Menu</p>
            </Link>
            <Link className={menu === 'mobile' ? 'active navbar_bars-options-link' : 'navbar_bars-options-link'} onClick={changeMenu('mobile')} to='/'   >
              <p>Mobile App</p>
            </Link>
            <Link className={menu === 'contact' ? 'active navbar_bars-options-link' : 'navbar_bars-options-link'} onClick={changeMenu('contact')}  to='/'  >
              <p>Contact Us</p>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
