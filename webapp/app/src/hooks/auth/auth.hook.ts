import {AuthenticationRequest, RefreshTokenApiArg, slotGuardServiceApiBase} from "api-service";
import {loginReset, loginSet, SessionStorageType, userLogged,} from "lib-ts-bl/dist/reducers/auth";
import {useAppDispatch, useAppSelector} from "../../store/hook";
import useNavigationHook from "../../shared/navigation";
import {environment} from "../../shared/environment";
import {EnumRoutes} from "lib-ts-bl/dist";

const useAuthHook = () => {
  const dispatch = useAppDispatch();
  const isLogged: boolean = useAppSelector(userLogged) ?? false;
  const [setLogin, { isLoading: loginLoading }] =
    slotGuardServiceApiBase.useAuthenticateMutation();
  const { redirectToPage } = useNavigationHook();

  const login = async (loginDto: AuthenticationRequest) => {
    sessionStorage.clear();
    await setLogin({ authenticationRequest: loginDto }).then((resp) => {
      if (resp.data && resp.data.accessToken && resp.data.accessToken !== "") {
        dispatch(
          loginSet({
            accessToken: resp.data.accessToken ?? "",
            refreshToken: resp.data.refreshToken ?? "",
            cookiePrefix: environment.cookie.prefix,
            expiresIn: resp.data.expiresIn ?? 0,
            scope: "",
            storageType: environment.cookie.storageType as SessionStorageType,
            loginType: "internal",
          }),
        );
        redirectToPage(EnumRoutes.DASHBOARD);
      }
    });
  };
  const logOut = async () => {
    dispatch(loginReset({}));
    redirectToPage(EnumRoutes.LOGIN);
  };


   const [refreshTokenGet, {
        data: refreshTokenResponse,
        isLoading: refreshTokenLoading,
        isError: refreshTokenError,
        reset: refreshTokenReset
    }] = slotGuardServiceApiBase.useLazyRefreshTokenQuery();

  const refreshTokenGetPrivate = (refreshToken: string) => {
    console.log("refreshTokenGetPrivate  " + refreshToken);

    if (refreshTokenLoading === false) {
      let header: RefreshTokenApiArg = {
        authorizationrest: refreshToken,
      };
      refreshTokenGet(header);
    }
  };
  return {
    isLoading: loginLoading,
    login,
    isLogged,
    logOut,
    refreshTokenGet : refreshTokenGetPrivate, refreshTokenResponse, refreshTokenLoading, refreshTokenError, refreshTokenReset
  };
};
export default useAuthHook;
