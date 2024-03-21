import axiosInstances from "@/config/axios";
import { ArtworkDTO } from "@/types/market/ArtworkDTO";
import { getUserInfoId } from "@/utils/utils";
import { v4 } from "uuid";

const requestManagement = axiosInstances.management
const ROOT_POST= "/post"

const getAllPost = () => requestManagement.get(`${ROOT_POST}/GetAllPost`)

const createNewPost = (artwork: ArtworkDTO, description: string) => requestManagement.post(`${ROOT_POST}/CreateNewPost`, {
        postId: v4(),
        artworkId: artwork.artworkId,
        tittle: artwork.artworkName,
        description: description,
        createdOn: new Date().toISOString(),
        status: "Published",
        artworkDTO: {
          artworkId: artwork.artworkId,
          artworkName: artwork.artworkName,
          price: 0,
          discount: 0,
          status: artwork.status,
          id: getUserInfoId(),
          categoryId: artwork.categoryID,
          imageUrl: artwork.imageUrl,
          imageLocalPath: artwork.imageLocalPath,
          image: artwork.image,
          postDTOs: null,
          reportDTOs: null,
        }
      }
)

const postManagementApi = {
    getAllPost,
    createNewPost
};
  
export default postManagementApi;