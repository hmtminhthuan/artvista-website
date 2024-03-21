"use client";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./index.scss";
import { getUserAvatar } from "@/utils/useFirebaseStorage";
import { formatPrice } from "@/utils/formatPrice";
import { PackageMarketDTO } from "@/types/market/PackageMarketDTO";
import { v4 } from "uuid";
import packagePurchaseMarketApi from "@/api/market/packagePurchase";
import { getUserInfoId } from "@/utils/utils";
import sweetAlert from "@/utils/sweetAlert";
import Swal from "sweetalert2";
import useAppContext from "@/hooks/useAppContext";

export type PackageCardType = {
  packageId: string;
  packageName: string;
  maximumArtworks: number;
  price: number;
  discount: number;
  packageTime?: any;
};

const PackageCard: NextPage<PackageCardType> = ({
  packageId,
  packageName,
  maximumArtworks,
  price,
  discount,
  packageTime,
}) => {
  const router = useRouter();
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const { isLoading, enableLoading, disableLoading } = useAppContext();

  const handleBuyPackage = () => {
    console.log({
      packageId: packageId,
      id: getUserInfoId(),
      price: price - (price * discount) / 100,
    });

    enableLoading();
    packagePurchaseMarketApi
      .buyPackage(packageId, getUserInfoId(), price - (price * discount) / 100)
      .then((response) => {
        console.log(response);
        if (response.data.isSuccess) {
          packagePurchaseMarketApi
            .createPaymentPackage(
              packageId,
              getUserInfoId(),
              price - (price * discount) / 100
            )
            .then((response) => {
              console.log(response);
              if (response.data.url && response.data.url != "") {
                Swal.fire({
                  icon: "info",
                  title: `Create Purchase Request Successfully`,
                  html: `Please checkout immediately to get your package now.</br>
                  After checkout, please click the button below to continue.`,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: true,
                  confirmButtonText: "Click here to continue",
                  showLoaderOnConfirm: true,
                  allowOutsideClick: false,
                }).then((result) => {});
                window.open(response.data.url);
                setPaymentUrl(response.data.url);
              } else {
                sweetAlert.alertFailed(
                  "Request to pay failed",
                  "Please try again later. We are sorry.",
                  3000,
                  30
                );
              }
            })
            .catch((err) => {
              console.log(err);
              sweetAlert.alertFailed(
                "Request to pay failed",
                "Please try again later. We are sorry.",
                3000,
                30
              );
            });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        disableLoading();
      });
  };

  const checkCurrentPackage = () => {};

  return (
    <div
      className="mt-10 w-[28%] pricing-gd-left pric-7 active overflow-hidden"
      style={{ borderRadius: "8px" }}
    >
      <div className="w3l-pricing-7">
        <div
          className="w3l-pricing-7-top bg-purple-900 mt-0"
          style={{ paddingTop: "1rem", paddingBottom: "0.8rem" }}
        >
          <h5
            style={{ borderRadius: "5px", fontWeight: "bolder" }}
            className="mt-5 bg-white inline-block text-purple-900 px-4 py-1"
          >
            {discount > 0 ? `Save ${discount}%` : "Good Package"}
          </h5>
          <h1
            style={{ fontSize: "2rem", fontWeight: "bolder" }}
            className="my-2 mt-4"
          >
            {packageName}
          </h1>
          <h4 style={{ fontSize: "2.2rem", fontWeight: "bolder" }}>
            {formatPrice(price - (price * discount) / 100)}
            <span className="text-[1rem]">{"/VND"}</span>
          </h4>
        </div>
        <div
          style={{ paddingTop: "15px", paddingBottom: "20px" }}
          className="w3l-pricing-7-bottom bg-black-2 text-neutral-200"
        >
          <div className="w3l-pricing-7-bottom-bottom">
            <ul className="links">
              <li className="mb-3">
                <p className="lists">Maximum Artworks: {maximumArtworks} </p>
              </li>
              <li className="mb-3">
                <p className={`lists`}>
                  Default Price:{" "}
                  <span className={`${discount > 0 ? "line-through" : ""}`}>
                    {formatPrice(price)} {" VND"}
                  </span>
                </p>
              </li>
              {packageTime ? (
                <li className="mb-3">
                  <p className="lists">
                    Time: {packageTime} {" days"}
                  </p>
                </li>
              ) : (
                <></>
              )}
            </ul>
            <div
              onClick={() => {
                handleBuyPackage();
              }}
              className="cursor-pointer mb-6 header_links_hover mt-4 py-3 px-1 buy-button bg-purple-900"
              style={{ borderRadius: "5px" }}
            >
              <a className=" popup btn btn-style btn-primary " href="#buy">
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
