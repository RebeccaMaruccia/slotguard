import useAuthHook from "../../../../hooks/auth/auth.hook";
import authHook from "../../../../hooks/auth/auth.hook";
import React from "react";

const useHeaderHook = () => {
  const { isLogged, isLoading: isLoadingAuthHook } = useAuthHook();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  //const {userInfoResponse,isLoading:useInfoIsLoading} = useUserHook()
  const { logOut } = authHook();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return {
    isLoading: isLoadingAuthHook,
    //|| useInfoIsLoading,
    isLogged,
    anchorElNav,
    anchorElUser,
    handleOpenNavMenu,
    handleCloseNavMenu,
    handleOpenUserMenu,
    handleCloseUserMenu,
    logOut,
    //userInfoResponse,
  };
};

export default useHeaderHook;
