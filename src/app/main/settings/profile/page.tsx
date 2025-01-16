"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { axiosHelper } from "@/lib/axios";
import { loadCurrentUser } from "@/services/authService";
import { ApiGeneralResponse } from "@/types/api";
import { ChangePasswordRequest, TfaType, userRoleFieldMap, VerifyOTPRequest } from "@/types/auth";
import { lookupValue } from "@/utils/record";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQRCode } from "next-qrcode";

export default function LogoutPage() {
  const currentUser = loadCurrentUser();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isOtp, setIsOTP] = useState<boolean | undefined>(currentUser?.tfa_type === TfaType.otp);
  const [totpSecret, setTotpSecret] = useState<string | undefined>(currentUser?.totp_secret);
  const [totp, setTotp] = useState<string>("");
  const { Image } = useQRCode();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }
  const handleChangePassword = (val: string) => {
    setPassword(val);
  }
  const handleClickPasswordSubmit = async () => {
    if (!password) {
      customAlert({
        type: CustomAlertType.ERROR,
        title: "Error",
        message: "Password is empty",
      });
      return;
    }
    const response = await axiosHelper.post<ChangePasswordRequest, ApiGeneralResponse>("/auth/change-password", {
      password: password
    });
    if (response) {
      customAlert({
        type: CustomAlertType.SUCCESS,
        message: response.message,
      });
    }
  }
  const handleChangeTotp = (val: string) => {
    setTotp(val);
  }
  const handleClickVerifyTotp = async () => {
    const response = await axiosHelper.post<VerifyOTPRequest, ApiGeneralResponse>("/auth/verify-otp", {
      otp: totp,
    });
    if (response) {
      customAlert({
        type: CustomAlertType.SUCCESS,
        title: "Success",
        message: response.message,
      });
    }
  }
  const handleToggleOTP = async (checked: boolean) => {
    if (checked) {
      // Enable OTP
      setIsOTP(true);

      try {
        const response = await axiosHelper.get<ApiGeneralResponse>("/auth/enable-otp");
        if (response) {
          const totpSecret = response.detail.totp_secret;
          setTotpSecret(totpSecret);
          customAlert({
            type: CustomAlertType.SUCCESS,
            title: "Success",
            message: "OTP is enabled",
          });
        } else {
          customAlert({
            type: CustomAlertType.ERROR,
            title: "Error",
            message: "Failed to enable OTP",
          });
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Disable OTP
      setIsOTP(false);
      try {
        const response = await axiosHelper.get<ApiGeneralResponse>("/auth/disable-otp");
        if (response) {
          customAlert({
            type: CustomAlertType.SUCCESS,
            title: "Success",
            message: "OTP is disabled",
          });
        } else {
          customAlert({
            type: CustomAlertType.ERROR,
            title: "Error",
            message: "Failed to enable OTP",
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content">
          Profile
        </p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-screen-sm">
          {/* Username */}
          <div className="col-span-1 font-medium">Username</div>
          <div className="col-span-2 ml-2">{currentUser?.username}</div>
          {/* Role */}
          <div className="col-span-1 font-medium">Role</div>
          <div className="col-span-2 ml-2">{lookupValue(userRoleFieldMap, currentUser?.role)}</div>
          {/* Password */}
          <div className="col-span-1 font-medium">Password</div>
          <div className="col-span-2 ml-2">
            <div className="flex gap-2">
              <label className="input input-sm input-bordered flex items-center gap-2 w-60">
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
                  className="grow"
                  value={password}
                  placeholder="******"
                  onChange={(e) => handleChangePassword(e.target.value)}
                />
                <button
                  type="button"
                  className={!password ? "hidden" : ""}
                  onClick={() => handleClickShowPassword()}
                >
                  {showPassword
                    ? <FontAwesomeIcon icon={faEyeSlash} width={12} />
                    : <FontAwesomeIcon icon={faEye} width={12} />}
                </button>
              </label>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleClickPasswordSubmit()}
              >
                Submit
              </button>
            </div>
          </div>
          {/* OTP */}
          <div className="col-span-1 font-medium">OTP</div>
          <div className="col-span-2 ml-2 flex flex-col gap-4">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isOtp}
              onChange={(e) => handleToggleOTP(e.target.checked)}
            />
            <div className={`${isOtp ? "" : "hidden"} flex flex-col gap-4`}>
              <div>
                <p className="font-medium">Scan the QR Code</p>
                <div className="w-60">
                  <Image
                    text={`otpauth://totp/MyApp:${currentUser?.username}?secret=${totpSecret}&issuer=Danløn`}
                    options={{
                      type: 'image/jpeg',
                      quality: 0.5,
                      errorCorrectionLevel: 'M',
                      margin: 2,
                      scale: 4,
                      width: 200,
                    }}
                  />
                </div>
              </div>
              <div className={`${totpSecret ? "" : "hidden"}`}>
                <p className="font-medium">Save this secret</p>
                <p> {totpSecret}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="col-span-1 font-medium">Verify OTP Code</div>
                <div className="col-span-2">
                  <div className="flex gap-2">
                    <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                      <input
                        type="text"
                        className="grow"
                        value={totp}
                        placeholder="OTP Code"
                        onChange={(e) => handleChangeTotp(e.target.value)}
                      />
                    </label>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleClickVerifyTotp()}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
