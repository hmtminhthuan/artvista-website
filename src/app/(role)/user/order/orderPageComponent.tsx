"use client";

import artworkMarketApi from "@/api/market/artwork";
import orderMarketApi from "@/api/market/order";
import Loading from "@/components/Loading/Loading";
import { OrderStatus } from "@/enums/order";
import useAppContext from "@/hooks/useAppContext";
import { PATH_SHOP } from "@/routes/paths";
import { AuthUser } from "@/types/authentication";
import { ArtworkDTO } from "@/types/market/ArtworkDTO";
import {
  formatDate_YYYY_MMMM_DD,
  formatDate_YYYY_MMMM_DD_Time,
} from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { getUserInfo } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderPageComponent = (props: {}) => {
  const [userLogin, setUserLogin] = useState<AuthUser | null>(null);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [artworkList, setArtworkList] = useState<ArtworkDTO[]>([]);
  const [finishRendering, setFinishRendering] = useState<boolean>(false);
  const { isLoading, enableLoading, disableLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    enableLoading();
    const USER_INFO = getUserInfo();
    const USER_PARSE = USER_INFO ? JSON.parse(USER_INFO) : null;
    setUserLogin(USER_PARSE);
  }, []);

  useEffect(() => {
    if (userLogin) {
      artworkMarketApi
        .getAllArtworkMarketWithCondition()
        .then((response) => {
          if (response.data.isSuccess && response.data.result) {
            setArtworkList(response.data.result);
          } else {
            setArtworkList([]);
          }
        })
        .catch((error) => {
          console.log(error);
          setArtworkList([]);
        });

      var orderList: any[] = [];
      orderMarketApi
        .getHistoryOrder(userLogin.id)
        .then((response) => {
          if (response.data.isSuccess && response.data.result) {
            orderList = response.data.result;
          }
        })
        .catch((err) => {
          orderList = [];
          console.log(err);
        })
        .finally(() => {
          var finalOrderList: any[] = [];
          orderList.forEach((order) => {
            orderMarketApi
              .getOrderByOrderId(order.orderId)
              .then((response) => {
                order.artworkId =
                  response.data.result.orderDetails[0].artworkId.artworkId;
                finalOrderList = [...finalOrderList, order];
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                if (finalOrderList.length == orderList.length) {
                  setOrderList([...orderList]);
                  disableLoading();
                  setFinishRendering(true);
                }
              });
          });
        });
    }
  }, [userLogin]);

  if (
    !userLogin ||
    !finishRendering ||
    orderList.filter((o) => o.artworkId == null || o.artworkId == undefined)[0]
  ) {
    return <></>;
  }

  return (
    <>
      <Loading loading={isLoading} />
      {orderList.length > 0 && finishRendering ? (
        <>
          <table
            className="responsive-font my-6 text-neutral-white"
            data-aos="zoom-in"
            data-aos-duration="300"
            data-aos-delay="500"
            style={{ minWidth: "90%" }}
          >
            <thead className="bg-purple-950">
              <tr>
                <th className="px-3 py-3" style={{ textAlign: "center" }}>
                  No.
                </th>
                <th className="px-3 py-3" style={{ textAlign: "left" }}>
                  Artwork
                </th>
                <th className="px-5 py-3" style={{ textAlign: "right" }}>
                  Total {"(VND)"}
                </th>
                <th className="px-4 py-3" style={{ textAlign: "left" }}>
                  Order Time
                </th>
                <th className="px-3 py-3" style={{ textAlign: "left" }}>
                  Payment Time
                </th>
                <th className="px-3 py-3" style={{ textAlign: "center" }}>
                  Order Status
                </th>
              </tr>
            </thead>

            <tbody style={{ height: "auto" }}>
              {orderList
                .sort((a, b) => {
                  const dateA = new Date(a.createdOn);
                  const dateB = new Date(b.createdOn);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((order, index) => {
                  const {
                    orderId,
                    id,
                    createdOn,
                    paymentId,
                    orderStatus,
                    total,
                    numberOfDowload,
                    soldDate,
                    artworkId,
                  } = order;
                  const artwork = artworkList.filter(
                    (a) => a.artworkId == artworkId
                  )[0];
                  return (
                    <tr
                      key={index}
                      data-aos="zoom-out"
                      data-aos-duration="100"
                      data-aos-delay="0"
                      data-aos-offset="0"
                    >
                      <td className="px-3 py-3" style={{ textAlign: "center" }}>
                        {index + 1}
                      </td>
                      <td
                        onClick={() => {
                          router.push(
                            PATH_SHOP.general.artworkDetail(artwork.artworkId)
                          );
                        }}
                        className="cursor-pointer px-3 py-3"
                        style={{ textAlign: "left" }}
                      >
                        {artwork ? (
                          <>
                            <div className="flex flex-row items-center">
                              <div>
                                <img
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "5px",
                                  }}
                                  src={
                                    artwork.imageUrl.split("://example.com")[0]
                                  }
                                  alt="image"
                                />
                              </div>
                              <div className="ms-3">
                                <p>Artwork name: {artwork.artworkName}</p>
                                <p>Creator: {artwork.creator.name}</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </td>
                      <td className="px-5 py-3" style={{ textAlign: "right" }}>
                        {formatPrice(total)}
                      </td>
                      <td className="px-4 py-3" style={{ textAlign: "left" }}>
                        {formatDate_YYYY_MMMM_DD_Time(createdOn)}
                      </td>
                      <td className="px-3 py-3" style={{ textAlign: "left" }}>
                        {orderStatus == OrderStatus.SUCCESS_PAY_VNPAY ? (
                          <>{formatDate_YYYY_MMMM_DD_Time(soldDate)}</>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="px-3 py-3" style={{ textAlign: "center" }}>
                        <p
                          className={`inline-block px-3 py-1 rounded-full
                    ${orderStatus == OrderStatus.PENDING_PAY_VNPAY ? "bg-warning text-yellow-900" : ""}
                    ${orderStatus == OrderStatus.SUCCESS_PAY_VNPAY ? "bg-green-400 text-green-950" : ""}
                    ${orderStatus == OrderStatus.FAIL_PAY_VNPAY ? "bg-danger text-rose-950" : ""}`}
                          style={{ fontWeight: "bolder" }}
                        >
                          {orderStatus}
                        </p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      ) : (
        <>You have not had any orders yet.</>
      )}
      {!(orderList.length > 0) && finishRendering ? (
        <>You have not had any orders yet.</>
      ) : (
        <></>
      )}
    </>
  );
};

export default OrderPageComponent;
