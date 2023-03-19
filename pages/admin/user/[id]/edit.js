import { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../../../../components/Layout";
import { catchError } from "../../../../utils/error";
import Link from "next/link";

const initialState = {
  loading: true,
  error: "",
  loadingUpdate: false,
  errorUpdate: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    default:
      return state;
  }
}

export default function AdminUserEditPage() {
  const router = useRouter();
  const { query } = router;
  const userId = query.id;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, loadingUpdate } = state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, isAdmin }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/users/${userId}/edit`, {
        name,
        email,
        isAdmin,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("User updated successfully");
      router.push("/admin/users");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: catchError(err) });
      toast.error(catchError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users/${userId}/edit`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("isAdmin", data.isAdmin);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: catchError(err) });
      }
    };
    fetchData();
  }, [userId, setValue]);

  return (
    <Layout title={`Edit User ${userId} `}>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-8 text-3xl font-bold">Edit User</h1>
            <div className="mb-6">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                className="w-full"
                type="text"
                autoFocus
                {...register("name", {
                  required: "Please enter name",
                })}
              />
              {errors.name && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="w-full"
                type="text"
                {...register("email", {
                  required: "Please enter email",
                })}
              />
              {errors.email && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <input
                id="isAdmin"
                className="mr-2"
                type="checkbox"
                onChange={(e) => {
                  setValue("isAdmin", e.target.checked ? true : false);
                }}
                {...register("isAdmin")}
              />
              <label htmlFor="isAdmin">Is Admin</label>
              {errors.isAdmin && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.isAdmin.message}
                </div>
              )}
            </div>
            <div className="mb-6 flex justify-between">
              <Link href={`/admin/users`} className="default-button">
                Back
              </Link>
              <button className="primary-button" disabled={loadingUpdate}>
                {loadingUpdate ? "Loading" : "Update"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}

AdminUserEditPage.auth = { adminOnly: true };
