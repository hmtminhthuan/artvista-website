import { ArtworkDTO } from "../market/ArtworkDTO";

export type FirebaseMessage = {
    messageId: string,
    name: string,
    message: string,
    userID: string,
    roleID: string,
    artwork: string,
    artworkParse?: ArtworkDTO | null,
    createdAt: string,
}