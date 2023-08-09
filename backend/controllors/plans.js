// importing required packages
const Plans = require("../modals/plan")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Subscription = require("../modals/subscription")

const StripePlansIds = {
   "basic": {
      "month": "price_1NascrSDr67aca5VyqHubbHr",
      "year": "price_1NascrSDr67aca5VHQzZIqb7"
   },
   "standard":{
      "month": "price_1NasdqSDr67aca5Vt5jR4s6a",
      "year":"price_1NasdrSDr67aca5V1YQY1EWS"
   },
   "premium":{
      "month": "price_1NasekSDr67aca5V3RfuBCrl",
      "year":"price_1NasekSDr67aca5VIt6GoTPK"
   },
   "regular":{
      "month":"price_1NasfqSDr67aca5VJh1wfnrs",
      "year":"price_1NasfqSDr67aca5VWjFOyPFf"
   }
}

// @ENDPOINT: /plans/fetch-all-plans
// @METHOD: GET
// @DESCRIPTION: Return plan detials
const fetchAllPlans = (req,res) => {
   Plans.find()
   .then(plans => res.status(200).json({success: true, plans: plans[0]}))
   .catch( err => res.status(500).json({success: false, message:err.message}))
}

// @ENDPOINT: /plans/subscribe
// @METHOD: POST
// @DESCRIPTION: Start The Subscriotion
// @AUTH: Access Token is required
const startSubscription = async (req,res) => {
   
   const {email,payment_method,planname,period} = req.body;

   const planId = StripePlansIds[planname][period]


   // Create customer with provided email
   const customer = await stripe.customers.create({
      payment_method: payment_method,
      email: email,
      invoice_settings: {
       default_payment_method: payment_method,
      },
    });

   // create subscription linked with created customer
   const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: planId}],
      expand: ['latest_invoice.payment_intent']
    });

   const status = subscription['latest_invoice']['payment_intent']['status'] 
   const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

   res.status(200).json({success: true, 'client_secret': client_secret, 'status': status})

}

// @ENDPOINT: /plans/add-subscription
// @METHOD: POST
// @DESCRIPTION: Add the transaction information in the database
// @AUTH: Access Token is required
const storeSubscriptionInformation = (req,res) => {
   const {planDetails,stripePaymentId} = req.body;

   const stripePlanId = StripePlansIds[planDetails.plan][planDetails.period]

   let transaction = new Subscription({planDetails,stripePlanId,user: req.user._id,stripePaymentId})

   transaction.save()
   .then(res => res.status(200).json({success: true, message: "Trasaction Added Successfully"}))
   .catch( err => res.status(500).json({success: false, message:err.message}))
}

// @ENDPOINT: /plans/subscriptions
// @METHOD: GET
// @DESCRIPTION: Return all the transaction of the current user
// @AUTH: Access Token is required
const getAllSubscriptions = (req,res) => {
   Subscription.find({user: req.user._id})
   .then((trans) => res.status(200).json({success: true, subscriptions: trans}))
   .catch( err => res.status(500).json({success: false, message:err.message}))
}


module.exports = {fetchAllPlans,startSubscription, storeSubscriptionInformation,getAllSubscriptions}