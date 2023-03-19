import { useEffect, useReducer } from "react";
import Link from "next/link";
import axios from "axios";
import Layout from "../../components/Layout";
import { catchError } from "../../utils/error";

const initialState = {
  loading: true,
  summary: { salesData: [] },
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminSummaryPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, summary, error } = state;
  // console.log(summary);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: catchError(err) });
      }
    };

    fetchData();
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Summary</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="card mt-8 p-8">
                <div className="grid place-items-center">
                  <p className="text-3xl">${summary.ordersPrice.toFixed(2)}</p>
                  <p className="text-xl">Sales</p>
                  <Link
                    href="/admin/orders"
                    className="inline-block mt-2 primary-button hover:font-semibold"
                  >
                    View Sales
                  </Link>
                </div>
              </div>
              <div className="card mt-8 p-8">
                <div className="grid place-items-center">
                  <p className="text-3xl">{summary.ordersCount} </p>
                  <p className="text-xl">
                    {summary.ordersCount > 1 ? "Orders" : "Order"}
                  </p>
                  <Link
                    href="/admin/orders"
                    className="inline-block mt-2 primary-button hover:font-semibold"
                  >
                    View {summary.ordersCount > 1 ? "Orders" : "Order"}
                  </Link>
                </div>
              </div>
              <div className="card mt-4 p-8">
                <div className="grid place-items-center">
                  <div className="grid place-items-center">
                    <p className="text-3xl">{summary.productsCount} </p>
                    <p className="text-xl">
                      {summary.productsCount > 1 ? "Products" : "Product"}
                    </p>
                    <Link
                      href="/admin/products"
                      className="inline-block mt-2 primary-button hover:font-semibold"
                    >
                      View {summary.productsCount > 1 ? "Products" : "Product"}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card mt-4 p-8">
                <div className="grid place-items-center">
                  <p className="text-3xl">{summary.usersCount} </p>
                  <p className="text-xl">
                    {summary.usersCount > 1 ? "Users" : "User"}
                  </p>
                  <Link
                    href="/admin/users"
                    className="inline-block mt-2 primary-button hover:font-semibold"
                  >
                    View {summary.usersCount > 1 ? "Users" : "User"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

AdminSummaryPage.auth = { adminOnly: true };
