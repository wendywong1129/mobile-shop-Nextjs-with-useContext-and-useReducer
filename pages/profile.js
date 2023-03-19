import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { catchError } from "../utils/error";

export default function ProfilePage() {
  const { data: session } = useSession();

  useEffect(() => {
    setValue("name", session.user.name);
    setValue("email", session.user.email);
  }, [session.user]); // eslint-disable-line

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/updateProfile", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("Profile updated successfully");
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(catchError(err));
    }
  };

  return (
    <Layout title="Profile">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>
        <div className="mb-6 bg-transparent">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="w-full"
            type="text"
            autoFocus
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
        <div className="mb-6 bg-transparent">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="w-full"
            type="email"
            autoFocus
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="mb-6 bg-transparent">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="w-full"
            type="password"
            autoFocus
            {...register("password", {
              minLength: {
                value: 6,
                message: "password is at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <div className="mt-1 text-pink-600 font-semibold">
              {errors.password.message}
            </div>
          )}
        </div>
        <div className="mb-10 bg-transparent">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            id="confirmPassword"
            type="password"
            autoFocus
            {...register("confirmPassword", {
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Confirm password is at least 6 characters",
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
          <button className="primary-button">Update Profile</button>
        </div>
      </form>
    </Layout>
  );
}

ProfilePage.auth = true;
