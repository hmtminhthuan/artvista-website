import { PostDTO } from "./PostDTO";

export interface InteractionDTO {
    interactionId?: string;
    id?: string;
    createdOn?: string;
    like?: number;
    comments?: string;
    postId?: string;
    postDTO?: PostDTO;
}