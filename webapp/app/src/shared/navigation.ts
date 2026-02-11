import {NavigateFunction, useLocation, useNavigate} from "react-router";
import {useAppDispatch} from "../store/hook";
import {environment} from "./environment";
import {EnumRoutes} from "lib-ts-bl/src";


type Path = string | EnumRoutes;

const useNavigationHook = () => {

    const navigate = useNavigate();
    const {pathname} = useLocation();
    const dispatch = useAppDispatch();
    const getFullPath = (pathname: Path | undefined | null): string => {
        return getPath(environment.route.baseRoute, true) + getPath(pathname, false);
    };

    const getPath = (pathname: Path | undefined | null, startsWithSlash: boolean = true): string => {
        if (pathname && pathname.length > 0) {
            if (startsWithSlash && pathname[0] !== "/") {
                pathname = "/" + pathname;
            }
            if (!startsWithSlash && pathname[0] === "/") {
                pathname = pathname.replace("/", "");
            }
        }
        return pathname ?? "";
    };

    const redirectToPage = <T extends object>(navigate: NavigateFunction, page: Path, id?: string | number, navigationState?: T): void => {
        if (id) {
            page = page.replace(":id", id.toString());
        }
        navigate(getFullPath(page), {state: navigationState});
    };

    const checkIfIsCurrentPage = (pathname: Path, paths: Path | Path[]): boolean => {
        pathname = pathname.replace(environment.route.baseRoute, "");
        let pathsRef: string[] = [];
        if (typeof paths === "string") {
            pathsRef = [paths];
        } else {
            pathsRef = paths;
        }
        return pathsRef
            .some((elem) => {
                return getPath(pathname, false) === getPath(elem, false);
            });
    };


    const navigateBack = (): void => {
        navigate(-1);
    };

    return {

        navigateBack,
        redirectToPage: <T extends object>(page: Path, id?: string | number, otherParams?: T) => redirectToPage(navigate, page, id, otherParams),
        checkIfIsCurrentPage: (paths: Path | Path[]) => checkIfIsCurrentPage(pathname, paths),
        getPath: getPath,
        getFullPath: getFullPath

    };
};

export default useNavigationHook;
