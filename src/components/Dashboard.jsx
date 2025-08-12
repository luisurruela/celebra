import { collection, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { app } from "../firebase/config";

const auth = getAuth(app);
const db = getFirestore(app);

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Escuchar el estado de autenticación y los eventos
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log("Estado de autenticación:", currentUser);
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);

        // Una vez que el usuario está autenticado, escuchar sus eventos
        const q = query(
          collection(db, `users/${currentUser.uid}/events`),
          orderBy("createdAt", "desc")
        );

        const unsubscribeEvents = onSnapshot(
          q,
          (snapshot) => {
            const eventsList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setEvents(eventsList);
            setEventsLoading(false);
          },
          (error) => {
            console.error("Error fetching events:", error);
            setEventsLoading(false);
          }
        );

        return () => unsubscribeEvents();
      } else {
        // Redirigir si el usuario no está autenticado
        window.location.href = "/login";
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCreateEvent = () => {
    window.location.href = "/dashboard/nuevo-evento";
  };

  // Función para obtener el nombre del evento
  const getEventName = (event) => {
    if (event.template === "boda") {
      return `Boda de ${event.nombresNovios}`;
    }
    if (event.template === "cumpleanios") {
      return `Cumpleaños de ${event.nombreFestejado}`;
    }
    return "Evento sin nombre";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-montserrat">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-80 bg-white shadow-md p-6 hidden md:block">
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

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <h1 className="text-2xl font-playfair font-bold text-purple-600">
            {events.length > 0 ? "Mis Eventos" : "Dashboard"}
          </h1>
          <div className="flex items-center space-x-4">
            {events.length > 0 && (
              <button
                onClick={handleCreateEvent}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 font-montserrat hidden md:block"
              >
                Crear evento
              </button>
            )}
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
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {eventsLoading ? (
            <div className="p-12 bg-white rounded-lg shadow-md text-center">
              <p className="text-gray-600 font-montserrat">
                Cargando eventos...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 bg-white rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
                ¡Aún no tienes eventos!
              </h2>
              <p className="text-gray-600 font-montserrat mb-6">
                Empieza creando tu primera invitación para celebrar esa ocasión
                especial.
              </p>
              <button
                onClick={handleCreateEvent}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 font-montserrat"
              >
                Crear evento
              </button>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-montserrat font-bold text-gray-500 uppercase tracking-wider"
                      >
                        Evento
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-montserrat font-bold text-gray-500 uppercase tracking-wider"
                      >
                        Plantilla
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-montserrat font-bold text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-montserrat">
                          {getEventName(event)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat capitalize">
                          {event.template}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat capitalize">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {event.status === "draft"
                              ? "Borrador"
                              : "Publicado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={`/dashboard/eventos/${event.id}`}
                            className="text-purple-600 hover:text-purple-900 font-montserrat"
                          >
                            Detalles
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
