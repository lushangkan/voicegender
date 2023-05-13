export default interface Status {
    code: number;
    message: string;
}

export interface RequestStatus {
    status: Status;
}

export interface AnalyzeStatus {
    status: Status;
}