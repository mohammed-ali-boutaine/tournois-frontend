import { useEffect } from "react";
import {useNavigate} from "react-router-dom"
function PrivateRoute({ children }) {
     const token = localStorage.getItem('token');
     const navigate = useNavigate();
     
     useEffect(() => {
       if (!token) {
         navigate('/login');
       }
     }, [token, navigate]);
     
     return token ? children : null;
   }

   export {PrivateRoute};