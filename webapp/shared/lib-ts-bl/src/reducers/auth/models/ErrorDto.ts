export interface ErrorDetailDto extends ErrorDetailBaseDto {
    /** A URI reference [RFC3986] that identifies the problem type */
    type: string,
    /** Determines if the user authentication should be removed when this error occurs */
    shouldLogout?: boolean,
    /** The HTTP status code 
     * @default 500
    */
    status: number,
    /** Should refer to next steps if the problem can be resolved e.g. for re-submission of credentials */
    links?: string[],
    /** Might be used if more than one error is to be communicated  */
    nested: ErrorDetailNestedDto[],
}

export interface ErrorDetailBaseDto {
    /** Message code to explain the nature of the underlying error */
    code: string,
    /** Short human readable description of error type */
    title: string,
    /** Detailed human readable text specific to this instance of the error */
    detail: string,
}

export interface ErrorDetailNestedDto extends ErrorDetailBaseDto {

}

export interface ErrorDto extends ErrorDetailDto {
    /** The error unique id */
    id: string,
    /** The error timestamp */
    timestamp: number,
}
