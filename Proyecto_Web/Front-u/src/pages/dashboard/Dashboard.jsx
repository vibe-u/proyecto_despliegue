import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("usuario");
    const [isLoading, setIsLoading] = useState(true);
    const [quote, setQuote] = useState(""); // Estado para la frase motivadora
    const toastShown = useRef(false); // <-- persiste entre renders

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/");
    };

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return setIsLoading(false);

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/perfil`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data && response.data.nombre) {
                    setUserName(response.data.nombre);
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        //API pública de la frase
        const fetchQuote = async () => {
            try {

                const response = await axios.get("https://zenquotes.io/api/random");
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const frase = response.data[randomIndex].text;
                const autor = response.data[randomIndex].author || "Anónimo";
                setQuote(`"${frase}" — ${autor}`);
            } catch (error) {
                console.error("Error al obtener la frase motivadora:", error);
            }
        };
        fetchUserName();
        fetchQuote();

        const token = localStorage.getItem('token');
        if (token && !toastShown.current) {
            toastShown.current = true;
            setTimeout(() => {
                toast.success("Inicio de sesión exitoso 🎉", {
                    position: "top-right",
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                    draggable: false
                });
            }, 0);
        }

    }, []);

    return (
        <section className="dashboard-section">
            <ToastContainer position="top-right" autoClose={4000} />

            <div className="dashboard-header">
                <div className="logout-container">
                    <button className="logout-btn" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>

                {isLoading ? (
                    <h2>Cargando...</h2>
                ) : (
                    <h2>¡Bienvenido de nuevo, {userName}!!</h2>
                )}

                <p>Explora lo mejor de tu comunidad universitaria.</p>
                {/* Frase motivadora */}
                {quote && (
                    <div className="motivational-quote" data-aos="fade-up">
                        <p>{quote}</p>
                    </div>
                )}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card events-card" data-aos="fade-up">
                    <h3 className="card-title">Eventos en tu U 🎉</h3>
                    <p>Descubre los próximos eventos en tu campus y únete a la diversión.</p>
                    <button className="dashboard-btn">Ver Eventos</button>
                </div>
                <div className="dashboard-card groups-card" data-aos="fade-up" data-aos-delay="200">
                    <h3 className="card-title">Grupos y Comunidades 🤝</h3>
                    <p>Encuentra tu tribu. Únete a clubes y comunidades con tus mismos intereses.</p>
                    <button className="dashboard-btn">Explorar Grupos</button>
                </div>
                <div className="dashboard-card matches-card" data-aos="fade-up" data-aos-delay="400">
                    <h3 className="card-title">Tus Posibles Matches 💖</h3>
                    <p>Conecta con estudiantes que comparten tu Vibe y tus metas académicas.</p>
                    <button className="dashboard-btn" onClick={() => navigate("/matches")}>
                        Ver Matches
                    </button>

                </div>
            </div>
        </section>
    );
};

export default Dashboard;
