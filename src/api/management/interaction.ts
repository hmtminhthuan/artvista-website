import { InteractionManagementDTO } from "@/types/management/InteractionManagementDTO";
import axiosInstances from "@/config/axios";

const requestManagement = axiosInstances.management
const ROOT_INTERACTION = "/interaction"

const getAllInteraction = () => requestManagement.get(`${ROOT_INTERACTION}/GetAllInteraction`)

const getInteractionByPostID = (postId: string) => requestManagement.get(`${ROOT_INTERACTION}/GetInteractionByPostID`, { params : { postId: postId} })

const createInteraction = (
    interactionId: string,
    id: string,
    createdOn: string,
    like: number,
    comments: string,
    postId: string
) => requestManagement.post(`${ROOT_INTERACTION}/CreateInteraction`, {interactionId,
    id,
    createdOn,
    like,
    comments,
    postId} )

const updateInteraction = (
    interactionId: string,
    id: string,
    createdOn: string,
    like: number,
    comments: string,
    postId: string
) => requestManagement.put(`${ROOT_INTERACTION}/UpdateInteraction`, {interactionId,
    id,
    createdOn,
    like,
    comments,
    postId})

const deleteInteraction = (interactionId: string) => requestManagement.delete(`${ROOT_INTERACTION}/DeleteInteraction`, { params : { id: interactionId} })

const interactionManagementApi = {
    getAllInteraction,
    getInteractionByPostID,
    createInteraction,
    updateInteraction,
    deleteInteraction
};
  
export default interactionManagementApi;