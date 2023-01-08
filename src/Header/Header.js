import React from "react";
import "./Header.css";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from "react-router-dom";
import { useStateValue } from "../Context/StateProvider";
import { auth } from "../firebase";
import Nav from "./Nav";

function Header() {
const[{basket,user} ,dispatch]=useStateValue()
 const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
    }
  }

  return (
   <div className="all">
    <div className="header">
 <Link to="/">   <img className='header__logo' src="https://clipartcraft.com/images/amazon-logo-transparent-high-resolution-5.png" alt="" /></Link>
   <div className="header__option"> <span className='header__optionLineOne'>helloo</span>
    <span className='header__optionLineTwo'>Select Your address</span></div>
    <div className="header__search">
     <select name="items" className="items_lists">
      <option value="/">All</option>
    <option value="/">all department</option>
    <option value="/">Books</option>
    <option value="/">Cell Phone & Accessories</option>
    <option value="/">Cloths ,Jewelries</option>
  </select>
    <input type="text" className="header__searchInput" />
      <SearchIcon className="header__searchIcon" />
    </div>
    <div className="header__nav">
        <Link to={!user && '/login'}>
          <div onClick={handleAuthenticaton} className="header__option">
            <span className="header__optionLineOne">Hello {!user ? 'Guest' : user.email}</span>
            <span className="header__optionLineTwo">{user ? 'Sign Out' : 'Sign In'}</span>
          </div>
        </Link>

        <Link to='/orders'>
          <div className="header__option">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>
        </Link>
    <div className="header__option"> <span className='header__optionLineOne'>Your</span>
    <span className='header__optionLineTwo'>Prime</span></div>
    </div>
<Link to='/checkout'><div className="header__optionBasket">
            <ShoppingCartIcon />
            <span className="header__optionLineTwo header__basketCount">{basket.length}
            </span>
          </div></Link>
    </div>
  <Nav />
   </div>
  )
}

export default Header
