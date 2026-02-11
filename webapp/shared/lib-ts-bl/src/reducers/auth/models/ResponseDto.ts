export interface AdditionalErrorDto {
    code?: string;
    detail?: string;
    title?: string;
};

export interface ResponseDto {
    _links?: string[];
    additionalErrors?: AdditionalErrorDto[];
    code?: string;
    detail?: string;
    title?: string;
    type?: string;
};
