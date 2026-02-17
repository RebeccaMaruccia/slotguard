import {
  api
} from "C:\\Users\\matti\\Desktop\\WorkSpaces\\slotguard-be\\webapp\\api\\api-library\\src\\slotGuard\\slotGuardbaseQuery";

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<RegisterApiResponse, RegisterApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/auth/register`,
        method: "POST",
        body: queryArg.registerRequest,
      }),
    }),
    authenticate: build.mutation<AuthenticateApiResponse, AuthenticateApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/auth/login`,
        method: "POST",
        body: queryArg.authenticationRequest,
      }),
    }),
    crea: build.query<CreaApiResponse, CreaApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/prenotazione/`,
        headers: {
          Authorization: queryArg.authorization,
        },
        params: {
          req: queryArg.req,
        },
      }),
    }),
    refreshToken: build.query<RefreshTokenApiResponse, RefreshTokenApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/auth/refreshToken`,
        headers: {
          authorizationrest: queryArg.authorizationrest,
        },
      }),
    }),
    checkMatricola: build.query<
      CheckMatricolaApiResponse,
      CheckMatricolaApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/auth/check-matricola/${queryArg.matricola}`,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as slotGuardServiceApiBase };
export type RegisterApiResponse = /** status 200 OK */ RegisterResponse;
export type RegisterApiArg = {
  registerRequest: RegisterRequest;
};
export type AuthenticateApiResponse =
  /** status 200 OK */ AuthenticationResponse;
export type AuthenticateApiArg = {
  authenticationRequest: AuthenticationRequest;
};
export type CreaApiResponse = /** status 200 OK */ PrenotazioneDtoRes;
export type CreaApiArg = {
  req: PrenotazioneDtoReq;
  authorization: string;
};
export type RefreshTokenApiResponse =
  /** status 200 OK */ AuthenticationResponse;
export type RefreshTokenApiArg = {
  authorizationrest: string;
};
export type CheckMatricolaApiResponse = /** status 200 OK */ boolean;
export type CheckMatricolaApiArg = {
  matricola: string;
};
export type RegisterResponse = {
  matricola?: string;
  nome?: string;
  cognome?: string;
  message?: string;
};
export type RegisterRequest = {
  matricola: string;
  nome: string;
  cognome: string;
  password: string;
  passwordConfirm: string;
};
export type AuthenticationResponse = {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  type?: string;
};
export type AuthenticationRequest = {
  matricola: string;
  password: string;
};
export type Utente = {
  codiceFiscale?: string;
  nome?: string;
  cognome?: string;
  numeroTelefono?: string;
  email?: string;
};
export type GrantedAuthority = {
  authority?: string;
};
export type Operatore = {
  matricola?: string;
  nome?: string;
  cognome?: string;
  password?: string;
  ruolo?: "ADMIN" | "OPERATORE";
  authorities?: GrantedAuthority[];
  username?: string;
  enabled?: boolean;
  accountNonExpired?: boolean;
  credentialsNonExpired?: boolean;
  accountNonLocked?: boolean;
};
export type Servizio = {
  id?: number;
  descrizione?: string;
  costoMedio?: number;
};
export type PrenotazioneDtoRes = {
  dataAppuntamento?: string;
  statoPrenotazione?:
    | "BOOKED"
    | "CONFIRMED"
    | "CANCELLED_AUTO"
    | "CANCELLED_USER"
    | "COMPLETED"
    | "NO_SHOW";
  semaforoUrgenza?: "VERDE" | "GIALLO" | "ROSSO";
  utente?: Utente;
  operatore?: Operatore;
  servizio?: Servizio;
};
export type PrenotazioneDtoReq = {
  dataAppuntamento?: string;
  statoPrenotazione?:
    | "BOOKED"
    | "CONFIRMED"
    | "CANCELLED_AUTO"
    | "CANCELLED_USER"
    | "COMPLETED"
    | "NO_SHOW";
  semaforoUrgenza?: "VERDE" | "GIALLO" | "ROSSO";
  cfUtente?: string;
  matricolaOperatore?: string;
  servizio?: Servizio;
};
export const {
  useRegisterMutation,
  useAuthenticateMutation,
  useCreaQuery,
  useLazyCreaQuery,
  useRefreshTokenQuery,
  useLazyRefreshTokenQuery,
  useCheckMatricolaQuery,
  useLazyCheckMatricolaQuery,
} = injectedRtkApi;
