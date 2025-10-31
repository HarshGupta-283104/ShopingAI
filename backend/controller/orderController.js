import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

// Ensure the environment variable is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Stripe secret key is missing from .env");
  process.exit(1); // Stop the application if the key is not found
}

const currency = "inr";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
// for User
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({ message: "Order Place" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order Place error" });
  }
};

export const stripeSession = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: "Online",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
      },
      line_items: items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
            images: [item.image1],
          },
          unit_amount: item.price * (item.price < 50 ? 10000 : 100), // Convert price to paise (INR cents)
        },
        quantity: item.quantity,
      })),
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/api/order/verify?session_id={CHECKOUT_SESSION_ID}&&origin=${req.get(
        "origin"
      )}`,
      cancel_url: `${req.get("origin")}/placeorder`,
    });

    return res.status(200).json({ session });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { session_id, origin } = req.query; // Extract the session_id from the query string

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve the session from Stripe using the session_id
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const orderId = session.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, { payment: true });
      await User.findByIdAndUpdate(session.metadata.userId, { cartData: {} });

      return res.redirect(`${origin}/placeorder?payment=success`);
    } else {
      return res.redirect(`${origin}/placeorder?payment=failed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Payment verification error" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "userOrders error" });
  }
};

//for Admin

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "adminAllOrders error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });
    return res.status(201).json({ message: "Status Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
