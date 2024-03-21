"use client";
import authApi from "@/api/auth/auth";
import Loading from "@/components/Loading/Loading";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { PATH_AUTH, PATH_SHOP } from "@/routes/paths";
import { getUserInfo, getUserInfoId } from "@/utils/utils";
import { Form, Input } from "antd";
import { useFormik } from "formik";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const email = params.email as string;
  const code = params.code as string;
  const { isLoading, enableLoading, disableLoading } = useAppContext();
  const [form] = Form.useForm();
  const { loginWithEmail } = useAuth();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
    },
    onSubmit: (values) => {
      enableLoading();
      authApi
        .changePasswordWithoutOldPass(email, values.password, code)
        .then((response) => {
          if (response.data.isSuccess) {
            disableLoading();
            if (!getUserInfo()) {
              Swal.fire({
                icon: "success",
                title: `Reset Password Successfully`,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: "Click here to sign in now",
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
              })
                .then((result) => {
                  router.push(PATH_AUTH.signin);
                })
                .catch((err) => {});
            } else {
              Swal.fire({
                icon: "success",
                title: `Reset Password Successfully`,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: "Click here to continue",
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
              })
                .then((result) => {
                  router.push(PATH_SHOP.profile(getUserInfoId()));
                })
                .catch((err) => {});
            }
          }
          disableLoading();
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
          disableLoading();
        });
    },
  });

  return (
    <>
      <section className="w-screen h-screen">
        <Loading loading={isLoading} />
        <div
          className="h-full flex flex-row justify-center items-center"
          style={{ width: "50vw", margin: "0 auto" }}
        >
          <Form
            onFinish={formik.handleSubmit}
            form={form}
            size="large"
            autoComplete="off"
            className="w-full"
          >
            <h1
              className="text-center mb-5"
              style={{ fontSize: "3rem", fontWeight: "bolder" }}
            >
              Reset Your Password
            </h1>
            <div className="row align-items-start justify-content-between">
              <p className="text-lightslategray relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                <span>
                  New password
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
                    message: "Password must have at least one uppercase letter",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Enter new password"
                />
              </Form.Item>{" "}
            </div>
            <div className="row align-items-start justify-content-between">
              <p className="text-lightslategray relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                <span>
                  Confirm new password
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
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Confirm password does not match");
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password
                  name="confirm_password"
                  type="password"
                  placeholder="Enter new password again"
                />
              </Form.Item>
            </div>
            <Form.Item className="text-center">
              <button
                type="submit"
                className="hover:bg-blueviolet mt-3 box-border flex w-full max-w-full flex-1 cursor-pointer flex-row items-start justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary-colour px-5 py-[21px] [border:none]"
              >
                <div className="font-barlow relative mt-0 flex w-full items-center justify-center text-center text-lg font-medium text-neutral-white">
                  Reset Password
                </div>
              </button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
};
export default ResetPassword;
