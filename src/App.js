import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header/Header";
import Home from "./Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./Checkout/Checkout";
import Login from "./Login/Login";
import Payment from "./Payment/Payment";
import Orders from "./Order/Orders";
import { auth } from "./firebase";
import { useStateValue } from "./Context/StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const promise = loadStripe(
  "pk_test_51MNsE3LVyQbfEEkQNBeDUj0SldVv2efxfbpdK4xDYQBq7WEB4wHgWy9oe7ASnZctSmjvKfUVpBlbiKR4RG8WzHg20000IIvmmN"
);

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);
   return (
    <div className="App">
    <Header />
 <Routes>
 <Route path='/' exact element={<Home />}></Route>
 <Route path='/checkout' exact element={<Checkout />}></Route>
 <Route path='/payment' exact element={
  <Elements stripe={promise} >
      <Payment />
    </Elements>}
  />
 <Route path='/orders' exact element={
  <Elements stripe={promise} >
      <Orders />
    </Elements>}
  >
 </Route>
 <Route path='/login' exact element={<Login />}></Route>
 </Routes>

    </div>
  );
}

export default App;