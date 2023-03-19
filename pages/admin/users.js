import { useEffect, useReducer } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { catchError } from "../../utils/error";

const initialState = {
  loading: true,
  users: [],
  error: "",
  loadingDelete: false,
  successDelete: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
}

export default function AdminUsersPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, users, successDelete, loadingDelete } = state;

  const deleteHandler = async (userId) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/users/${userId}/edit`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("User deleted successfully");
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(catchError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: catchError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  return (
    <Layout title="Users">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Users</h1>
        {loadingDelete && <div>Deleting...</div>}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="mt-4 min-w-full">
              <thead className="border border-white border-opacity-30">
                <tr>
                  <th className="p-6 text-center border border-white border-opacity-30">
                    ID
                  </th>
                  <th className="p-6 text-center border border-white border-opacity-30">
                    NAME
                  </th>
                  <th className="p-6 text-center border border-white border-opacity-30">
                    EMAIL
                  </th>
                  <th className="p-6 text-center border border-white border-opacity-30">
                    ADMIN
                  </th>
                  <th className="p-6 text-center border border-white border-opacity-30">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border border-white border-opacity-30 hover:bg-gray-600 hover:bg-opacity-20"
                  >
                    <td className="p-2 text-center border border-white border-opacity-30">
                      {user._id.substring(20, 24)}
                    </td>
                    <td className="p-2 text-center border border-white border-opacity-30">
                      {user.name}
                    </td>
                    <td className="p-2 text-center border border-white border-opacity-30">
                      {user.email}
                    </td>
                    <td className="p-2 text-center border border-white border-opacity-30">
                      {user.isAdmin ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                          stroke="lightGreen"
                          className="w-6 h-6 mx-auto"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                          stroke="red"
                          className="w-6 h-6 mx-auto"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </td>
                    <td className="p-2 flex justify-center gap-2 border-white border-opacity-30">
                      <Link
                        href={`/admin/user/${user._id}/edit`}
                        className="p-2 bg-yellow-300 rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="black"
                          className="w-4 h-4"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                          <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                        </svg>
                      </Link>
                      <button
                        className="p-2 bg-black rounded"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

AdminUsersPage.auth = { adminOnly: true };
