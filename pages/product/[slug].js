import { useState, useContext, useEffect, useReducer } from "react";
// import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Rating from "../../components/Rating";
// import data from "../../utils/data";
import { Store } from "../../utils/store";
import { catchError } from "../../utils/error";
import db from "../../utils/db";
import Product from "../../models/Product";

const initialState = {
  loading: true,
  reviews: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, reviews: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export default function ProductPage({ product }) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: session } = useSession();

  const { state, dispatch } = useContext(Store);

  const [reviewsState, reviewsDispatch] = useReducer(reducer, initialState);
  const { loading, error, reviews } = reviewsState;

  const fetchReviews = async () => {
    try {
      reviewsDispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      reviewsDispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      reviewsDispatch({ type: "FETCH_FAIL", payload: catchError(err) });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/api/products/${product._id}/reviews`, {
        rating,
        comment,
      });
      toast.success("Review submitted successfully");
      fetchReviews();
    } catch (err) {
      toast.error(catchError(err));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []); // eslint-disable-line

  // const { query } = useRouter();
  // const { slug } = query;

  // const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existingItem = state.cart.cartItems.find(
      (cartItem) => cartItem.slug === product.slug
    );
    const quantity = existingItem ? +existingItem.quantity + +qty : +qty;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry! Quantity ordered exceeds the stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    toast.success("Product added to the cart");
  };

  return (
    <Layout title={product.name}>
      <Link href="/">
        <button className="mb-12 secondary-button">Back to Products</button>
      </Link>
      <div className="grid md:grid-cols-5">
        <div className="md:col-span-2">
          <Image
            className="rounded-lg"
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            priority={true}
            responsive={"true"}
          ></Image>
        </div>
        <div className="card p-8 mr-12 md:col-span-2">
          <ul className="flex flex-col gap-4">
            <li>
              <h1 className="text-3xl">{product.name}</h1>
            </li>
            <li>
              <Rating value={product.rating} numReviews={product.numReviews} />
            </li>
            <li>
              <span className="text-black font-semibold">Category: </span>
              {product.category}
            </li>
            <li>
              <span className="text-black font-semibold">Brand: </span>
              {product.brand}
            </li>
            <li>
              <div className="text-black font-semibold">Description: </div>
              {product.description}
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-8">
            <div className="mb-4 flex justify-between">
              <div>Price</div>
              <div>${product.price.toFixed(2)}</div>
            </div>
            <div className="mb-4 flex justify-between">
              <div>Status</div>
              <div>
                {product.countInStock > 0 ? "In stock" : "Out of stock"}
              </div>
            </div>
            <div className="mb-6 flex justify-between">
              Quantity
              <select
                className="bg-transparent"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              >
                {[...Array(product.countInStock).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="w-1/2">
          <h3 className="mt-12 text-3xl font-bold">Customer Reviews</h3>
          {reviews.length === 0 && (
            <div className="alert-error">No reviews</div>
          )}
          {reviews.map((review) => (
            <div className="pt-2 flex items-center gap-6" key={review._id}>
              <div className="">
                <p className="my-2 capitalize">
                  <strong>{review.name}</strong>
                </p>
                {review.createdAt.substring(0, 10)}
              </div>
              <div className="h-12 mt-2 border border-slate-50"></div>
              <div className="">
                <Rating value={review.rating}></Rating>
                {review.comment}
              </div>
            </div>
          ))}
          <div className="mt-6 p-6 bg-gray-100 bg-opacity-20 rounded-lg">
            {session && session.user ? (
              <form onSubmit={submitHandler}>
                <div className="text-xl font-semibold">Leave your review</div>
                <select
                  className="w-full mt-4"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="5">5 - Very satisfied</option>
                  <option value="4">4 - Satisfied</option>
                  <option value="3">3 - Have no idea</option>
                  <option value="2">2 - Not satisfied</option>
                  <option value="1">1 - Very dissatisfied</option>
                </select>
                <textarea
                  className="w-full mt-4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <button className="mt-2 primary-button" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <h2>
                Please{" "}
                <Link
                  href={`/login?redirect=/product/${product.slug}`}
                  className="border-b-2"
                >
                  login
                </Link>
                to write a comment
              </h2>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, "-reviews").lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
