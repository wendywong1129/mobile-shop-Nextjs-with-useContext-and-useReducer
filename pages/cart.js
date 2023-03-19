import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import { Store } from "../utils/store";
import data from "../utils/data";

function CartPage() {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const router = useRouter();

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const updateCartHandler = async (it, qty) => {
    const item = data.products.find((product) => product.name === it.name);
    const quantity = +qty;

    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-6 text-2xl font-medium">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Your cart is empty.&nbsp;
          <Link href="/" className="border-b-2">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 md:gap-12 lg:grid-cols-4">
          <div className="card px-2 overflow-x-auto md:py-4 md:px-8 md:col-span-3">
            <table className="min-w-full">
              <thead>
                <tr className="text-center">
                  <th className="p-2 lg:text-left md:p-4">Item</th>
                  <th className="p-2 md:p-4">Quantity</th>
                  <th className="p-2 md:p-4">Price</th>
                  <th className="p-2 md:p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="text-center">
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center justify-center lg:justify-start"
                      >
                        <Image
                          className="hidden lg:block"
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                        ></Image>
                        &nbsp;
                        <div>{item.name}</div>
                      </Link>
                    </td>
                    <td className="p-4">
                      {
                        <select
                          className="w-12 bg-transparent appearance-none"
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((i) => (
                            <option
                              key={i + 1}
                              value={i + 1}
                              width={60}
                              height={60}
                            >
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      }
                    </td>
                    <td className="p-4">${item.price}</td>
                    <td className="p-4">
                      <button onClick={() => removeItemHandler(item)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <div className="card py-6 px-8">
              <div className="mb-4 text-lg font-semibold">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}
                &nbsp;
                {cartItems.reduce((a, c) => a + c.quantity, 0) > 1
                  ? "Items"
                  : "Item"}
                ) :
              </div>
              <div className="mb-6">
                $
                {cartItems
                  .reduce((a, c) => a + c.quantity * c.price, 0)
                  .toFixed(2)}
              </div>
              <button
                className="primary-button w-full"
                onClick={() => router.push("login?redirect=/shipping")}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
