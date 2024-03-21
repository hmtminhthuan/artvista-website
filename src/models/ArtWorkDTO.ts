import { PostDTO } from "./PostDTO";
import { ReportDTO } from "./ReportDTO";

export interface ArtworkDTO {
    artworkId?: string;
    artworkName?: string;
    price?: number;
    discount?: number;
    status?: string;
    id?: string;
    categoryId?: string;
    imageUrl?: string;
    imageLocalPath?: string;
    image?: string;
    postDTOs?: PostDTO[];
    reportDTOs?: ReportDTO[];
}