"use client";
import { useRouter } from "next/navigation";
import "./index.scss";
import { PATH_SHOP } from "@/routes/paths";
import packagePurchaseMarketApi from "@/api/market/packagePurchase";
import { useEffect, useState } from "react";
import { PackageMarketDTO } from "@/types/market/PackageMarketDTO";
import { formatPrice } from "@/utils/formatPrice";

const PackageSection = (props: {}) => {
  const router = useRouter();
  const [packageList, setPackageList] = useState<PackageMarketDTO[]>([]);

  const renderPackge = () => {
    packagePurchaseMarketApi
      .getAllAvailablePackage()
      .then((response) => {
        if (response.data.isSuccess && response.data.result) {
          setPackageList(response.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    renderPackge();
  }, []);

  return (
    <section className="package_area mb-20">
      <div className="w3l-pricing-7-main py-5" id="pricing">
        <div className="pricing-7-sec pt-lg-4 pt-md-3 pb-lg-5 pb-md-4">
          <div className="container pricing-grid">
            <div className="mb-15 text-neutral-white text-29xl flex max-w-full flex-1 flex-col items-start justify-start gap-[16px_0px]">
              <h1 className="mt-6 font-inherit mq450:text-10xl mq750:text-19xl relative m-0 font-semibold text-inherit">
                Affordable Packages
              </h1>
              <div className="mq450:text-lg mq450:leading-[28px] relative self-stretch text-3xl capitalize leading-[160%]">
                Let's start to be a wonderful creator with us.
                <span
                  className="header_links_hover cursor-pointer fw-bolder"
                  style={{ color: "#A259FF" }}
                  onClick={() => {
                    router.push(PATH_SHOP.general.package);
                  }}
                >
                  {" "}
                  View More Packages {">"}
                </span>
              </div>
            </div>

            <div className="pricing-sec-7">
              {packageList.map((pkg, index) => {
                if (index >= 3) {
                  return <></>;
                }
                if (index == 1) {
                  return (
                    <>
                      <div
                        className="pricing-gd-left pric-7 active overflow-hidden"
                        style={{ borderRadius: "8px" }}
                      >
                        <div className="w3l-pricing-7">
                          <div className="w3l-pricing-7-top bg-purple-900">
                            <h5 style={{ borderRadius: "5px" }}>
                              {pkg.discount > 0
                                ? `Save ${pkg.discount}%`
                                : "Good Package"}
                            </h5>
                            <h6>{pkg.packageName}</h6>
                            <h4>
                              {formatPrice(
                                pkg.price - (pkg.price * pkg.discount) / 100
                              )}
                              <span>/VND</span>
                            </h4>
                          </div>
                          <div className="w3l-pricing-7-bottom bg-black-2 text-neutral-200">
                            <div className="w3l-pricing-7-bottom-bottom">
                              <ul className="links">
                                <li className="mb-3">
                                  <p className="lists">
                                    Maximum Artworks: {pkg.maximumArtworks}{" "}
                                  </p>
                                </li>
                                <li className="mb-3">
                                  <p className={`lists`}>
                                    Default Price:{" "}
                                    <span
                                      className={`${pkg.discount > 0 ? "line-through" : ""}`}
                                    >
                                      {formatPrice(pkg.price)} {" VND"}
                                    </span>
                                  </p>
                                </li>
                                <li className="mb-3">
                                  <p className="lists">
                                    Time: {pkg.packageTime} {" days"}
                                  </p>
                                </li>
                              </ul>
                            </div>
                            <div className="buy-button">
                              <a
                                className="py-3 px-3 popup btn btn-style btn-primary bg-purple-900"
                                href="#buy"
                                style={{ borderRadius: "5px" }}
                              >
                                Get Started
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }
                return (
                  <>
                    <div
                      style={{ borderRadius: "10px" }}
                      className="bg-zinc-950 slate-950 pricing-gd-left pric-7-1 text-neutral-white"
                    >
                      <div className="w3l-pricing-7">
                        <div className="w3l-pricing-7-top text-primary-colour">
                          <h6 className="one-light ">{pkg.packageName}</h6>
                          <h4>
                            {formatPrice(
                              pkg.price - (pkg.price * pkg.discount) / 100
                            )}
                            <span>/VND</span>{" "}
                          </h4>
                        </div>
                        <div className="w3l-pricing-7-bottom">
                          <div className="w3l-pricing-7-bottom-bottom">
                            <ul className="links">
                              <li className="mb-3">
                                <p className="lists">
                                  Maximum Artworks: {pkg.maximumArtworks}{" "}
                                </p>
                              </li>
                              <li className="mb-3">
                                <p className={`lists`}>
                                  Default Price:{" "}
                                  <span
                                    className={`${pkg.discount > 0 ? "line-through" : ""}`}
                                  >
                                    {formatPrice(pkg.price)} {" VND"}
                                  </span>
                                </p>
                              </li>
                              <li className="mb-3">
                                <p className="lists">
                                  Time: {pkg.packageTime} {" days"}
                                </p>
                              </li>
                            </ul>
                          </div>
                          <div className="buy-button">
                            <a
                              className="py-3 px-3 popup btn btn-style btn-primary bg-purple-900"
                              href="#buy"
                              style={{ borderRadius: "5px" }}
                            >
                              Buy Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageSection;
