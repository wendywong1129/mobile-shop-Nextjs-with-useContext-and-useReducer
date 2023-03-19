// import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import Rating from "./Rating";
// import { Store } from "../utils/store";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <div className="h-60 relative">
          <Image
            className="rounded-xl"
            src={product.image}
            alt={product.name}
            fill
            sizes={"60 60"}
            style={{ objectFit: "cover" }}
            priority={true}
          />
        </div>
      </Link>
      <div className="p-6 flex flex-col justify-center items-center ">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg border-b-2">{product.name}</h2>
        </Link>
        <p className="my-2 text-white">{product.brand}</p>
        <Rating value={product.rating} />
        <p className="my-2 text-white">${product.price}</p>
        <button
          className="my-2 primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
