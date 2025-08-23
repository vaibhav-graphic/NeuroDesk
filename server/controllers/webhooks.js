import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripWebhooks = async (request, responce) => {
  const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = strips.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return responce.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { transactionId, appId } = session.metadata;

        if (appId === "NeuroDesk") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          await User.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: transaction.credits } }
          );

          transaction.isPaid = true;
          await transaction.save();
        } else {
          return responce.json({
            received: true,
            message: "Ignored event : Invalid app",
          });
        }

        break;
      }

      default:
        console.log("Unhandled event type: ", event.type);
        break;
    }

    responce.json({received: true}  );
  } catch (error) {
    console.error("Webhook processing error:", error);
    responce.status(500).send("Internal Server Error");
  }
};
