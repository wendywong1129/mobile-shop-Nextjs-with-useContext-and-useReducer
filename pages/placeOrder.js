import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../utils/store";
import { catchError } from "../utils/error";

export default function PlaceOrderPage() {
  const [loading, setLoading] = useState(false);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingInfo, paymentMethod } = cart;

  const router = useRouter();

  const itemsPrice = cartItems
    .reduce((a, c) => a + c.quantity * c.price, 0)
    .toFixed("2");
  const shippingPrice = (+itemsPrice > 1000 ? 0 : 15).toFixed(2);
  const taxPrice = (itemsPrice * 0.15).toFixed(2);
  const totalPrice = (+itemsPrice + +shippingPrice + +taxPrice).toFixed(2);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingInfo,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(catchError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutSteps activeStep={3} />
      <h1 className="mb-8 text-3xl font-bold">Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Your cart is empty.&nbsp;
          <Link href="/" className="border-b-2">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 md:gap-12">
          <div className="overflow-x-auto md:col-span-2">
            <div className="card p-6">
              <h2 className="mb-2 text-xl font-bold">Shipping Address</h2>
              <div className="mb-1">
                {shippingInfo.fullName}, {shippingInfo.address},{" "}
                {shippingInfo.city}, {shippingInfo.postalCode},{" "}
                {shippingInfo.country}
              </div>
              <div>
                <Link href="/shipping" className="text-amber-300 font-semibold">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card p-6">
              <h2 className="mb-2 text-xl font-bold">Payment Method</h2>
              <div className="mb-1">{paymentMethod}</div>
              <div>
                <Link href="/payment" className="text-amber-300 font-semibold">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg font-bold">Order Items</h2>
              <table className="min-w-full mb-1">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
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
                      <td className="p-4 text-right">{item.quantity}</td>
                      <td className="p-4 text-right">${item.price}</td>
                      <td className="p-4 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart" className="text-amber-300 font-semibold">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-xl font-bold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? "Loading..." : "Place Order"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderPage.auth = true;
