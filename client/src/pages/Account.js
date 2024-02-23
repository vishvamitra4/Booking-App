import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

function Account() {
    const { user, ready , setUser} = useContext(UserContext);
    const [redirect , setRedirect] = useState(false);
    let { subpage } = useParams();
    if(subpage == undefined){
        subpage = "profile";
    }


    if (ready && !user) {
        <Navigate to={'/login'} />
    };
    if (!ready) {
        return <div>Loading....</div>
    }

    function linkClass(type) {
        let D = "py-2 px-6";
        if (type === subpage) {
            D += " bg-primary text-white rounded-full";
        };

        return D;
    }

    const logout = async (e)=>{
        e.preventDefault();
        await axios.post("/logout");
        setRedirect(true);
        setUser(null);
    }

    if(ready && !user &&redirect){
        return <Navigate to={"/"} />
    }




    return (
        <div>
            <nav className="w-full flex mt-8 mb-8 gap-2 justify-center">
                <Link className = {linkClass("profile")} to={'/account'}>My profile</Link>
                <Link className={linkClass("bookings")} to={'/account/bookings'}>My bookings</Link>
            <Link className={linkClass("places")} to={'/account/places'}>My accomodations</Link>
        </nav>
        {
            (subpage === "profile") && (
                <div className="text-center mx-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )
        }
        </div >
    );
};

export default Account;