import axiosInstances from "@/config/axios";

const requestMarket = axiosInstances.market
const ROOT_ARTWORK_MARKET = "/artworkMarket"

const getAllArtworkMarket = () => requestMarket.get(`${ROOT_ARTWORK_MARKET}/GetAllArtwork`)

const getAllArtworkMarketWithCondition = (
    searchkey: string = "",
    minPrice: number = 0,
    maxPrice: number = 0,
    discount: number = 0,
    status: string = "",
    cateID: string = ""
  ) =>
    requestMarket.get(`${ROOT_ARTWORK_MARKET}/GetAllArtwork`, {
      params: {
        searchkey,
        minPrice,
        maxPrice,
        discount,
        status,
        cateID,
      },
    });

const artworkMarketApi = {
    getAllArtworkMarket,
    getAllArtworkMarketWithCondition
};
  
export default artworkMarketApi;