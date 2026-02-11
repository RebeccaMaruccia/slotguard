export enum FeedbackTypeEnum {
    Error = "error",
    Warning = "warning",
    Success = "success",
}

export interface PopupDetailDto {
    type: FeedbackTypeEnum,
    code: string,
    title: string,
    detail: string,
    autohideDelay?: number,
}

export interface PopupDto extends PopupDetailDto {
    id: string,
    timestamp: number,
}
