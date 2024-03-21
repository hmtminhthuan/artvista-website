import { ArtworkDTO } from "./ArtWorkDTO";
import { InteractionDTO } from "./InteractionDTO";

export interface PostDTO {
    postId?: string;
    artworkId?: string;
    tittle?: string;
    description?: string;
    createdOn?: string;
    status?: string;
    artworkDTO?: ArtworkDTO;
    interactionDTOs?: InteractionDTO[];
}

