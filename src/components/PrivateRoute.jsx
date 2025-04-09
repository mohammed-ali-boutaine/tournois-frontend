import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';


function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;

   }

   export {PrivateRoute};