import { Outlet } from "react-router";
import Footer from "../Component/SharedComponent/Footer";
import { Navbar } from "../Component/SharedComponent/Navbar";


const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;
