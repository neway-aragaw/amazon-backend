import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from "../Context/StateProvider";
import CheckoutProduct from "../Checkout/CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "../Context/reducer";
import axios from '../axios';
import { db } from "../firebase";

function Payment() {

    const [{basket, user }, dispatch]= useStateValue();
      const navigate = useNavigate();

const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => item.price + amount, 0);

  // The function uses the reduce method to iterate over the items in the basket and sum their prices. 
  // The reduce method applies a function to each element in the array, in this case, adding the price of the current item to the running total stored in the "amount" variable. 
  // The reduce method returns a single value, which is the total price of all the items in the basket.

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);

//"error": The current error, if any. The initial value is null.
// "disabled": A boolean value indicating whether the component is disabled or not. The initial value is true.
// "succeeded": A boolean value indicating whether a certain operation has succeeded or not. The initial value is false.
// "processing": A string value indicating the current processing status of the component. The initial value is an empty string.
// "clientSecret": A boolean value indicating the current client secret. The initial value is true.
 
     useEffect(() => {
      const getClientSecret = async () => {
        const response = await axios({
        method: 'post',
        withCredentials:false,
        //stripe expects the total in a currencies subunits
        url:`/payments/create?total=${getBasketTotal(basket) * 100}`
        });
        console.log(response);
        setClientSecret(response.data.clientSecret);
      };
      getClientSecret();
     }, [basket]);

//      The useEffect hook also takes an array as a second argument, which is called the "dependencies array." This array is used to control when the effect function is run. In this case, the effect function is run every time the "basket" variable changes.
// The getClientSecret function is an async function that sends a POST request to the server with the total price of the items in the basket. The total price is calculated using the getBasketTotal function that you asked about earlier. The response from the server contains a "clientSecret" field, which is stored in the component's state using the setClientSecret function.

     console.log("THE SECRECT IS  >>>" , clientSecret);

const handleSubmit = async (event) => {
  event.preventDefault();
  setProcessing(true);
  
  const payload = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement),
    },
  }).then(({ paymentIntent }) => {
console.log(paymentIntent);

  db.collection("users")
    .doc(user?.uid)
    .collection( "orders")
    .doc(paymentIntent.id)
    .set({
      basket: basket,
      amount: paymentIntent.amount,
      created: paymentIntent.created,
    });

    setSucceeded(true);
    setError(null);
    setProcessing(false);

     dispatch({
      type: 'EMPTY_BASKET',
     });

    navigate('/orders');
  })

};
  const handleChange = (event) => {
    //listen for changes in the CardElement
    //and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };


return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        {/* payment section delivery address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p> 1234 sefere</p>
            <p>Baltimore,MD</p>
          </div>
        </div>
        {/* payment section -- review address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
                Product={item.Product}
              />
            ))}
          </div>
        </div>
        {/* payment section payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">{/* stripe magic will go */}</div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => ( <h3>Order Total: {value} </h3> )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
                <button  disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>
                    Processing</p> : 'Buy Now'}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;


// The value of the "disabled" attribute is determined by the values of the "processing", "disabled", and "succeeded" variables.
//  If any of these variables are truthy (i.e., if they are set to a value that evaluates to true), the button will be disabled.
// The button element also has a child element, which is a span element containing the text "Processing" or "Buy Now". The text that is displayed is determined by the value of the "processing" variable. If "processing" is truthy, the text "Processing" is displayed. If "processing" is falsy, the text "Buy Now" is displayed.



// The button has a "disabled" attribute, which is set to the string "disabled".
// In HTML, the "disabled" attribute is a boolean attribute that, when present, indicates that the button is disabled and the user cannot interact with it. In JSX, the value of the "disabled" attribute is treated as a string, so in this case, the button will be disabled because the value of the "disabled" attribute is the string "disabled".

// The "setDisabled" function is being called with the value of the "empty" property as an argument. This will update the component's "disabled" state to match the value of the "empty" property.
// The "setError" function is being called with the value of the "error" property as an argument, or an empty string if the "error" property is falsy. This will update the component's "error" state to match the value of the "error" property, or clear the error if there is no error.





// The function starts by calling the "preventDefault" method on the event object. This prevents the default behavior of the event (in this case, submitting the form) from being triggered.

// The function then sets the "processing" state to true using the "setProcessing" function. This will display a "Processing" message to the user and disable the form elements.

// The function then calls the "stripe.confirmCardPayment" method with the "clientSecret" and an object containing the payment details as arguments. The "clientSecret" is a value returned by the server when the payment is created, and the payment details object contains information about the payment method (in this case, a credit card) and the amount to be charged.

// The "stripe.confirmCardPayment" method returns a promise that resolves with a paymentIntent object when the payment is successful. The paymentIntent object contains information about the payment, such as the amount, the payment status, and the payment ID.

// The function then uses the resolved paymentIntent object to create a new document in a Firebase Firestore database using the "set" method. The document contains information about the payment, such as the items in the basket, the amount, and the creation date.

// Finally, the function updates the component's state by setting the "succeeded" state to true, the "error" state to null, and the "processing" state to false. It also dispatches an action to empty the basket and navigates to the "/orders" route.


// a client secret is a unique string that is associated with a specific Stripe account and is used to authenticate API requests. The client secret is used along with your Stripe API key to make API requests that can perform actions on your account, such as creating charges or updating account information




// The confirmCardPayment method requires two arguments: the clientSecret and an object containing the payment_method that is being used to make the payment. The clientSecret is a unique string that is associated with the payment intent and is used to confirm the payment. The payment_method is an object that contains details about the payment method being used for the payment, such as the card element that was created using the Stripe Elements library.

// The confirmCardPayment method returns a promise that resolves with a payment intent object if the payment is successful, or rejects with an error if the payment fails. The payment intent object contains information about the payment, such as the status of the payment and the amount that was charged.