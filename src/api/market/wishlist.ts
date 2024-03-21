import axiosInstances from "@/config/axios";

const requestMarket = axiosInstances.market
const ROOT_WISHLIST_MARKET = "/wishlist"

const getWishList  = (userID: string) => requestMarket.get(`${ROOT_WISHLIST_MARKET}/GetWishList?userID=${userID}`)

const addArtWorkToWishList  = (userID: string, artworkId: string) => requestMarket.post(`${ROOT_WISHLIST_MARKET}/AddArtWorkToWishList?userID=${userID}&artwork=${artworkId}&quantity=${1}`)

const removeArtWorkFromWishList  = (userID: string, artworkId: string) => requestMarket.delete(`${ROOT_WISHLIST_MARKET}/RemoveArtWorkFromWishList?userID=${userID}&artworkID=${artworkId}`)


const wishlistMarketApi = {
    getWishList,
    addArtWorkToWishList,
    removeArtWorkFromWishList
};
  
export default wishlistMarketApi;