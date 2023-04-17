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
  loadingUpload: false,
  errorUpload: "",
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

export default function AdminProductEditPage() {
  const router = useRouter();
  const { query } = router;
  const productId = query.id;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, loadingUpdate, loadingUpload } = state;

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
      // const {
      //   data: { signature, timestamp },
      // } = await axios("/api/admin/cloudinary-sign");
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      // formData.append("signature", signature);
      // formData.append("timestamp", timestamp);
      formData.append("upload_preset", "shoppier");
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);
      console.log("cloudinary data: ", data);
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
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/products/${productId}/edit`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: catchError(err) });
      toast.error(catchError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/admin/products/${productId}/edit`
        );
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("image", data.image);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("countInStock", data.countInStock);
        setValue("description", data.description);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: catchError(err) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  return (
    <Layout title={`Edit Product ${productId} `}>
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
            <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>
            <div className="mb-6">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                autoFocus
                className="w-full"
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
                type="text"
                className="w-full"
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
                type="number"
                className="w-full"
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
                type="text"
                className="w-full"
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
                type="file"
                className="w-full"
                onChange={uploadHandler}
              />
              {loadingUpload && <div>Uploading....</div>}
            </div>
            <div className="mb-6">
              <label htmlFor="category">category</label>
              <input
                id="category"
                type="text"
                className="w-full"
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
                type="text"
                className="w-full"
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
                type="number"
                className="w-full"
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
                type="text"
                className="w-full"
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

AdminProductEditPage.auth = { adminOnly: true };
