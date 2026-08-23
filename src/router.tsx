import { createBrowserRouter } from "react-router";
import Root from "./Root/Root";
import Home from "./Pages/Home/Home";
import About from "./Pages/About";
import SignUp from "./Pages/Authentication/SignUp";
import SignIn from "./Pages/Authentication/SignIn";
import Services from "./Pages/Services";
import Process from "./Pages/Process";
import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
import DashboardHome from "./Pages/Dashboard/Pages/DashboardHome";
import Pitchers from "./Pages/Dashboard/Pages/Pitchers/Pitchers";
import PrivateRoute from "./PrivateRoutes/PrivateRoute";
import PitchersDetails from "./Pages/Dashboard/Pages/Pitchers/PitchersDetails";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "/about", Component: About },
      { path: "/services", Component: Services },
      { path: "/process", Component: Process },
    ],
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
  {
    path: "/sign-in",
    Component: SignIn,
  },
  {
    path: "/login",
    Component: SignIn,
  },
  // Dashboard routes
  //   {
  //     path: "/dashboard",
  //     element: (
  //       <PrivateRoute>
  //         <DashboardLayout />
  //       </PrivateRoute>
  //     ),
  //     children: [
  //       { index: true, Component: DashboardHome },
  //       { path: "pitchers", Component: Pitchers },
  //     ],
  //   },
  // Admin alias routes
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, Component: DashboardHome },
      { path: "pitchers", Component: Pitchers },
      { path: "/admin/pitcher/:id", Component: PitchersDetails },
    ],
  },
]);

export default router;
