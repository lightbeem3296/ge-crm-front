"use client"

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { fetchCurrentUser } from "@/services/authService";
import { AuthResponse, AuthResult } from "@/types/auth";
import { faEye, faEyeSlash, faMobile, faMobilePhone, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authType, setAuthType] = useState<string>("password");
  const [otpCode, setOtpCode] = useState<string>("");
  const [isOtpValid, setIsOtpValid] = useState<boolean | undefined>(undefined);
  const [smsCode, setSmsCode] = useState<string>("");
  const [isSmsValid, setIsSmsValid] = useState<boolean | undefined>(undefined);


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const verifyOTP = async (value: string | undefined = undefined) => {
    value = value || otpCode;
    setLoading(true);
    try {
      const response = await axios.post<AuthResponse>("/api/auth/login/otp", {
        username: watch("username"),
        password: watch("password"),
        otp_code: value,
      });
      switch (response.data.result) {
        case AuthResult.success:
          if (response.data.token) {
            localStorage.setItem("accessToken", response.data.token.access_token);
            setIsOtpValid(true);
            router.push("/main");
          } else {
            customAlert({
              type: CustomAlertType.ERROR,
              title: "Error",
              message: "Failed to fetch access token.",
            });
          }
          break;
        default:
          router.push("/auth/login");
      }
    } catch {
      customAlert({
        type: CustomAlertType.ERROR,
        message: "OTP Verificatoin Failed",
      });
      setIsOtpValid(false);
    } finally {
      setLoading(false);
    }
  }

  const handleChangeOTPCode = async (value: string) => {
    setOtpCode(value);
    setIsOtpValid(undefined);
    if (value.length === 6) {
      await verifyOTP(value);
    }
  }

  const verifySMS = async (value: string | undefined = undefined) => {
    value = value || smsCode;
    setLoading(true);
    try {
      const response = await axios.post<AuthResponse>("/api/auth/login/sms", {
        username: watch("username"),
        password: watch("password"),
        sms_code: value,
      });
      switch (response.data.result) {
        case AuthResult.success:
          if (response.data.token) {
            localStorage.setItem("accessToken", response.data.token.access_token);
            setIsSmsValid(true);
            router.push("/main");
          } else {
            customAlert({
              type: CustomAlertType.ERROR,
              title: "Error",
              message: "Failed to fetch access token.",
            });
          }
          break;
        default:
          router.push("/auth/login");
      }
    } catch {
      customAlert({
        type: CustomAlertType.ERROR,
        message: "SMS Verificatoin Failed",
      });
      setIsSmsValid(false);
    } finally {
      setLoading(false);
    }
  }

  const handleChangeSmsCode = async (value: string) => {
    setSmsCode(value);
    setIsSmsValid(undefined);
    if (value.length === 6) {
      await verifySMS(value);
    }
  }

  const handleClickResendSMS = async () => {
    setLoading(true);
    try {
      await axios.post<AuthResponse>("/api/auth/login/sms/resend", {
        username: watch("username"),
        password: watch("password"),
      });
      customAlert({
        type: CustomAlertType.INFO,
        message: "SMS has been sent again",
      });
    } catch {
      customAlert({
        type: CustomAlertType.ERROR,
        message: "SMS Verificatoin Failed",
      });
      setIsSmsValid(false);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await axios.post<AuthResponse>("/api/auth/login/password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("result:", response);
      switch (response.data.result) {
        case AuthResult.success:
          if (response.data.token) {
            localStorage.setItem("accessToken", response.data.token.access_token);
            router.push("/main");
          } else {
            customAlert({
              type: CustomAlertType.ERROR,
              title: "Error",
              message: "Failed to fetch access token.",
            });
          }
          break;
        case AuthResult.otp:
          setAuthType("otp");
          break;
        case AuthResult.sms:
          setAuthType("sms");
          break;
        default:
          router.push("/auth/login");
      }
    } catch (error: any) { // eslint-disable-line
      customAlert({
        type: CustomAlertType.ERROR,
        title: "Login failed",
        message: error.response?.data.detail || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    if (await fetchCurrentUser()) {
      router.push("/main");
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <>
      {
        authType === "password"
          ? <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-w-96 mx-auto border border-base-content/20 px-8 py-16 rounded-md mt-20"
          >
            <div className="flex justify-center mb-8">
              <span className="font-sans font-medium text-xl">
                Login to Dashboard
              </span>
            </div>

            {/* Username field */}
            <div className="flex flex-col">
              <label className={`input input-bordered flex items-center gap-2 ${loading ? "input-disabled" : ""}`}>
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
                  disabled={loading}
                  {...register("username", { required: "Username is required" })}
                />
              </label>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col">
              <label className={`input input-bordered flex items-center gap-2 ${loading ? "input-disabled" : ""}`}>
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
                  disabled={loading}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className={!watch("password") ? "hidden" : ""}
                  onClick={() => handleClickShowPassword()}
                  tabIndex={-1}
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
              disabled={loading}
            >
              {loading
                ? <span className="loading loading-spinner loading-xs"></span>
                : null}
              Login
            </button>
            <div className="flex gap-2">
              <span>
                Don&apos;t have account?
              </span>
              <Link
                href="/auth/register"
                className="link"
              >
                Go to register
              </Link>
            </div>
          </form>
          : authType === "otp"
            ? <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 max-w-80 mx-auto border border-base-content/20 px-8 py-16 rounded-md mt-20"
            >
              <div className="mx-auto text-xl text-base-content/80">
                <FontAwesomeIcon icon={faMobilePhone} />
              </div>
              <div className="mx-auto text-lg font-medium">
                TOTP Authentication
              </div>
              <div className="mx-auto font-medium">
                - {watch("username")} -
              </div>
              {/* OTP Code field */}
              <div className="flex flex-col">
                <label className={`input input-sm input-bordered flex items-center gap-2
                 ${loading
                    ? "input-disabled"
                    : ""
                  }
                    ${isOtpValid === true
                    ? "input-success"
                    : isOtpValid === false
                      ? "input-error"
                      : null}`}
                >
                  <input
                    type="text"
                    className={`grow `}
                    placeholder="XXXXXX"
                    disabled={loading}
                    value={otpCode}
                    onChange={(e) => handleChangeOTPCode(e.target.value)}
                  />
                </label>
              </div>
              <button
                className={`btn btn-sm btn-primary 
                  ${loading
                    ? "btn-disabled"
                    : null
                  }`}
                onClick={() => verifyOTP()}
              >
                {loading ? "Verifying ..." : "Verify"}
              </button>
              <div className="text-sm">
                Open your two-factor authenticator (TOTP) app or browser extension to view your authentication code.
              </div>
            </form>
            : authType === "sms"
              ? <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 max-w-80 mx-auto border border-base-content/20 px-8 py-16 rounded-md mt-20"
              >
                <div className="mx-auto text-xl text-base-content/80">
                  <FontAwesomeIcon icon={faMobilePhone} />
                </div>
                <div className="mx-auto text-lg font-medium">
                  SMS Authentication
                </div>
                <div className="mx-auto font-medium">
                  - {watch("username")} -
                </div>
                {/* SMS Code field */}
                <div className="flex flex-col">
                  <label className={`input input-sm input-bordered flex items-center gap-2
                 ${loading
                      ? "input-disabled"
                      : ""
                    }
                    ${isSmsValid === true
                      ? "input-success"
                      : isSmsValid === false
                        ? "input-error"
                        : null}`}>
                    <input
                      type="text"
                      className={`grow `}
                      placeholder="XXXXXX"
                      disabled={loading}
                      value={smsCode}
                      onChange={(e) => handleChangeSmsCode(e.target.value)}
                    />
                  </label>
                </div>
                <button
                  className={`btn btn-sm btn-primary 
                  ${loading
                      ? "btn-disabled"
                      : null
                    }`}
                  onClick={() => verifySMS()}
                >
                  {loading ? "Verifying ..." : "Verify"}
                </button>
                <div className="text-sm">
                  You will get OTP via SMS.<br />
                  Didn't receive authentication code?<br />
                  <button
                    className="link-info"
                    onClick={() => handleClickResendSMS()}
                  >
                    Resend SMS
                  </button>
                </div>
              </form>
              : null
      }
    </>
  )
}
