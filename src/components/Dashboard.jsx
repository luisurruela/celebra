import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { app } from "../firebase/config";

const auth = getAuth(app);

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-montserrat">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <nav className="mt-8">
          <a
            href="/dashboard"
            className="flex items-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 font-montserrat p-3 rounded-lg transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Eventos
          </a>
        </nav>
      </aside>

      <div className="w-full flex flex-col">        
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-playfair font-bold text-purple-600">Celebra</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-montserrat">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <span className="text-gray-700 hidden md:block font-montserrat">
                {user.email}
              </span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-20">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-montserrat"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-8">
          <div className="p-12 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
              ¡Aún no tienes eventos!
            </h2>
            <p className="text-gray-600 font-montserrat mb-6">
              Empieza creando tu primera invitación para celebrar esa ocasión
              especial.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 font-montserrat">
              Crear evento
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
