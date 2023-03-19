import { useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import { catchError } from "../../../utils/error";
import Link from "next/link";

const initialState = {
  loading: false,
  error: "",
  loadingUpload: false,
  errorUpload: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "CREATE_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

export default function AdminProductCreatePage() {
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, loadingUpload } = state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const uploadHandler = async (e, imageField = "image") => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "shoppier");
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      toast.success("File uploaded successfully");
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: catchError(err) });
      toast.error(catchError(err));
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await axios.post(`/api/admin/products`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Product created successfully");
      router.push(`/admin/products`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(catchError(err));
    }
  };

  return (
    <Layout title={`Create Product`}>
      <div>
        {error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-8 text-3xl font-bold">Create Product</h1>
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
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                className="w-full"
                type="text"
                {...register("slug", {
                  required: "Please enter slug",
                })}
              />
              {errors.slug && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.slug.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                className="w-full"
                type="text"
                {...register("price", {
                  required: "Please enter price",
                })}
              />
              {errors.price && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.price.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="image">image</label>
              <input
                id="image"
                className="w-full"
                type="text"
                {...register("image", {
                  required: "Please enter image",
                })}
              />
              {errors.image && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.image.message}
                </div>
              )}
              <input
                id="imageFile"
                className="w-full"
                type="file"
                onChange={uploadHandler}
              />
              {loadingUpload && <div>Uploading....</div>}
            </div>
            <div className="mb-6">
              <label htmlFor="category">category</label>
              <input
                id="category"
                className="w-full"
                type="text"
                {...register("category", {
                  required: "Please enter category",
                })}
              />
              {errors.category && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.category.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="brand">brand</label>
              <input
                id="brand"
                className="w-full"
                type="text"
                {...register("brand", {
                  required: "Please enter brand",
                })}
              />
              {errors.brand && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.brand.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="countInStock">countInStock</label>
              <input
                id="countInStock"
                className="w-full"
                type="number"
                {...register("countInStock", {
                  required: "Please enter countInStock",
                })}
              />
              {errors.countInStock && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.countInStock.message}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="countInStock">description</label>
              <input
                id="description"
                className="w-full"
                type="text"
                {...register("description", {
                  required: "Please enter description",
                })}
              />
              {errors.description && (
                <div className="mt-1 text-pink-600 font-semibold">
                  {errors.description.message}
                </div>
              )}
            </div>
            <div className="mb-6 flex justify-between">
              <Link href={`/admin/products`} className="default-button">
                Back
              </Link>
              <button className="primary-button" disabled={loading}>
                {loading ? "Loading" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}

AdminProductCreatePage.auth = { adminOnly: true };
