import axiosInstances from "@/config/axios";
import { OrderStatus } from "@/enums/order";
import { ArtworkDTO } from "@/types/market/ArtworkDTO";
import { getUserInfoId } from "@/utils/utils";
import { v4 } from "uuid";

const requestMarket = axiosInstances.market
const ROOT_ORDER_MARKET = "/order"

const getHistoryOrder  = (userID: string) => requestMarket.get(`${ROOT_ORDER_MARKET}/GetHistoryOrder?userID=${userID}`)

const getOrderByOrderId  = (orderId: string) => requestMarket.get(`${ROOT_ORDER_MARKET}/GetOrder?orderID=${orderId}`)

const createOrder = (
    orderId: string,
    total: number,
    artwork: ArtworkDTO
  ) => requestMarket.post(`${ROOT_ORDER_MARKET}/CreateOrder`, {
    header: {
      orderId: orderId,
      id: getUserInfoId(),
      createdOn: new Date().toISOString(),
      paymentId: "1",
      orderStatus: OrderStatus.PENDING_PAY_VNPAY,
      total: total,
      numberOfDowload: 1,
      soldDate: new Date().toISOString()
    },
    orderDetails: [
      {
        orderDetailId: v4(),
        orderId: orderId,
        artworkId: {
          artworkId: artwork.artworkId,
          artworkName: artwork.artworkName,
          price: artwork.price,
          discount: artwork.discount,
          status: artwork.status,
          creator: {
            id: artwork.creator.id,
            email: artwork.creator.email,
            name: artwork.creator.name,
            phoneNumber: "0989123456",
            address: artwork.creator.address,
            status: artwork.creator.status
          },
          categoryID: artwork.categoryID,
          imageUrl: artwork.imageUrl,
          imageLocalPath: artwork.imageLocalPath
        },
        price: (artwork.price - artwork.price * artwork.discount / 100),
        dowloaded: true
      }
    ]
  })

const CreatePaymentUrl = (
    orderId: string,
    id: string = getUserInfoId(),
    paymentId: string = "1",
    orderStatus: string = OrderStatus.PENDING_PAY_VNPAY,
    total: number,
  ) => requestMarket.post(`${ROOT_ORDER_MARKET}/CreatePaymentUrl`, {
    orderId: orderId,
    id: id,
    paymentId:paymentId,
    orderStatus: orderStatus,
    total: total,
    numberOfDowload: 1
})

const orderMarketApi = {
  getHistoryOrder,
  getOrderByOrderId,
    createOrder,
    CreatePaymentUrl
};
  
export default orderMarketApi;