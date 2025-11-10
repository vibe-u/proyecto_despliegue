import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Gracias from "./pages/gracias/Gracias";
import Perfil from "./pages/perfil/Perfil";
import Contacto from "./pages/contacto/Contacto";
import { useEffect } from "react";
import Eventos from "./pages/eventos/Eventos";
import Beneficios from "./pages/beneficios/Beneficios";
import Dashboard from "./pages/dashboard/Dashboard";
import Matches from "./pages/Matches/Matches";
import AOS from "aos";
import 'aos/dist/aos.css';

function App() {
useEffect(() => {
  AOS.init({ once: true });
}, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="gracias" element={<Gracias />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="beneficios" element={<Beneficios />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="matches" element={<Matches />} />
      </Routes>
      
    </BrowserRouter>

  )
}

export default App;
