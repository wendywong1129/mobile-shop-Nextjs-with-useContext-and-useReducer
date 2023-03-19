import { useEffect, useReducer } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Layout from "../../components/Layout";
import { catchError } from "../../utils/error";

const initialState = {
  loading: true,
  salesData: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, salesData: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function AdminSalesPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, salesData, error } = state;

  const chartData = {
    labels: salesData.map((x) => x._id), // [2023-2,2023-3,2023-4]
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(252, 211, 77, 1)",
        data: salesData.map((x) => x.totalSales),
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/sales`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: catchError(err) });
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Sales Report</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <Bar
          className="mt-12"
            options={{
              legend: { display: true, position: "right" },
            }}
            data={chartData}
          />
        )}
      </div>
    </Layout>
  );
}

AdminSalesPage.auth = { adminOnly: true };
