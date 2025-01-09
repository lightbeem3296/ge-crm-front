"use client"

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { useForm } from "react-hook-form";

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  // UI Handlers
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      localStorage.setItem("access_token", response.data.access_token);
      router.push("/dashboard/data/employee");
    } catch (error: any) {
      customAlert({
        type: CustomAlertType.ERROR,
        title: "Login failed",
        message: error.response?.data.detail || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-96 mx-auto border px-8 py-16 rounded-md mt-20"
    >
      <div className="flex justify-center mb-8">
        <span className="font-sans font-medium text-xl">
          Login to Dashboard
        </span>
      </div>

      {/* Username field */}
      <div className="flex flex-col">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            id="username"
            className="grow"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
          />
        </label>
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      {/* Password field */}
      <div className="flex flex-col">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="grow"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          <button
            type="button"
            className={!watch("password") ? "hidden" : ""}
            onClick={() => handleClickShowPassword()}
          >
            {showPassword
              ? <FontAwesomeIcon icon={faEyeSlash} width={12} />
              : <FontAwesomeIcon icon={faEye} width={12} />}
          </button>
        </label>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-info"
      >
        Login
      </button>
      <div className="flex gap-2">
        <span>
          Don't have account?
        </span>
        <Link
          href="/auth/register"
          className="link"
        >
          Go to register
        </Link>
      </div>
    </form>
  )
}
