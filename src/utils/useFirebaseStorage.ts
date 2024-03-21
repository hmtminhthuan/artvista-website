import {
    firebaseStorage,
    uploadBytes,
    listAll,
    getDownloadURL,
    refStorage,
    deleteObject,
  } from "@/config/firebaseConfig";

const DEFAULT_AVATAR = "/images/avatar/avatar.png";

export const getUserAvatar = async (userId: string): Promise<string> => {
    const imageListRef = refStorage(firebaseStorage, "userImages/");
    try {
        const response = await listAll(imageListRef);
        for (var i = 0; i <= response.items.length - 1; i++) {
            const url = await getDownloadURL(response.items[i]);
            if (url.includes(userId)) {
                return url;
            }
        }
        return DEFAULT_AVATAR;
    } catch (error) {
        console.error("Error setting avatar:", error);
        return DEFAULT_AVATAR;
    }
};
