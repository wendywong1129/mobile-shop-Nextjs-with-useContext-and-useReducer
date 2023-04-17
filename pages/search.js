import { useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import { Store } from "../utils/store";
import db from "../utils/db";
import Product from "../models/Product";

const PAGE_SIZE = 4;

const priceRanges = [
  {
    name: "$1 to $500",
    value: "1-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
  {
    name: "$1001 to $1500",
    value: "1001-1500",
  },
  {
    name: "$1501 to $2000",
    value: "1501-2000",
  },
  {
    name: "$2001 to $2500",
    value: "2001-2500",
  },
];

export default function SearchPage({
  products,
  productsCount,
  categories,
  brands,
  pages,
}) {
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existingItem = state.cart.cartItems.find(
      (cartItem) => cartItem.slug === product.slug
    );
    const quantity = existingItem ? +existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry! Quantity ordered exceeds the stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    toast.success("Product added to the cart");
  };

  const router = useRouter();
  const { query } = router;
  // default value
  const {
    category = "all",
    brand = "all",
    priceRange = "all",
    rating = "all",
    sort = "featured",
    page = 1,
    keyword = "all",
  } = query;

  const filterSearch = ({
    category,
    brand,
    priceRange,
    sort,
    page,
    keyword,
  }) => {
    const { query } = router;

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (priceRange) query.priceRange = priceRange;
    if (sort) query.sort = sort;
    if (page) query.page = page;
    if (keyword) query.keyword = keyword;

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };

  const priceRangeHandler = (e) => {
    filterSearch({ priceRange: e.target.value });
  };

  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };

  const pageHandler = (page) => {
    filterSearch({ page });
  };

  return (
    <Layout title="search">
      <div className="grid md:grid-cols-5 md:gap-16">
        <div>
          <div className="mt-3 mb-6">
            <h2 className="mb-2 font-semibold">Categories</h2>
            <select
              className="w-full"
              value={category}
              onChange={categoryHandler}
            >
              <option value="all">All</option>
              {categories &&
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-6">
            <h2 className="mb-2 font-semibold">Brands</h2>
            <select className="w-full" value={brand} onChange={brandHandler}>
              <option value="all">All</option>
              {brands &&
                brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-6">
            <h2 className="mb-2 font-semibold">Prices</h2>
            <select
              className="w-full"
              value={priceRange}
              onChange={priceRangeHandler}
            >
              <option value="all">All</option>
              {priceRanges &&
                priceRanges.map((priceRange) => (
                  <option key={priceRange.value} value={priceRange.value}>
                    {priceRange.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="mb-16 flex items-center justify-between">
            <div className="flex items-center font-semibold">
              {(keyword == "all" || keyword == "") &&
              category == "all" &&
              brand == "all" &&
              rating == "all" &&
              priceRange == "all" ? (
                <div className="text-3xl font-semibold">Search Results</div>
              ) : products.length === 0 ? (
                "No Results"
              ) : (
                productsCount + " Results: "
              )}
              {keyword !== "all" && keyword !== "" && keyword + " , "}
              {category !== "all" && category + " , "}
              {brand !== "all" && brand + " , "}
              {priceRange !== "all" && " $" + priceRange + " , "}
              &nbsp;
              {(keyword !== "all" && keyword !== "") ||
              category !== "all" ||
              brand !== "all" ||
              rating !== "all" ||
              priceRange !== "all" ? (
                <button onClick={() => router.push("/search")}>
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
            <div>
              <span className="mr-2 font-semibold">Sort by</span>
              <select value={sort} onChange={sortHandler}>
                <option value="featured">Featured</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="topRated">Customer Reviews</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              ))}
            </div>
            <ul className="flex justify-end">
              {!(+page === 1) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-4 h-4 mt-2 hover:text-gray-300"
                  onClick={() => pageHandler(+page - 1)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              )}
              {products.length > 0 &&
                [...Array(pages).keys()].map((pageNumber) => (
                  <li key={pageNumber}>
                    <button
                      className={`m-1 px-2 rounded font-semibold hover:text-gray-300 ${
                        +page === pageNumber + 1
                          ? "bg-pink-700 hover:text-white"
                          : "bg-transparent"
                      } `}
                      onClick={() => pageHandler(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </button>
                  </li>
                ))}
              {!(+page === pages) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-4 h-4 mt-2 hover:text-gray-300 "
                  onClick={() => pageHandler(+page + 1)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  console.log("query: ", query);

  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const brand = query.brand || "";
  const priceRange = query.priceRange || "";
  const sort = query.sort || "";
  const keyword = query.keyword || "";

  const keywordFilter =
    keyword && keyword !== "all"
      ? {
          name: {
            $regex: keyword,
            $options: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const brandFilter = brand && brand !== "all" ? { brand } : {};
  const priceRangeFilter =
    priceRange && priceRange !== "all"
      ? {
          price: {
            $gte: Number(priceRange.split("-")[0]),
            $lte: Number(priceRange.split("-")[1]),
          },
        }
      : {};

  const sortOrder =
    sort === "featured"
      ? { isFeatured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "topRated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  await db.connect();

  const categories = await Product.find().distinct("category");
  const brands = await Product.find().distinct("brand");

  const productDocs = await Product.find(
    {
      ...keywordFilter,
      ...categoryFilter,
      ...priceRangeFilter,
      ...brandFilter,
    },
    "-reviews"
  )
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const productsCount = await Product.countDocuments({
    ...keywordFilter,
    ...categoryFilter,
    ...priceRangeFilter,
    ...brandFilter,
  });

  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      productsCount,
      page,
      pages: Math.ceil(productsCount / pageSize),
      categories,
      brands,
    },
  };
}
