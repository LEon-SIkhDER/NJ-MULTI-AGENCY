import { Menu } from "lucide-react";





const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open ">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-5 ">
                {/* Page content here */}
                <label htmlFor="my-drawer-3" className="btn drawer-button flex-none w-max lg:hidden">
                    <Menu></Menu>
                </label>
                <h1>hello i am sidebar</h1>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><a>Home</a></li>
                    <li><a>Pitchers</a></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;