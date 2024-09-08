import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    try {
        console.log("adding data to cart!")
        console.log(req.body.itemId);
        let userData = await userModel.findById(req.body.userId);
        console.log(userData);
        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        console.log(userData.cartData);
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        console.log('removing cart data');
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] && cartData[req.body.itemId] > 1) {
            cartData[req.body.itemId] -= 1;
        } else {
            delete cartData[req.body.itemId]; // Remove the item if the quantity is 0
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error" });
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {};
        console.log("cartData", cartData);
        res.json({ success: true, cartData });
    } catch (err) {
        res.json({ success: false, message: "Error" });
    }
}

export {
    addToCart,
    getCart,
    removeFromCart
}
