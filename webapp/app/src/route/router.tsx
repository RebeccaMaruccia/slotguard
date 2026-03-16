import {createBrowserRouter} from "react-router";
import {lazy} from "react";
import {EnumRoutes} from "lib-ts-bl/dist";
import {environment} from "../shared/environment";

const BaseLayout = lazy(() => import("../components/layout/BaseLayout"));
const BasePrivateRouteUser = lazy(
  () => import("../components/layout/BasePrivateRouteUser"),
);
const LoginPage = lazy(() => import("../page/auth/login/view/login.page.view"));
const DashboardPersonal = lazy(
  () => import("../page/dashboard/dashboard.page.view"),
);
const AppointmentsPage = lazy(
  () => import("../page/appointments/appointments.page.view"),
);
const UsersPage = lazy(
  () => import("../page/users/users.page.view"),
);
const ServicesPage = lazy(
  () => import("../page/services/services.page.view"),
);
const StatisticsPage = lazy(
  () => import("../page/statistics/statistics.page.view"),
);

export const router = createBrowserRouter([
  {
    path: environment.route.baseRoute,
    element: <BaseLayout />,
    children: [
      {
        path: EnumRoutes.LOGIN,
        element: <LoginPage />,
      },
      /*{
                path: EnumRoutes.REGISTER,
                element: <RegistrationPage/>
            },*/
      {
        element: <BasePrivateRouteUser />,
        children: [
          {
            path: EnumRoutes.DASHBOARD,
            element: <DashboardPersonal />,
          },
          {
            path:EnumRoutes.APPOINTMENTS,
            element: <AppointmentsPage/>
          },
          {
            path:EnumRoutes.USERS,
            element: <UsersPage/>
          },
          {
            path:EnumRoutes.SERVICES,
            element: <ServicesPage/>
          },
          {
            path:EnumRoutes.STATISTICS,
            element: <StatisticsPage/>
          }
        ],
      },
    ],
  },
]);
