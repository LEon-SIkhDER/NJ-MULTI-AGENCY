import { Link } from "react-router";
import logo from "../assets/logo.png";



const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group" onClick={() => window.location.reload()}>
            <img src={logo} alt="NJ Multi Agency" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-md object-cover ring-1 ring-white/10 shadow-[0_0_20px_-6px_var(--primary-glow)]" />
            <span className="font-display font-bold tracking-tight text-sm sm:text-base md:text-lg">
                NJ Multi Agency
            </span>
        </Link>
    );
};

export default Logo;
