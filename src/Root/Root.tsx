import { Outlet, ScrollRestoration } from "react-router";
import Footer from "../Component/SharedComponent/Footer";
import { Navbar } from "../Component/SharedComponent/Navbar";
import { Toaster } from "react-hot-toast";


const Root = () => {
    return (
        <div>
            <ScrollRestoration />
            <Toaster></Toaster>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;
