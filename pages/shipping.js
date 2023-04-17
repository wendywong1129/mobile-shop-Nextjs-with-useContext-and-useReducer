import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../utils/store";

export default function ShippingPage() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingInfo } = cart;
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("fullName", shippingInfo.fullName);
    setValue("address", shippingInfo.address);
    setValue("city", shippingInfo.city);
    setValue("postalCode", shippingInfo.postalCode);
    setValue("country", shippingInfo.country);
  }, [setValue, shippingInfo]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });

    router.push("/payment");
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutSteps activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-8 text-3xl font-bold">Shipping Address</h1>
        <div className="mb-6">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.fullName.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="address">Address</label>
          <input
            className="w-full"
            id="address"
            {...register("address", {
              required: "Please enter your address",
            })}
          />
          {errors.address && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.address.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="city">City</label>
          <input
            className="w-full"
            id="city"
            {...register("city", {
              required: "Please enter your city",
            })}
          />
          {errors.city && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.city.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            {...register("postalCode", {
              required: "Please enter postal code",
            })}
          />
          {errors.postalCode && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.postalCode.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.country.message}
            </div>
          )}
        </div>
        <div className="mb-6 flex justify-end">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingPage.auth = true;
