import { useEffect, useReducer } from "react";
import Link from "next/link";
import axios from "axios";
import Layout from "../../components/Layout";
import { catchError } from "../../utils/error";

const initialState = {
  loading: true,
  orders: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderHistoryPage() {
  const [{ loading, orders, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: catchError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <h1 className="mb-8 text-3xl font-bold">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border border-white border-opacity-30">
              <tr>
                <th className="p-6 text-center border border-white border-opacity-30">
                  ID
                </th>
                <th className="p-6 text-center border border-white border-opacity-30">
                  DATE
                </th>
                <th className="p-6 text-center border border-white border-opacity-30">
                  TOTAL
                </th>
                <th className="p-6 text-center border border-white border-opacity-30">
                  PAID
                </th>
                <th className="p-6 text-center border border-white border-opacity-30">
                  DELIVERED
                </th>
                <th className="p-6 text-center border border-white border-opacity-30">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border border-white border-opacity-30 hover:bg-gray-600 hover:bg-opacity-20"
                >
                  <td className="p-4 text-center border border-white border-opacity-30">
                    {order._id.substring(20, 24)}
                  </td>
                  <td className="p-4 text-center border border-white border-opacity-30">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-4 text-center border border-white border-opacity-30">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="p-4 text-center border border-white border-opacity-30">
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : "Not paid"}
                  </td>
                  <td className="p-4 text-center border border-white border-opacity-30">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : "Not delivered"}
                  </td>
                  <td className="p-4 text-center border border-white border-opacity-30">
                    <Link
                      href={`/order/${order._id}`}
                      className="text-sm primary-button hover:font-semibold"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

OrderHistoryPage.auth = true;
