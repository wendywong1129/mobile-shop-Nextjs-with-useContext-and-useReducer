import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
// import data from "../utils/data";
import { Store } from "../utils/store";
import db from "../utils/db";
import Product from "../models/Product";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Home({ products, featuredProducts }) {
  // const { products } = data;

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

  return (
    <Layout title="Homepage">
      <Carousel
        autoPlay
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
      >
        {featuredProducts.map((featuredProduct) => (
          <div key={featuredProduct._id}>
            <Link href={`/product/${featuredProduct.slug}`} className="flex">
              <div className="h-96">
                <Image
                  src={featuredProduct.banner}
                  alt={featuredProduct.name}
                  fill
                  style={{ objectFit: "contain" }}
                  priority={true}
                />
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
      <h2 className="mb-12 text-3xl font-bold">Latest Products</h2>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            key={product.slug}
            product={product}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();

  // const products = await Product.find().lean();
  const products = await Product.find({}, "-reviews").lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();

  return {
    props: {
      // products: products.map((product) => db.convertDocToObj(product)),
      products: products.map(db.convertDocToObj),
      // featuredProducts: featuredProducts.map((featuredProduct) => db.convertDocToObj(featuredProduct)),
      featuredProducts: featuredProducts.map(db.convertDocToObj),
    },
  };
}




