import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, redirect} from "react-router-dom";
import "./dashboard.css";
import { auth, db, logout } from "../Firebase/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {


    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    async function handleLogOut() {
        try {
            await logout()
            navigate('/login')
        }catch(err) {
            console.log(err);
        }
        

         
        
    }

    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            console.log(doc.docs.length);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (loading) return;

        if (!user) return navigate("/login");
        fetchUserName();
    }, [user, loading]);

    

    return (
        <div className="dashboard">
        <div className="dashboard__container">
            <h1>Profile</h1>
            <div className="name">
                <h3>Name</h3>
                {name}
            </div>
            <div className="email">
                <h3>Email</h3>
                {user.email}
            </div>
            
            <button className="dashboard__btn" onClick={handleLogOut}>
            Logout
            </button>
        </div>
        </div>
    );
}
export default Dashboard;