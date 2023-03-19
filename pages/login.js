import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { catchError } from "../utils/error";

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query;

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
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
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-sm"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-12 text-3xl font-bold">LOGIN</h1>
        <div className="mb-6">
          <label htmlFor="email">Email Address</label>
          <input
            className="w-full"
            id="email"
            type="email"
            placeholder="Your email address..."
            autoFocus
            {...register("email", {
              required: "Please enter your email",
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
        <div className="mb-10">
          <label htmlFor="password">Password</label>
          <input
            className="w-full"
            id="password"
            type="password"
            placeholder="Your password..."
            {...register("password", {
              required: "Please enter your password",
              minLength: {
                value: 6,
                message: "Password is at least 6 characters",
              },
            })}
          ></input>
          {errors.password && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.password.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Log in</button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          <Link
            href={`/register?redirect=${redirect || "/"}`}
            className="border-b-2"
          >
            Please sign up
          </Link>
        </div>
      </form>
    </Layout>
  );
}
