import axiosInstances from "@/config/axios";

const requestMarket = axiosInstances.market
const ROOT_PACKAGE_PURCHASE_MARKET = "/packagePurchase"

const getAllAvailablePackage  = () => requestMarket.get(`${ROOT_PACKAGE_PURCHASE_MARKET}/GetAllAvailablePackage`)

const buyPackage  = (
    packageId: string,
    id: string,
    price: number,
  ) => requestMarket.post(`${ROOT_PACKAGE_PURCHASE_MARKET}/BuyPackage?userID=${id}`,{
    packageId: packageId,
    id: id,
    price: price,
  })

  const createPaymentPackage  = (
    packageId: string,
    id: string,
    price: number,
  ) => requestMarket.post(`${ROOT_PACKAGE_PURCHASE_MARKET}/CreatePaymentPackage`,{
    packageId: packageId,
    id: id,
    price: price,
  })

const packagePurchaseMarketApi = {
    getAllAvailablePackage,
    buyPackage,
    createPaymentPackage
};
  
export default packagePurchaseMarketApi;