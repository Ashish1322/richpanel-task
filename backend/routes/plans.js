// importing required packages
const router = require("express").Router()

// importing controllors
const {fetchAllPlans,startSubscription,storeSubscriptionInformation,getAllSubscriptions} = require("../controllors/plans")

// importing middlewares
const {isLoggedIn} = require("../middlewares/auth")

// @DESC: Route to handle incoming fetch plan details get request
router.get("/fetch-all-plans",fetchAllPlans)

// @DESC: Route to handle incoming fetch plan details get request
router.post("/subscribe",isLoggedIn,startSubscription)

// @DESC: Route to handle incoming Request when the subscription has been started so add it in database
router.post("/add-subscription",isLoggedIn,storeSubscriptionInformation)

// @DESC: It will return all the subscription of the current user
router.get("/subscriptions",isLoggedIn,getAllSubscriptions)

module.exports = router
