"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FrameComponent1 from "./frame-component1";
import { Form, Input, Select } from "antd";
import { useFormik } from "formik";
import TextArea from "antd/es/input/TextArea";
import Welcomeframe2 from "./welcomeframe2";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading/Loading";
import useAppContext from "@/hooks/useAppContext";
import sweetAlert from "@/utils/sweetAlert";
import { PATH_AUTH } from "@/routes/paths";
import { useAuthGoogle } from "@/contexts/AuthGoogleContext";

const SignUpInfoScreen = (props: {}) => {
  var router = useRouter();
  const [squareCheckboxSolidChecked, setSquareCheckboxSolidChecked] =
    useState(false);
  const [registerByEmail, setRegisterByEmail] = useState<boolean>(false);
  const [emailRegisterByEmail, setEmailRegisterByEmail] = useState<string>("");
  const [confirmEmailMode, setConfirmEmailMode] = useState<boolean>(false);
  const [fullname, setFullname] = useState<string>("");
  const [confirmEmailSuccesful, setConfirmEmailSuccesful] =
    useState<boolean>(false);
  const formItemLayout = {};
  const [form] = Form.useForm();
  const { login, register, isAuthenticated } = useAuth();
  const { isLoading, disableLoading } = useAppContext();
  const { googleSignIn, user, logOut } = useAuthGoogle();
  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    var registerError = localStorage.getItem("REGISTER_CONFIRMING_ERROR");
    var userJson = localStorage.getItem("REGISTER_CONFIRMING_USER");
    if (registerError != null) {
      localStorage.removeItem("REGISTER_CONFIRMING_ERROR");
      localStorage.removeItem("REGISTER_CONFIRMING_USER");
      sweetAlert.alertFailed(
        "Sign Up Failed",
        `This email has already taken`,
        2500,
        22
      );
    } else if (userJson != null) {
      setConfirmEmailMode(true);
      disableLoading();
      localStorage.removeItem("REGISTER_CONFIRMING_USER");
      let user = JSON.parse(userJson);
      setTimeout(() => {
        if (!isAuthenticated) {
          login(user.email, user.password);
        }
      }, 5000);
      setTimeout(() => {
        if (!isAuthenticated) {
          login(user.email, user.password);
        }
      }, 8000);
      setTimeout(() => {
        if (!isAuthenticated) {
          login(user.email, user.password);
        }
      }, 12000);
    }
  }, [isLoading]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      password: "",
      role: "",
    },

    onSubmit: async (values) => {
      if (squareCheckboxSolidChecked) {
        var role = localStorage.getItem("signuprole") ?? "";
        values.role = role?.toUpperCase();
        await register(
          values.email,
          values.password,
          values.name,
          values.phoneNumber,
          values.role,
          values.address
        );
      } else {
        sweetAlert.alertInfo(
          "",
          "You need to agree the terms & conditions",
          2500,
          20
        );
      }
    },
  });

  useEffect(() => {
    if (user?.email && localStorage.getItem("GOOGLE_AUTH_USING")) {
      setEmailRegisterByEmail(user?.email);
      setRegisterByEmail(true);
      if (user?.displayName) {
        formik.setFieldValue("name", user?.displayName);
        setFullname(user?.displayName);
      }
    } else if (user?.email && !localStorage.getItem("GOOGLE_AUTH_USING")) {
      logOut();
    }
    localStorage.removeItem("GOOGLE_AUTH_USING");
  }, [user]);

  if (!confirmEmailMode) {
    return (
      <div className="text-lightslategray font-barlow mq800:gap-[0px_24px] mq1325:flex-wrap relative flex w-full min-w-full flex-row items-start justify-start gap-[0px_49px] overflow-hidden bg-neutral-white text-left text-base tracking-[normal]">
        <Welcomeframe2 propMargin="0" />
        <div className="mq800:pt-[31px] mq800:box-border mq800:min-w-full mq1325:flex-1 mq1125:pt-12 mq1125:box-border box-border flex w-[632px] min-w-[632px] max-w-full flex-col items-start justify-start px-0 pb-0 pt-[20px]">
          <div className="mq800:flex-wrap mq800:gap-[0px_38px] mq450:gap-[0px_19px] flex max-w-full flex-row items-start justify-start gap-[0px_76px] self-stretch">
            <div className="box-border flex max-w-full flex-1 flex-col items-start justify-start px-0 pb-0 pt-px">
              <div className="mq450:gap-[49px_0px] flex max-w-full flex-col items-start justify-start gap-[25px_0px] self-stretch">
                <div
                  onClick={() => {
                    router.push(PATH_AUTH.signup);
                  }}
                  style={{ transform: "translateY(15px)" }}
                  className="relative mx-9 box-border flex cursor-pointer items-center pr-5 font-semibold"
                >
                  <span
                    className="px-2 pl-0"
                    style={{ transform: "translateY(-2px)" }}
                  >
                    {"<"}
                  </span>
                  {" Back"}
                </div>
                <div className="text-dimgray-300 box-border flex max-w-full flex-row items-start justify-start self-stretch py-0 pl-[33px] pr-0">
                  <div className="flex max-w-full flex-1 flex-col items-end justify-start gap-[10px_0px]">
                    <div className="flex max-w-full flex-col items-start justify-start gap-[16px_0px] self-stretch">
                      <FrameComponent1 registerIndividualAccount="Sign Up Individual Account!" />
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
                            Fullname
                            <span className="text-red">*</span>
                          </span>
                        </p>
                        <Form.Item
                          className="col-sm-12 col-md-7 mx-0 px-0"
                          name="name"
                          label=""
                          rules={[
                            {
                              required: true,
                              message: "Fullname cannot be blank",
                            },
                            {
                              message: "Fullname is not in correct form",
                              pattern:
                                /^(([\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}[\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,})|([\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,1}))$/,
                            },
                          ]}
                          hasFeedback
                          initialValue={registerByEmail ? fullname : ""}
                        >
                          <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            placeholder="Enter fullname"
                          />
                        </Form.Item>
                      </div>

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
                          style={{
                            display: `${registerByEmail ? "none" : ""}`,
                          }}
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
                        <p
                          className="col-sm-12 col-md-7 m-0 mb-4 p-0 ps-0 text-[1rem]"
                          style={{
                            display: `${!registerByEmail ? "none" : ""}`,
                            transform: "translateY(5px)",
                          }}
                        >
                          {emailRegisterByEmail}
                        </p>
                      </div>

                      <div className="row align-items-start justify-content-between">
                        <p className="text-lightslategray relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                          <span>
                            Phone number
                            <span className="text-red">*</span>
                          </span>
                        </p>
                        <Form.Item
                          className="col-sm-12 col-md-7 mx-0 px-0"
                          name="phoneNumber"
                          label=""
                          rules={[
                            {
                              required: true,
                              message: "Phone number cannot be blank",
                            },
                            {
                              message: "Phone number must be 10-11 numbers",
                              pattern: /^([0-9]{10,11})$/,
                            },
                            {
                              message: "Phone number is not correct form",
                              pattern:
                                /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/,
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            style={{ width: "100%" }}
                            name="phoneNumber"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            placeholder="Enter phone number"
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
                            {
                              pattern: /[a-zA-Z]/,
                              message: "Password must have at least one letter",
                            },
                            {
                              pattern: /\d/,
                              message: "Password must have at least one digit",
                            },
                            {
                              pattern: /[^a-zA-Z\d]/,
                              message:
                                "Password must have at least one non-alphanumeric character",
                            },
                            {
                              pattern: /[A-Z]/,
                              message:
                                "Password must have at least one uppercase letter",
                            },
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

                      <div className="row align-items-start justify-content-between">
                        <p className="text-lightslategray relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                          <span>
                            Confirm password
                            <span className="text-red">*</span>
                          </span>
                        </p>
                        <Form.Item
                          className="col-sm-12 col-md-7 mx-0 px-0"
                          name="confirm_password"
                          label=""
                          dependencies={["password"]}
                          rules={[
                            {
                              required: true,
                              message: "Confirm password is required",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  "Confirm password does not match"
                                );
                              },
                            }),
                          ]}
                          hasFeedback
                        >
                          <Input.Password
                            name="confirm_password"
                            type="password"
                            placeholder="Enter password again"
                          />
                        </Form.Item>
                      </div>

                      <div className="row align-items-start justify-content-between">
                        <p className="text-lightslategray relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                          <span>Address</span>
                        </p>
                        <Form.Item
                          className="col-sm-12 col-md-7 mx-0 px-0"
                          name="address"
                          label=""
                          rules={[
                            {
                              required: false,
                            },
                            {
                              pattern: /^(([]{0,0})|([\w]{1,1}[\w\s,]{0,}))$/,
                              message: "Address is not in correct form",
                            },
                          ]}
                          hasFeedback
                        >
                          <TextArea
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            placeholder="Enter address (Optional)"
                          />
                        </Form.Item>
                      </div>

                      <Form.Item className="text-center">
                        <div className="text-dimgray-300 mb-3 flex flex-row items-start justify-start gap-[0rem_0.875rem] py-[0rem] pl-[0rem] pr-[1.25rem] text-[1rem]">
                          <input
                            className="relative m-0 h-[1.25rem] min-h-[1.25rem] w-[1.25rem] shrink-0 cursor-pointer overflow-hidden accent-primary-colour"
                            checked={squareCheckboxSolidChecked}
                            type="checkbox"
                            onChange={(event) =>
                              setSquareCheckboxSolidChecked(
                                event.target.checked
                              )
                            }
                          />
                          <div
                            style={{ transform: "translateY(-3px)" }}
                            className="relative font-medium"
                          >{`I agree to terms & conditions`}</div>
                        </div>
                        <button
                          type="submit"
                          className="hover:bg-blueviolet box-border flex w-full max-w-full flex-1 cursor-pointer flex-row items-start justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary-colour px-5 py-[21px] [border:none]"
                        >
                          <div className="font-barlow relative flex w-full items-center justify-center text-center text-lg font-medium text-neutral-white">
                            Sign Up
                          </div>
                        </button>
                      </Form.Item>
                    </Form>

                    {!registerByEmail ? (
                      <>
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
                              handleGoogleSignUp();
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
                              Sign Up with Google
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    );
  }
  return (
    <>
      <Loading loading={isLoading} />
      <div className="relative flex h-screen w-full flex-row items-start justify-start overflow-hidden bg-neutral-white tracking-[normal]">
        <main className="text-neutral-black font-barlow absolute bottom-[0rem] left-[0rem] right-[0rem] top-[0rem] !m-[0] box-border flex h-full w-full max-w-full flex-row items-center justify-center overflow-hidden bg-[url('/images/shop/SignUpPage/account-frame@3x.png')] bg-cover bg-[top] bg-no-repeat px-[1.25rem] py-[1rem] text-center text-[2.5rem]">
          {!confirmEmailSuccesful ? (
            <div className="rounded-mini mq450:gap-[1.75rem_0rem] box-border flex w-[50rem] max-w-full shrink-0 flex-col items-start justify-start gap-[3.5rem_0rem] overflow-hidden bg-neutral-white pb-[2rem] pl-[1.375rem] pr-[1.313rem] pt-[2.625rem]">
              <div className="flex flex-row items-start justify-center self-stretch">
                <img
                  className="relative h-[8rem] w-[8rem] shrink-0 overflow-hidden"
                  loading="lazy"
                  alt=""
                  src="/images/shop/SignUpPage/2/rimailunreadfill.svg"
                />
              </div>
              <div className="mq750:gap-[1.5rem_0rem] flex max-w-full flex-col items-center justify-start gap-[3rem_0rem] self-stretch">
                <div className="mq750:gap-[1.25rem_0rem] flex flex-col items-center justify-start gap-[2.5rem_0rem] self-stretch">
                  <h2 className="font-inherit mq450:text-[1.5rem] mq450:leading-[0.875rem] mq750:text-[2rem] mq750:leading-[1.188rem] relative m-0 inline-block text-inherit font-semibold leading-[1.5rem]">
                    Verify by Mail
                  </h2>
                  <div className="text-gray-400 mq450:text-[1.188rem] mq450:leading-[1.75rem] relative self-stretch text-[1.5rem] font-medium leading-[2.219rem]">
                    <p className="m-0">
                      Please check your mail and follow the instruction to
                      activate your account. If you did not receive the mail, or
                      it has expired, you can resend another one.
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 flex w-[44.063rem] max-w-full flex-col items-center justify-start gap-[1.5rem_0rem] text-[1.125rem]">
                  <button className="rounded-8xs hover:bg-blueviolet-100 flex cursor-pointer flex-row items-center justify-center self-stretch bg-primary-colour px-[1.25rem] py-[1.563rem] [border:none]">
                    <div className="font-barlow mq450:text-[1.188rem] mq450:leading-[1.188rem] relative inline-block whitespace-pre-wrap text-center text-[1.5rem] font-medium leading-[1.5rem] text-neutral-white">
                      Resend my verification Email
                    </div>
                  </button>
                  <div
                    className="relative inline-block cursor-pointer font-medium"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    {`Come back to `}
                    <span className="text-primary-colour">Home Page</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-mini mq450:gap-[1rem_0rem] mq800:gap-[2rem_0rem] mq800:pl-[1.5rem] mq800:pr-[1.438rem] mq800:box-border box-border flex h-[33.313rem] w-[50rem] max-w-full shrink-0 flex-col items-start justify-start gap-[4.063rem_0rem] overflow-hidden bg-neutral-white py-[4.25rem] pl-[3rem] pr-[2.938rem]">
              <div className="flex flex-row items-start justify-center self-stretch">
                <img
                  className="relative h-[10.25rem] w-[10.25rem] shrink-0 overflow-hidden"
                  loading="lazy"
                  alt=""
                  src="/images/shop/SignUpPage/2/mdisuccesscircle.svg"
                />
              </div>
              <div className="mq800:gap-[1.75rem_0rem] flex flex-col items-start justify-start gap-[3.5rem_0rem] self-stretch">
                <div className="flex flex-row items-start justify-center self-stretch px-[1.25rem] py-[0rem]">
                  <h2 className="font-inherit mq450:text-[1.5rem] mq450:leading-[0.875rem] mq800:text-[2rem] mq800:leading-[1.188rem] relative m-0 inline-block text-inherit font-semibold leading-[1.5rem]">
                    Account created successfully
                  </h2>
                </div>
                <button className="rounded-8xs hover:bg-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch bg-primary-colour px-[1.25rem] py-[1.563rem] [border:none]">
                  <div
                    onClick={() => {
                      router.push("/");
                    }}
                    className="font-barlow mq450:text-[1.188rem] mq450:leading-[1.188rem] relative inline-block text-center text-[1.5rem] font-medium leading-[1.5rem] text-neutral-white"
                  >
                    Click here to continue
                  </div>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SignUpInfoScreen;
