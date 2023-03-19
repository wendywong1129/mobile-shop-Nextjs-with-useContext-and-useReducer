import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DropdownLink from "./DropdownLink";
import { Store } from "../utils/store";

export default function Layout({ children, title }) {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [keyword, setKeyword] = useState("");

  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const router = useRouter();

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    router.push(`/search?keyword=${keyword}`);
  };

  useEffect(() => {
    setCartItemsCount(
      cart.cartItems.reduce((pre, cur) => pre + cur.quantity, 0)
    );
  }, [cart.cartItems]);

  // let obj = {};
  // let cartItems = cart.cartItems.reduce((cartItem, next) => {
  //   obj[next.name] ? "" : (obj[next.name] = true && cartItem.push(next));
  //   return cartItem;
  // }, []);

  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-500-dark to-pink-500">
      <Head>
        <title>{title ? title + " - Shoppier" : "Shoppier"}</title>
        <meta name="description" content="Ecommerce Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="top-center" limit={1} />

      <div className="min-h-screen flex flex-col justify-between">
        <header>
          <nav className="h-20 px-6 flex justify-between items-center shadow-xl bg-zinc-800 md:px-12">
            <div>
              <Link
                href="/"
                className="flex gap-1 font-bold text-xl md:text-2xl hover:font-extrabold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 hidden md:block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
                Shoppier
              </Link>
            </div>
            <form
              className="w-full mx-auto ml-40 flex justify-center"
              onSubmit={submitHandler}
            >
              <input
                className="px-4 py-2 border border-r-0 rounded-tr-none rounded-br-none text-md focus:ring-1"
                type="text"
                placeholder="Search products..."
                onChange={(e) => setKeyword(e.target.value)}
              ></input>
              <button
                className="p-2 border border-l-0 rounded rounded-tl-none rounded-bl-none bg-transparent"
                type="submit"
                id="search-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
            <div className="flex gap-6">
              <Link href="/cart" className="relative flex gap-1 md:gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 hidden md:block"
                >
                  <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
                Cart
                {
                  // cart.cartItems.length > 0 &&
                  cartItemsCount > 0 && (
                    <span className="p-2 py-1 rounded-full bg-yellow-400 text-xs text-black font-bold md:-top-1 md:left-3 md:absolute md:p-1 md:py-0">
                      {/* {cart.cartItems.reduce((pre, cur) => pre + cur.quantity, 0)} */}
                      {cartItemsCount}
                    </span>
                  )
                }
              </Link>
              <div className="flex gap-1">
                {status === "loading" ? (
                  "Loading"
                ) : session?.user ? (
                  <div className="flex gap-4">
                    {session?.user?.isAdmin && (
                      <Menu as="div" className="relative">
                        <Menu.Button className="flex gap-1 capitalize">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                          Dashboard
                        </Menu.Button>
                        <Menu.Items className="absolute top-8 right-0 w-48 px-4 py-2 origin-top-right rounded-lg bg-black bg-opacity-90 shadow-lg z-10">
                          <Menu.Item>
                            <DropdownLink
                              className="dropdown-link"
                              href="/admin/orders"
                            >
                              Orders
                            </DropdownLink>
                          </Menu.Item>
                          {session.user.isAdmin && (
                            <Menu.Item>
                              <DropdownLink
                                className="dropdown-link"
                                href="/admin/products"
                              >
                                Products
                              </DropdownLink>
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            <DropdownLink
                              className="dropdown-link"
                              href="/admin/users"
                            >
                              Users
                            </DropdownLink>
                          </Menu.Item>
                          <Menu.Item>
                            <DropdownLink
                              className="dropdown-link"
                              href="/admin/summary"
                            >
                              Summary
                            </DropdownLink>
                          </Menu.Item>
                          <Menu.Item>
                            <DropdownLink
                              className="dropdown-link"
                              href="/admin/sales"
                            >
                              Sales Report
                            </DropdownLink>
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    )}
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex gap-1 capitalize">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                        {session.user.name}
                      </Menu.Button>
                      <Menu.Items className="absolute top-8 right-0 w-48 px-4 py-2 origin-top-right rounded-lg bg-black bg-opacity-90 shadow-lg z-10">
                        <Menu.Item>
                          <DropdownLink
                            className="dropdown-link"
                            href="/profile"
                          >
                            My Profile
                          </DropdownLink>
                        </Menu.Item>
                        {!session?.user?.isAdmin && (
                          <Menu.Item>
                            <DropdownLink
                              className="dropdown-link"
                              href="/order/history"
                            >
                              Order History
                            </DropdownLink>
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          <DropdownLink
                            className="dropdown-link"
                            href="#"
                            onClick={logoutClickHandler}
                          >
                            Logout
                          </DropdownLink>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                ) : (
                  <Link href="/login" className="flex gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 hidden md:block"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </header>

        <main className="container m-auto mt-12 pb-12 px-4">{children}</main>

        <footer className="h-20 flex justify-center items-center ">
          <p>Copyright &copy; Shoppier</p>
        </footer>
      </div>
    </div>
  );
}
