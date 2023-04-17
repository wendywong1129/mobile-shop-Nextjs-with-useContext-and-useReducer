import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { catchError } from "../utils/error";

export default function RegisterPage() {
  const router = useRouter();
  const { redirect } = router.query;

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [session, router, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(catchError(err));
    }
  };

  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-12 text-3xl font-bold">REGISTER</h1>
        <div className="mb-6">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your name..."
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Your email address..."
            className="w-full"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          ></input>
          {errors.email && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your password..."
            className="w-full"
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "password is at least 6 characters",
              },
            })}
          ></input>
          {errors.password && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.password.message}
            </div>
          )}
        </div>
        <div className="mb-10">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password..."
            className="w-full"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is at least 6 characters",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="mt-1 text-pink-600 font-semibold">
                Passwords do not match
              </div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Sign up</button>
        </div>
        <div className="mb-4">
          Already have an account?&nbsp;
          <Link
            href={`/login?redirect=${redirect || "/"}`}
            className="border-b-2"
          >
            Please log in
          </Link>
        </div>
      </form>
    </Layout>
  );
}
