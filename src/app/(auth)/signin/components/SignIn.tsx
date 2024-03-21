"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Select } from "antd";
import { useFormik } from "formik";
import GuestGuard from "@/guards/GuestGuard";
import useAuth from "@/hooks/useAuth";
import Welcomeframe from "../../signup/components/welcomeframe";
import FrameComponentSignin from "./frame-component-signin";
import Loading from "@/components/Loading/Loading";
import useAppContext from "@/hooks/useAppContext";
import { PATH_AUTH } from "@/routes/paths";
import Swal from "sweetalert2";
import authApi from "@/api/auth/auth";
import { useAuthGoogle } from "@/contexts/AuthGoogleContext";

const SignIn = (props: {}) => {
  const router = useRouter();
  const formItemLayout = {};
  const [form] = Form.useForm();
  const { login, loginWithEmail } = useAuth();
  const { isLoading, enableLoading, disableLoading } = useAppContext();
  const { googleSignIn, user, logOut } = useAuthGoogle();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    logOut();
  }, []);

  useEffect(() => {
    if (user?.email && localStorage.getItem("GOOGLE_AUTH_USING")) {
      enableLoading();
      loginWithEmail(user?.email);
    } else if (user?.email && !localStorage.getItem("GOOGLE_AUTH_USING")) {
      logOut();
    }
    localStorage.removeItem("GOOGLE_AUTH_USING");
  }, [user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  const handleForgetPassword = () => {
    Swal.fire({
      title: `Enter your email`,
      html: `Please enter email of your account`,
      input: "email",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false,
    })
      .then(async (result) => {
        if (result.isConfirmed === true) {
          enableLoading();
          var email = result.value;
          authApi
            .sendEmailForgotPassword(email)
            .then((response) => {
              disableLoading();
              if (!response.data.isSuccess) {
                Swal.fire({
                  title: `Sorry`,
                  html: `We have not found any account with email: </br><strong> ${email}. </strong><br/>
                Please check your email and try again later.`,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: true,
                  confirmButtonText: "Confirm",
                  showLoaderOnConfirm: true,
                  allowOutsideClick: false,
                })
                  .then((result) => {})
                  .catch((err) => {});
              } else if (response.data.isSuccess) {
                Swal.fire({
                  title: `Verify your account`,
                  html: `We have sent a verify link to your email: </br><strong> ${email}. </strong><br/>
                Please check your mail and follow the instruction to reset password.`,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: true,
                  confirmButtonText: "Confirm",
                  showLoaderOnConfirm: true,
                  allowOutsideClick: false,
                })
                  .then((result) => {})
                  .catch((err) => {});
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {});
  };

  return (
    <GuestGuard>
      <Loading loading={isLoading} />
      <div className="text-lightslategray font-barlow mq800:gap-[0px_24px] mq1325:flex-wrap relative flex w-full min-w-full flex-row items-start justify-start gap-[0px_49px] overflow-hidden bg-neutral-white text-left text-base tracking-[normal]">
        <Welcomeframe propMargin="0" />
        <div className="mq800:pt-[31px] mq800:box-border mq800:min-w-full mq1325:flex-1 mq1125:pt-12 mq1125:box-border box-border flex w-[632px] min-w-[632px] max-w-full flex-col items-start justify-start px-0 pb-0 pt-[20px]">
          <div className="mq800:flex-wrap mq800:gap-[0px_38px] mq450:gap-[0px_19px] flex max-w-full flex-row items-start justify-start gap-[0px_76px] self-stretch">
            <div className="box-border flex max-w-full flex-1 flex-col items-start justify-start px-0 pb-0 pt-px">
              <div className="mq450:gap-[49px_0px] flex max-w-full flex-col items-start justify-start gap-[5px_0px] self-stretch">
                <div className="flex w-full flex-row items-center justify-end gap-[0px_6px] py-0 pl-5 pr-0">
                  <div
                    className="relative cursor-pointer whitespace-nowrap font-medium leading-[28px]"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    {`Come back to `}
                    <span className="text-primary-colour">Home Page</span>
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-end gap-[0px_6px] py-0 pl-5 pr-0">
                  <div className="relative whitespace-nowrap font-medium leading-[28px]">{`Do not have an account yet? `}</div>
                  <div
                    className="relative cursor-pointer whitespace-nowrap font-medium leading-[28px] text-primary-colour"
                    onClick={() => {
                      router.push(PATH_AUTH.signup);
                    }}
                  >
                    Sign Up
                  </div>
                </div>
                <div className="text-dimgray-300 box-border flex max-w-full flex-row items-start justify-start self-stretch py-0 pl-[33px] pr-0">
                  <div className="flex max-w-full flex-1 flex-col items-end justify-start gap-[10px_0px]">
                    <div className="flex max-w-full flex-col items-start justify-start gap-[16px_0px] self-stretch">
                      <FrameComponentSignin registerIndividualAccount="Sign In With Your Account!" />
                      <div className="border-whitesmoke-100 relative box-border h-px self-stretch border-t-[1px] border-solid" />
                    </div>
                    <Form
                      onFinish={formik.handleSubmit}
                      {...formItemLayout}
                      form={form}
                      size="large"
                      autoComplete="off"
                      className="w-full"
                    >
                      <div className="row align-items-start justify-content-between">
                        <p className="text-lightslategray relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                          <span>
                            Email
                            <span className="text-red">*</span>
                          </span>
                        </p>
                        <Form.Item
                          className="col-sm-12 col-md-7 mx-0 px-0"
                          name="email"
                          label=""
                          rules={[
                            {
                              required: true,
                              message: "Email cannot be blank",
                            },
                            {
                              type: "email",
                              message: "Email is not in correct form",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            id="input_email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder="Enter email"
                          />
                        </Form.Item>
                      </div>

                      <div className="row align-items-start justify-content-between">
                        <p className="text-lightslategray relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                          <span>
                            Password
                            <span className="text-red">*</span>
                          </span>
                        </p>
                        <Form.Item
                          className="col-sm-12 col-md-7 mx-0 px-0"
                          name="password"
                          label=""
                          rules={[
                            {
                              required: true,
                              message: "Password cannot be blank",
                            },
                            {
                              min: 6,
                              message: "Password is at least 6 characters",
                            },
                            // {
                            //   pattern: /[a-zA-Z]/,
                            //   message: "Password must have at least one letter",
                            // },
                            // {
                            //   pattern: /\d/,
                            //   message: "Password must have at least one digit",
                            // },
                            // {
                            //   pattern: /[^a-zA-Z\d]/,
                            //   message:
                            //     "Password must have at least one non-alphanumeric character",
                            // },
                            // {
                            //   pattern: /[A-Z]/,
                            //   message:
                            //     "Password must have at least one uppercase letter",
                            // },
                          ]}
                          hasFeedback
                        >
                          <Input.Password
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            placeholder="Enter password"
                          />
                        </Form.Item>{" "}
                      </div>

                      <Form.Item className="text-center">
                        <div>
                          <p
                            className="cursor-pointer text-end text-blue-500"
                            style={{ fontWeight: "bolder" }}
                            onClick={() => {
                              handleForgetPassword();
                            }}
                          >
                            Forget Password?
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="hover:bg-blueviolet mt-3 box-border flex w-full max-w-full flex-1 cursor-pointer flex-row items-start justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary-colour px-5 py-[21px] [border:none]"
                        >
                          <div className="font-barlow relative mt-0 flex w-full items-center justify-center text-center text-lg font-medium text-neutral-white">
                            Sign In
                          </div>
                        </button>
                      </Form.Item>
                    </Form>
                    <div className="text-silver-200 mq450:flex-wrap mq450:gap-[0px_17px] flex flex-row items-end justify-center gap-[0px_35px] self-stretch text-center text-xs">
                      <div className="box-border flex h-1.5 min-w-[112px] flex-1 flex-col items-start justify-start px-0 pb-1.5 pt-0">
                        <div className="border-whitesmoke-100 relative box-border h-px self-stretch border-t-[1px] border-solid" />
                      </div>
                      <div className="mq450:w-full mq450:h-3 relative flex w-3 items-center justify-center">
                        Or
                      </div>
                      <div className="box-border flex h-1.5 min-w-[112px] flex-1 flex-col items-start justify-start px-0 pb-1.5 pt-0">
                        <div className="border-whitesmoke-100 relative box-border h-px self-stretch border-t-[1px] border-solid" />
                      </div>
                    </div>
                    <div className="text-neutral-black mq450:gap-[0rem_2.313rem] mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border box-border flex w-full max-w-full cursor-pointer flex-row items-center justify-center gap-[0rem_1rem] self-stretch rounded-md bg-neutral-white px-[2.688rem] pb-[1.188rem] pt-[1.313rem] text-center shadow-[0px_4px_10px_rgba(0,_0,_0,_0.08)]">
                      <div className="relative hidden h-[4rem] w-[26.625rem] max-w-full rounded-md bg-neutral-white shadow-[0px_4px_10px_rgba(0,_0,_0,_0.08)]" />

                      <div
                        onClick={() => {
                          localStorage.setItem("GOOGLE_AUTH_USING", "true");
                          handleGoogleSignIn();
                        }}
                        className="cursor-pointer box-border flex flex-row items-center justify-center px-[0rem] pb-[0rem] pt-[0.125rem]"
                      >
                        <img
                          className="relative z-[1] h-[1.5rem] min-h-[1.5rem] w-[1.5rem] shrink-0 overflow-hidden"
                          loading="lazy"
                          alt=""
                          src="/images/shop/SignUpPage/2/flatcoloriconsgoogle.svg"
                        />
                        <div className="relative z-[1] w-full self-stretch pl-5 font-medium">
                          Sign In with Google
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
};

export default SignIn;
