import { useEffect, useReducer } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { catchError } from "../../utils/error";

const initialState = {
  loading: true,
  order: {},
  error: "",
  loadingPay: false,
  successPay: false,
  errorPay: "",
  loadingDeliver: false,
  successDeliver: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };

    default:
      state;
  }
}

export default function OrderPage() {
  const { data: session } = useSession();

  const { query } = useRouter();
  const orderId = query.id;

  const [paypalState, paypalDispatch] = usePayPalScriptReducer();
  const { isPending } = paypalState;

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    loading,
    order,
    error,
    loadingPay,
    successPay,
    loadingDeliver,
    successDeliver,
  } = state;

  const {
    shippingInfo,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      console.log(details);
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order paid successfully");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: catchError(err) });
        toast.error(catchError(err));
      }
    });
  }

  function onError(err) {
    toast.error(catchError(err));
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered");
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: catchError(err) });
      toast.error(catchError(err));
    }
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: catchError(err) });
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "AUD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [orderId, order, paypalDispatch, successPay, successDeliver]);

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-8 text-3xl font-bold">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-3 md:gap-12">
          <div className="overflow-x-auto md:col-span-2">
            <div className="card p-6">
              <h2 className="mb-2 text-xl font-bold">Shipping Address</h2>
              <div>
                {shippingInfo.fullName}, {shippingInfo.address},{" "}
                {shippingInfo.city}, {shippingInfo.postalCode},{" "}
                {shippingInfo.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">
                  Delivered at {deliveredAt.substring(0, 10)}{" "}
                  {deliveredAt.substring(11, 19)}
                </div>
              ) : (
                <div className="alert-error">Not dispatched</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-xl font-bold">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">
                  Paid at {paidAt.substring(0, 10)} {paidAt.substring(11, 19)}
                </div>
              ) : (
                <div className="alert-error">Pending payment</div>
              )}
            </div>

            <div className="card overflow-x-auto p-6">
              <h2 className="mb-2 text-xl font-bold">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-4 text-left">Item</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-xl font-bold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice.toFixed(2)}</div>
                  </div>
                </li>{" "}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice.toFixed(2)}</div>
                  </div>
                </li>
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="w-full">
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
                {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                  <li>
                    {loadingDeliver && <div>Loading...</div>}
                    <button
                      className="primary-button w-full"
                      onClick={deliverOrderHandler}
                    >
                      Deliver Order
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderPage.auth = true;
