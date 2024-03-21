import { PackageDTO } from "./PackageDTO";

export interface PackageOfCreatorDTO {
    packageId?: string;
    id?: string;
    expiredDate?: string;
    graceDate?: string;
    price?: number;
    status?: string;
    package?: PackageDTO;
}