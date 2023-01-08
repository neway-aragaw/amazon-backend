
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
    "sk_test_51MNsE3LVyQbfEEkQ5vVgFQPCtwriAQt7rarsDlEgh2AP2lvBMkBLg6JJYuYxPnnVqZBHxyPjrgabV3BKBiElTx2D00LEB2aA9Q",
);

const app = express();


app.use(cors({origin: true}));
app.use(express.json());

app.get("/", (request, response) => response.status(200).send("hello world"));


app.post("/payments/create", async (request, response) => {
  const total = request.query.total;

  console.log("Payment Request Recieved for this amount >>> ", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, 
    currency: "usd",
   
  });


  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});


exports.api = functions.https.onRequest(app);
