import { createBrowserRouter } from "react-router";
import Root from "./Root/Root";
import Home from "./Pages/Home/Home";
import About from "./Pages/About";
import SignUp from "./Pages/Authentication/SignUp";
import SignIn from "./Pages/Authentication/SignIn";
import Services from "./Pages/Services";
import Process from "./Pages/Process";
import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoutes/PrivateRoute";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            { index: true, Component: Home },
            { path: "/about", Component: About },
            { path: "/services", Component: Services },
            { path: "/process", Component: Process },
        ]
    },
    {
        path: "/sign-up",
        Component: SignUp
    },
    {
        path: "/sign-in",
        Component: SignIn
    },
    {
        path: "/login",
        Component: SignIn
    },
    // dashboard
    {
        path: "/admin",
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>
    }

]);
export default router;
