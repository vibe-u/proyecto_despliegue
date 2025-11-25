// src/routes/PrivateRouter.jsx
import { Navigate, Outlet } from "react-router";
import storeAuth from "../context/storeAuth";

const PrivateRoute = () => {
  const token = storeAuth((state) => state.token);

  // ❌ Si NO hay token → No puede pasar
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✔️ Si hay token → Mostrar rutas protegidas
  return <Outlet />;
};

export default PrivateRoute;
