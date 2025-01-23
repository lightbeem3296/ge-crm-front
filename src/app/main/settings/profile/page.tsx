"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { axiosHelper } from "@/lib/axios";
import { loadCurrentUser } from "@/services/authService";
import { ApiGeneralResponse } from "@/types/api";
import { ChangePasswordRequest, ChangePhoneNumberRequest, EnableOTPRequest, GenerateOTPResponse, TfaType, userRoleFieldMap, VerifyOTPRequest, VerifySMSRequest } from "@/types/auth";
import { lookupValue } from "@/utils/record";
import { faCheck, faEye, faEyeSlash, faMultiply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQRCode } from "next-qrcode";

export default function LogoutPage() {
  const currentUser = loadCurrentUser();
  // Password
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // Phone number
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(currentUser?.phone_number || "");
  // 2FA
  const [tfaType, setTfaType] = useState<TfaType | undefined>(currentUser?.tfa_type);
  // OTP
  const [otpSecret, setOtpSecret] = useState<string | undefined>(currentUser?.otp_secret);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isOtpValid, setIsOtpValid] = useState<boolean | undefined>();
  const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);
  const { Image } = useQRCode();
  // SMS
  const [smsCode, setSmsCode] = useState<string>("");
  const [isSmsCodeValid, setIsSmsCodeValid] = useState<boolean | undefined>(undefined);
  const [isSmsCodeVerifying, setIsSmsCodeVerifying] = useState<boolean>(false);
  const [isSmsCodeSending, setIsSmsCodeSending] = useState<boolean>(false);

  // Password
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
  // Phone number
  const handleChangePhoneNumber = (value: string) => {
    setPhoneNumber(value);
  }
  const handleClickPhoneNumberSave = async () => {
    if (!phoneNumber) {
      customAlert({
        type: CustomAlertType.ERROR,
        title: "Error",
        message: "Phone number is empty",
      });
      return;
    }
    const response = await axiosHelper.post<ChangePhoneNumberRequest, ApiGeneralResponse>("/auth/change-phone-number", {
      phone_number: phoneNumber
    });
    if (response) {
      customAlert({
        type: CustomAlertType.SUCCESS,
        message: response.message,
      });
    }
  }
  // 2FA
  const handle2faTypeChanged = async (str_value: string) => {
    const value = str_value === ""
      ? undefined
      : str_value as TfaType

    setTfaType(value);

    switch (value) {
      case TfaType.otp:
        // Generate OTP
        try {
          const response = await axiosHelper.get<GenerateOTPResponse>("/auth/otp/generate");
          if (response) {
            console.log(response);
            setOtpSecret(response.otp_secret);
          }
        } catch (err) {
          console.error(err);
        }
        break;

      case TfaType.sms:
        break;

      default:
    }
  }
  const handleClickSave2FASettings = async () => {
    switch (tfaType) {
      case TfaType.otp:
        if (otpSecret) {
          try {
            const response = await axiosHelper.post<EnableOTPRequest, ApiGeneralResponse>("/auth/otp/enable", {
              otp_secret: otpSecret,
            });
            if (response) {
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
          console.error("otpSecret is undefined");
        }
        break;
      case TfaType.sms:
        try {
          const response = await axiosHelper.get<ApiGeneralResponse>("/auth/sms/enable");
          if (response) {
            customAlert({
              type: CustomAlertType.SUCCESS,
              title: "Success",
              message: "SMS is enabled",
            });
          } else {
            customAlert({
              type: CustomAlertType.ERROR,
              title: "Error",
              message: "Failed to enable SMS",
            });
          }
        } catch (err) {
          console.error(err);
        }
        break;
      default:
        const response = await axiosHelper.get("/auth/2fa/disable");
        if (response) {
          customAlert({
            type: CustomAlertType.SUCCESS,
            title: "Success",
            message: "2FA login is disabled",
          });
        } else {
          customAlert({
            type: CustomAlertType.ERROR,
            title: "Error",
            message: "Failed to disable 2FA login",
          });
        };
    }
  }
  // OTP
  const handleChangeOtp = async (val: string) => {
    setOtpCode(val);
    setIsOtpValid(undefined);

    if (otpSecret) {
      if (val.length === 6) {
        try {
          setIsOtpVerifying(true);
          const response = await axiosHelper.post<VerifyOTPRequest, ApiGeneralResponse>("/auth/otp/verify", {
            otp_secret: otpSecret,
            otp_code: val,
          });
          if (response) {
            setIsOtpValid(true);
          } else {
            setIsOtpValid(false);
          }
        } finally {
          setIsOtpVerifying(false);
        }
      }
    }
  }
  // SMS
  const handleChangeSmsCode = async (val: string) => {
    setSmsCode(val);
    setIsSmsCodeValid(undefined);

    if (val.length === 6) {
      try {
        setIsSmsCodeVerifying(true);
        const response = await axiosHelper.post<VerifySMSRequest, ApiGeneralResponse>("/auth/sms/verify", {
          sms_code: val,
        });
        if (response) {
          setIsSmsCodeValid(true);
        } else {
          setIsSmsCodeValid(false);
        }
      } finally {
        setIsSmsCodeVerifying(false);
      }
    }
  }
  const handleResendSmsCodeClick = async () => {
    try {
      setIsSmsCodeSending(true);
      const response = await axiosHelper.get<GenerateOTPResponse>("/auth/sms/send");
      if (response) {
        console.log(response);
      }
    } finally {
      setIsSmsCodeSending(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content">
          Profile
        </p>
      </div>
      <div className="p-4 min-h-[calc(100vh-10.1rem)]">
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
                className="btn btn-sm btn-primary w-20"
                onClick={() => handleClickPasswordSubmit()}
              >
                Change
              </button>
            </div>
          </div>
          {/* Phone number */}
          <div className="col-span-1 font-medium">Phone number</div>
          <div className="col-span-2 ml-2">
            <div className="flex gap-2">
              <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                <input
                  type="text"
                  className="grow"
                  value={phoneNumber}
                  placeholder="Phone number"
                  onChange={(e) => handleChangePhoneNumber(e.target.value)}
                />
              </label>
              <button
                className="btn btn-sm btn-primary w-20"
                onClick={() => handleClickPhoneNumberSave()}
              >
                Save
              </button>
            </div>
          </div>

          {/* 2FA */}
          <div className="col-span-1 font-medium">2FA</div>
          <div className="col-span-2 ml-2 flex gap-2">
            <select className="select select-bordered select-sm w-60"
              value={tfaType || ""}
              onChange={(e) => handle2faTypeChanged(e.target.value)}
            >
              <option value={""}>Not Enabled</option>
              <option value={TfaType.otp}>OTP</option>
              <option value={TfaType.sms}>SMS</option>
            </select>
            <div className="flex">
              <button
                className="btn btn-sm btn-primary w-20"
                onClick={() => handleClickSave2FASettings()}
              >
                Save
              </button>
            </div>
          </div>

          <div className="col-start-2 col-span-2 ml-2 flex flex-col gap-4">

            {/* OTP */}
            <div className={`flex flex-col gap-4
              ${tfaType === TfaType.otp ? "" : "hidden"}`}>
              <div>
                <p className="font-medium">Scan the QR Code</p>
                <div className="w-60 pt-3">
                  <Image
                    text={`otpauth://totp/MyApp:${currentUser?.username}?secret=${otpSecret}&issuer=Danløn`}
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
              <div className={`${otpSecret ? "" : "hidden"}`}>
                <p className="font-medium">Save this secret</p>
                <p> {otpSecret}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="col-span-1 font-medium">Verify OTP Code</div>
                <div className="col-span-2">
                  <div className="flex gap-2">
                    <label className="input input-sm input-bordered flex items-center gap-2">
                      <input
                        type="text"
                        className="grow"
                        value={otpCode}
                        placeholder="OTP Code"
                        disabled={isOtpVerifying}
                        onChange={(e) => handleChangeOtp(e.target.value)}
                      />
                    </label>
                    <div className="flex items-center">
                      {isOtpVerifying
                        ? <span className="loading loading-spinner loading-xs"></span>
                        : isOtpValid === true
                          ? <FontAwesomeIcon icon={faCheck} width={16} className="text-success" />
                          : isOtpValid === false
                            ? <FontAwesomeIcon icon={faMultiply} width={16} className="text-error" />
                            : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SMS */}
            <div className={`flex flex-col gap-4
              ${tfaType === TfaType.sms ? "" : "hidden"}`}>
              <div className="flex flex-col gap-2">
                <div className="col-span-1 font-medium">Verify SMS Code</div>
                <div className="col-span-2 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                      <input
                        type="text"
                        className="grow"
                        value={smsCode}
                        placeholder="SMS Code"
                        disabled={isSmsCodeVerifying}
                        onChange={(e) => handleChangeSmsCode(e.target.value)}
                      />
                    </label>
                    <div className="flex items-center">
                      {isSmsCodeVerifying
                        ? <span className="loading loading-spinner loading-xs"></span>
                        : isSmsCodeValid === true
                          ? <FontAwesomeIcon icon={faCheck} width={16} className="text-success" />
                          : isSmsCodeValid === false
                            ? <FontAwesomeIcon icon={faMultiply} width={16} className="text-error" />
                            : null}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-info w-60"
                    onClick={() => handleResendSmsCodeClick()}
                    disabled={isSmsCodeSending}
                  >
                    Resend SMS Code
                    {isSmsCodeSending
                      ? <span className="loading loading-spinner loading-xs"></span>
                      : null
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
