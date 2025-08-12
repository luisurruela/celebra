import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { app } from "../firebase/config";

// Inicializar servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);

export default function EventDetails({ eventId }) {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // useEffect para manejar el estado de autenticación y cargar el evento
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Verifica si el eventId existe antes de buscar
        if (eventId) {
          const fetchEvent = async () => {
            try {
              const eventDocRef = doc(
                db,
                `users/${currentUser.uid}/events`,
                eventId
              );
              const eventDoc = await getDoc(eventDocRef);

              if (eventDoc.exists()) {
                setEvent({ id: eventDoc.id, ...eventDoc.data() });
                setFormData(eventDoc.data());
              } else {
                console.error("No such document!");
                setEvent(null);
              }
            } catch (error) {
              console.error("Error fetching event:", error);
            } finally {
              setLoading(false);
            }
          };
          fetchEvent();
        } else {
          console.error("Event ID not provided.");
          setLoading(false);
        }
      } else {
        window.location.href = "/login";
      }
    });

    return () => unsubscribeAuth();
  }, [eventId]); // Ahora depende del eventId

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !event) return;

    try {
      const eventDocRef = doc(db, `users/${user.uid}/events`, event.id);
      await updateDoc(eventDocRef, formData);
      setEvent({ ...event, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async () => {
    if (!user || !event) return;

    try {
      const eventDocRef = doc(db, `users/${user.uid}/events`, event.id);
      await deleteDoc(eventDocRef);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Función para obtener el nombre del evento
  const getEventName = (event) => {
    if (!event) return "Cargando...";
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

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-montserrat">
        <p className="text-gray-600">Evento no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-playfair font-bold text-gray-800">
            {getEventName(event)}
          </h1>
          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 font-montserrat mr-2"
              >
                Editar
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 font-montserrat"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(event);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 font-montserrat"
                >
                  Cancelar
                </button>
              </div>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 font-montserrat"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-montserrat font-bold text-gray-700 mb-4">
            Información del Evento
          </h2>
          {isEditing ? (
            <form onSubmit={handleSave}>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 font-montserrat capitalize"
                    htmlFor={key}
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
                    id={key}
                    name={key}
                    type={key.includes("fecha") ? "date" : "text"}
                    value={value || ""}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </form>
          ) : (
            <div>
              {Object.entries(event).map(([key, value]) => {
                if (["id", "createdAt", "template"].includes(key)) return null;
                return (
                  <div key={key} className="mb-2">
                    <p className="text-gray-700 font-bold font-montserrat capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </p>
                    <p className="text-gray-600 font-montserrat">
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sección de RSVP (Placeholder) */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-montserrat font-bold text-gray-700 mb-4">
            Confirmaciones de Asistencia (RSVP)
          </h2>
          <p className="text-gray-600 font-montserrat">
            Aquí se mostrarán las confirmaciones de asistencia una vez que los
            invitados respondan.
          </p>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold font-montserrat mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6 font-montserrat">
              ¿Estás seguro de que quieres eliminar este evento? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
