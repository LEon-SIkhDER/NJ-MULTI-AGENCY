import { createBrowserRouter } from "react-router";
import Root from "./Root/Root";
import Banner from "./Pages/Home/Banner";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            { index: true, Component: Banner }
        ]
    },
]);
export default router