import React, {useEffect} from "react";
import {Outlet} from "react-router";
import useAuthHook from "../../hooks/auth/auth.hook";
import useNavigationHook from "../../shared/navigation";
import {EnumRoutes} from "lib-ts-bl/dist";

const BasePrivateRouteUser: React.FC = (): React.ReactElement => {
  const { isLogged } = useAuthHook();
  //const {userInfoResponse}=useUserHook()
  const { redirectToPage } = useNavigationHook();
  useEffect(() => {
    if (!isLogged /*&& userInfoResponse?.fkRole?.code !== "USER"*/) {
      redirectToPage(EnumRoutes.LOGIN);
    }
  }, [isLogged]);

  return <Outlet />;
};

export default BasePrivateRouteUser;
