export interface UserAuthDto {
    logged: boolean | undefined,
    accessToken: string;
    refreshToken: string;
    loggedAt: number,
    expiresAt: number,
    scope: string[],
    loginType: "internal" | "external",
}
