import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../utils/store";

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingInfo, paymentMethod } = cart;

  const router = useRouter();

  const paymentMethods = ["PayPal", "CashOnDelivery"];

  useEffect(() => {
    if (!shippingInfo.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [shippingInfo.address, router, paymentMethod]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    
    router.push("/placeOrder");
  };

  return (
    <Layout title="Payment Method">
      <CheckoutSteps activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-8 text-3xl font-bold">Payment Method</h1>
        {paymentMethods.map((method) => (
          <div key={method} className="mb-4">
            <input
              className="p-2 outline-none focus:ring-0"
              id={method}
              type="radio"
              name="paymentMethod"
              checked={selectedPaymentMethod === method}
              onChange={() => setSelectedPaymentMethod(method)}
            />
            <label className="p-2" htmlFor={method}>
              {method}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            className="default-button"
            type="button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

PaymentPage.auth = true;
