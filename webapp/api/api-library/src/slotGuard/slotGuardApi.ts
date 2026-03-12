import {
  api
} from "C:\\Users\\matti\\Desktop\\CartelleDiLavoro\\WorkSpaces\\slotguard-be\\webapp\\api\\api-library\\src\\slotGuard\\slotGuardbaseQuery";

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    rispondiDaLink: build.query<
      RispondiDaLinkApiResponse,
      RispondiDaLinkApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/public/notifica/rispondi`,
        params: {
          token: queryArg.token,
          accetta: queryArg.accetta,
        },
      }),
    }),
    rispondi: build.mutation<RispondiApiResponse, RispondiApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/public/notifica/rispondi`,
        method: "POST",
        params: {
          token: queryArg.token,
          accetta: queryArg.accetta,
        },
      }),
    }),
    updateUtente: build.mutation<UpdateUtenteApiResponse, UpdateUtenteApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/utente/update-utente`,
        method: "POST",
        body: queryArg.utenteDto,
      }),
    }),
    ricercaUtenti: build.mutation<
      RicercaUtentiApiResponse,
      RicercaUtentiApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/utente/ricerca`,
        method: "POST",
        body: queryArg.utenteDto,
      }),
    }),
    createUtente: build.mutation<CreateUtenteApiResponse, CreateUtenteApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/utente/new-utente`,
        method: "POST",
        body: queryArg.utenteDto,
      }),
    }),
    getSlots: build.mutation<GetSlotsApiResponse, GetSlotsApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/slot/get-slots`,
        method: "POST",
        params: {
          inizio: queryArg.inizio,
          fine: queryArg.fine,
        },
      }),
    }),
    generaSlots: build.mutation<GeneraSlotsApiResponse, GeneraSlotsApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/slot/genera-slots`,
        method: "POST",
        params: {
          settimane: queryArg.settimane,
        },
      }),
    }),
    updateServizio: build.mutation<
      UpdateServizioApiResponse,
      UpdateServizioApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/servizi/update-servizio`,
        method: "POST",
        body: queryArg.servizioDto,
      }),
    }),
    createServizio: build.mutation<
      CreateServizioApiResponse,
      CreateServizioApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/servizi/new-servizio`,
        method: "POST",
        body: queryArg.servizioDto,
      }),
    }),
    deleteServizio: build.mutation<
      DeleteServizioApiResponse,
      DeleteServizioApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/servizi/delete-servizio`,
        method: "POST",
        params: {
          id: queryArg.id,
        },
      }),
    }),
    updateStatoPrenotazione: build.mutation<
      UpdateStatoPrenotazioneApiResponse,
      UpdateStatoPrenotazioneApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/prenotazione/update-stato-prenotazione`,
        method: "POST",
        params: {
          idPrenotazione: queryArg.idPrenotazione,
          stato: queryArg.stato,
        },
      }),
    }),
    modificaPrenotazione: build.mutation<
      ModificaPrenotazioneApiResponse,
      ModificaPrenotazioneApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/prenotazione/update-prenotazione`,
        method: "POST",
        body: queryArg.updatePrenotazioneDtoReq,
        headers: {
          Authorization: queryArg.authorization,
        },
      }),
    }),
    ricercaPrenotazioni: build.mutation<
      RicercaPrenotazioniApiResponse,
      RicercaPrenotazioniApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/prenotazione/ricerca`,
        method: "POST",
        body: queryArg.ricercaPrenotazioneDto,
      }),
    }),
    createPrenotazione: build.mutation<
      CreatePrenotazioneApiResponse,
      CreatePrenotazioneApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/prenotazione/new-prenotazione`,
        method: "POST",
        body: queryArg.prenotazioneDtoReq,
        headers: {
          Authorization: queryArg.authorization,
        },
      }),
    }),
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
    getUtente: build.query<GetUtenteApiResponse, GetUtenteApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/utente/get`,
        params: {
          cf: queryArg.cf,
        },
      }),
    }),
    getSlot: build.query<GetSlotApiResponse, GetSlotApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/slot/get`,
        params: {
          id: queryArg.id,
        },
      }),
    }),
    getServizio: build.query<GetServizioApiResponse, GetServizioApiArg>({
      query: (queryArg) => ({
        url: `/slotGuard/api/servizi/servizio`,
        params: {
          id: queryArg.id,
        },
      }),
    }),
    getServizi: build.query<GetServiziApiResponse, GetServiziApiArg>({
      query: () => ({ url: `/slotGuard/api/servizi/servizi` }),
    }),
    getPrenotazione: build.query<
      GetPrenotazioneApiResponse,
      GetPrenotazioneApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/prenotazione/get`,
        params: {
          id: queryArg.id,
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
    getOperatoreFromToken: build.query<
      GetOperatoreFromTokenApiResponse,
      GetOperatoreFromTokenApiArg
    >({
      query: (queryArg) => ({
        url: `/slotGuard/api/auth/operatore`,
        headers: {
          Authorization: queryArg.authorization,
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
export type RispondiDaLinkApiResponse = /** status 200 OK */ string;
export type RispondiDaLinkApiArg = {
  token: string;
  accetta: boolean;
};
export type RispondiApiResponse = /** status 200 OK */ string;
export type RispondiApiArg = {
  token: string;
  accetta: boolean;
};
export type UpdateUtenteApiResponse = /** status 200 OK */ UtenteDto;
export type UpdateUtenteApiArg = {
  utenteDto: UtenteDto;
};
export type RicercaUtentiApiResponse = /** status 200 OK */ UtenteDto[];
export type RicercaUtentiApiArg = {
  utenteDto: UtenteDto;
};
export type CreateUtenteApiResponse = /** status 200 OK */ UtenteDto;
export type CreateUtenteApiArg = {
  utenteDto: UtenteDto;
};
export type GetSlotsApiResponse = /** status 200 OK */ SlotDto[];
export type GetSlotsApiArg = {
  inizio: string;
  fine: string;
};
export type GeneraSlotsApiResponse = unknown;
export type GeneraSlotsApiArg = {
  settimane: number;
};
export type UpdateServizioApiResponse = /** status 200 OK */ ServizioDto;
export type UpdateServizioApiArg = {
  servizioDto: ServizioDto;
};
export type CreateServizioApiResponse = /** status 200 OK */ ServizioDto;
export type CreateServizioApiArg = {
  servizioDto: ServizioDto;
};
export type DeleteServizioApiResponse = /** status 200 OK */ ServizioDto;
export type DeleteServizioApiArg = {
  id: number;
};
export type UpdateStatoPrenotazioneApiResponse =
  /** status 200 OK */ PrenotazioneDtoRes;
export type UpdateStatoPrenotazioneApiArg = {
  idPrenotazione: number;
  stato:
    | "BOOKED"
    | "CONFIRMED"
    | "CANCELLED_AUTO"
    | "CANCELLED_USER"
    | "COMPLETED"
    | "NO_SHOW";
};
export type ModificaPrenotazioneApiResponse =
  /** status 200 OK */ PrenotazioneDtoRes;
export type ModificaPrenotazioneApiArg = {
  authorization: string;
  updatePrenotazioneDtoReq: UpdatePrenotazioneDtoReq;
};
export type RicercaPrenotazioniApiResponse =
  /** status 200 OK */ PrenotazioneDtoRes[];
export type RicercaPrenotazioniApiArg = {
  ricercaPrenotazioneDto: RicercaPrenotazioneDto;
};
export type CreatePrenotazioneApiResponse =
  /** status 200 OK */ PrenotazioneDtoRes;
export type CreatePrenotazioneApiArg = {
  authorization: string;
  prenotazioneDtoReq: PrenotazioneDtoReq;
};
export type RegisterApiResponse = /** status 200 OK */ RegisterResponse;
export type RegisterApiArg = {
  registerRequest: RegisterRequest;
};
export type AuthenticateApiResponse =
  /** status 200 OK */ AuthenticationResponse;
export type AuthenticateApiArg = {
  authenticationRequest: AuthenticationRequest;
};
export type GetUtenteApiResponse = /** status 200 OK */ UtenteDto;
export type GetUtenteApiArg = {
  cf: string;
};
export type GetSlotApiResponse = /** status 200 OK */ SlotDto;
export type GetSlotApiArg = {
  id: number;
};
export type GetServizioApiResponse = /** status 200 OK */ ServizioDto;
export type GetServizioApiArg = {
  id: number;
};
export type GetServiziApiResponse = /** status 200 OK */ ServizioDto[];
export type GetServiziApiArg = void;
export type GetPrenotazioneApiResponse =
  /** status 200 OK */ PrenotazioneDtoRes;
export type GetPrenotazioneApiArg = {
  id: number;
};
export type RefreshTokenApiResponse =
  /** status 200 OK */ AuthenticationResponse;
export type RefreshTokenApiArg = {
  authorizationrest: string;
};
export type GetOperatoreFromTokenApiResponse = /** status 200 OK */ Operatore;
export type GetOperatoreFromTokenApiArg = {
  authorization: string;
};
export type CheckMatricolaApiResponse = /** status 200 OK */ boolean;
export type CheckMatricolaApiArg = {
  matricola: string;
};
export type UtenteDto = {
  codiceFiscale?: string;
  nome?: string;
  cognome?: string;
  numeroTelefono?: string;
  email?: string;
};
export type SlotDto = {
  inizio?: string;
  fine?: string;
  prenotati?: number;
};
export type ServizioDto = {
  id?: number;
  descrizione?: string;
  costoMedio?: number;
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
  credentialsNonExpired?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
};
export type Servizio = {
  id?: number;
  descrizione?: string;
  costoMedio?: number;
  deleted?: boolean;
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
export type UpdatePrenotazioneDtoReq = {
  prenotazioneId?: number;
  dataAppuntamento?: string;
  statoPrenotazione?:
    | "BOOKED"
    | "CONFIRMED"
    | "CANCELLED_AUTO"
    | "CANCELLED_USER"
    | "COMPLETED"
    | "NO_SHOW";
  semaforoUrgenza?: "VERDE" | "GIALLO" | "ROSSO";
  matricolaOperatore?: string;
  idServizio?: number;
};
export type RicercaPrenotazioneDto = {
  dataInizio?: string;
  dataFine?: string;
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
  idServizio?: number;
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
  idServizio?: number;
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
export const {
  useRispondiDaLinkQuery,
  useLazyRispondiDaLinkQuery,
  useRispondiMutation,
  useUpdateUtenteMutation,
  useRicercaUtentiMutation,
  useCreateUtenteMutation,
  useGetSlotsMutation,
  useGeneraSlotsMutation,
  useUpdateServizioMutation,
  useCreateServizioMutation,
  useDeleteServizioMutation,
  useUpdateStatoPrenotazioneMutation,
  useModificaPrenotazioneMutation,
  useRicercaPrenotazioniMutation,
  useCreatePrenotazioneMutation,
  useRegisterMutation,
  useAuthenticateMutation,
  useGetUtenteQuery,
  useLazyGetUtenteQuery,
  useGetSlotQuery,
  useLazyGetSlotQuery,
  useGetServizioQuery,
  useLazyGetServizioQuery,
  useGetServiziQuery,
  useLazyGetServiziQuery,
  useGetPrenotazioneQuery,
  useLazyGetPrenotazioneQuery,
  useRefreshTokenQuery,
  useLazyRefreshTokenQuery,
  useGetOperatoreFromTokenQuery,
  useLazyGetOperatoreFromTokenQuery,
  useCheckMatricolaQuery,
  useLazyCheckMatricolaQuery,
} = injectedRtkApi;
