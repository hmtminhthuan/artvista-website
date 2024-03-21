export interface ReportDTO {
    reportId?: string;
    createdOn?: string;
    createdBy?: string;
    artworkId?: string;
    status?: string;
    detail?: string;
    id?: string;
    actionNote?: string;
    report?: ReportDTO;
}