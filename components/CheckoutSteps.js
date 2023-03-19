export default function CheckoutSteps({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <div
            key={step}
            className={`flex-1 p-2 border-b-2 text-center font-semibold ${
              index <= activeStep
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-400 text-gray-400"
            }`}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}
