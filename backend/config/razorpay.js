const Razorpay = require("razorpay");

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  // Mock fallback instance for dev/testing when keys are pending setup
  razorpayInstance = {
    orders: {
      create: async (options) => {
        return {
          id: "order_" + Math.random().toString(36).substring(2, 12),
          amount: options.amount,
          currency: options.currency || "INR",
          receipt: options.receipt,
          status: "created",
        };
      },
    },
  };
}

module.exports = razorpayInstance;
