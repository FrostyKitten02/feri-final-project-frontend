import {useNavigate} from "react-router-dom";
import SessionUtil from "../../util/SessionUtil";
import {useEffect} from "react";

export const RedirectMain = () => {
    const navigate = useNavigate();
    useEffect(() => {
        SessionUtil.setSidebarSelect("dashboard");
        navigate("/dashboard");
    }, [navigate]);
    return null;
}