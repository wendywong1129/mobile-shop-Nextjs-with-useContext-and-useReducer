import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
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
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push("/placeOrder");
  };

  return (
    <Layout title="Payment Method">
      <CheckoutSteps activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-8 text-3xl font-bold">Payment Method</h1>
        {["PayPal", "CashOnDelivery"].map((paymentMethod) => (
          <div key={paymentMethod} className="mb-4">
            <input
              className="p-2 outline-none focus:ring-0"
              id={paymentMethod}
              type="radio"
              name="paymentMethod"
              checked={selectedPaymentMethod === paymentMethod}
              onChange={() => setSelectedPaymentMethod(paymentMethod)}
            />
            <label className="p-2" htmlFor={paymentMethod}>
              {paymentMethod}
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
