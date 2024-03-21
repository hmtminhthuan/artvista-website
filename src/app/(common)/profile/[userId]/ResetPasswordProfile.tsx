"use client";
import authApi from "@/api/auth/auth";
import Loading from "@/components/Loading/Loading";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import { PATH_AUTH, PATH_SHOP } from "@/routes/paths";
import sweetAlert from "@/utils/sweetAlert";
import { getUserInfo, getUserInfoId } from "@/utils/utils";
import { Form, Input } from "antd";
import { useFormik } from "formik";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const ResetPasswordProfile: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { enableLoading, disableLoading } = useAppContext();
  const [form] = Form.useForm();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      newpassword: "",
    },
    onSubmit: (values) => {
      var email = JSON.parse(getUserInfo() ?? "").email;
      enableLoading();
      authApi
        .changePasswordWithOldPass(
          "",
          email,
          values.oldPassword,
          values.newpassword
        )
        .then((response) => {
          disableLoading();
          if (response.data.isSuccess) {
            sweetAlert.alertSuccess(
              "Change Password Successfully",
              "",
              1300,
              25
            );
            router.push(PATH_SHOP.profile(userId));
          } else {
            sweetAlert.alertFailed(
              "Change Password Failed",
              "Please try again",
              1300,
              25
            );
          }
          form.resetFields();
        })
        .catch(() => {});
    },
  });

  return (
    <>
      <Form
        onFinish={formik.handleSubmit}
        form={form}
        size="large"
        autoComplete="off"
        className="w-full"
      >
        <h1
          className="text-center mb-5 text-neutral-white"
          style={{ fontSize: "2rem", fontWeight: "bolder" }}
        >
          Change Your Password
        </h1>

        <div className="row align-items-start justify-content-between">
          <p className="text-lightslategray text-start text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
            <span>
              Current password
              <span className="text-red">*</span>
            </span>
          </p>
          <Form.Item
            className="text-start col-sm-12 col-md-7 mx-0 px-0"
            name="oldPassword"
            label=""
            rules={[
              {
                required: true,
                message: "Current password cannot be blank",
              },
              {
                min: 6,
                message: "Current password is at least 6 characters",
              },
              {
                pattern: /[a-zA-Z]/,
                message: "Current password must have at least one letter",
              },
              {
                pattern: /\d/,
                message: "Current password must have at least one digit",
              },
              {
                pattern: /[^a-zA-Z\d]/,
                message:
                  "Current password must have at least one non-alphanumeric character",
              },
              {
                pattern: /[A-Z]/,
                message:
                  "Current password must have at least one uppercase letter",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              name="oldPassword"
              type="password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              placeholder="Enter current password"
            />
          </Form.Item>
        </div>

        <div className="row align-items-start justify-content-between">
          <p className="text-lightslategray text-start text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
            <span>
              New password
              <span className="text-red">*</span>
            </span>
          </p>
          <Form.Item
            className="text-start col-sm-12 col-md-7 mx-0 px-0"
            name="newpassword"
            label=""
            rules={[
              {
                required: true,
                message: "New password cannot be blank",
              },
              {
                min: 6,
                message: "New password is at least 6 characters",
              },
              {
                pattern: /[a-zA-Z]/,
                message: "New password must have at least one letter",
              },
              {
                pattern: /\d/,
                message: "New password must have at least one digit",
              },
              {
                pattern: /[^a-zA-Z\d]/,
                message:
                  "New password must have at least one non-alphanumeric character",
              },
              {
                pattern: /[A-Z]/,
                message: "New password must have at least one uppercase letter",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              name="newpassword"
              type="password"
              value={formik.values.newpassword}
              onChange={formik.handleChange}
              placeholder="Enter new password"
            />
          </Form.Item>{" "}
        </div>

        <div className="row align-items-start justify-content-between">
          <p className="text-lightslategray text-start text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
            <span>
              Confirm new password
              <span className="text-red">*</span>
            </span>
          </p>
          <Form.Item
            className="text-start col-sm-12 col-md-7 mx-0 px-0"
            name="confirm_password"
            label=""
            dependencies={["newpassword"]}
            rules={[
              {
                required: true,
                message: "Confirm new password is required",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newpassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Confirm new password does not match");
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
          <div>
            <p
              className="cursor-pointer text-end text-blue-500 mb-5"
              style={{ fontWeight: "bolder" }}
              onClick={() => {
                enableLoading();
                var email = JSON.parse(getUserInfo() ?? "").email;
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
              }}
            >
              Forget Your Current Password?
            </p>
          </div>
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
    </>
  );
};
export default ResetPasswordProfile;
