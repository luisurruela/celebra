import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { app } from "../firebase/config";

// Inicializa Firestore
const db = getFirestore(app);
const auth = getAuth(app);

// Definimos los templates disponibles y sus campos
const templates = {
  boda: {
    title: "Boda",
    fields: [
      { name: "nombresNovios", label: "Nombres de los Novios", type: "text" },
      { name: "fecha", label: "Fecha de la Boda", type: "date" },
      { name: "lugarCeremonia", label: "Lugar de la Ceremonia", type: "text" },
      { name: "lugarRecepcion", label: "Lugar de la Recepción", type: "text" },
    ],
  },
  cumpleanios: {
    title: "Cumpleaños",
    fields: [
      { name: "nombreFestejado", label: "Nombre del Festejado", type: "text" },
      { name: "edad", label: "Edad", type: "number" },
      { name: "fecha", label: "Fecha del Cumpleaños", type: "date" },
      { name: "lugar", label: "Lugar de la Fiesta", type: "text" },
    ],
  },
};

export default function NewEventForm() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Aseguramos que el usuario esté autenticado antes de renderizar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirigir al login si no hay usuario
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para manejar el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para guardar el evento en Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Usuario no autenticado.");
      setLoading(false);
      return;
    }

    // Validar que se haya seleccionado un template
    if (!selectedTemplate) {
      setError("Por favor, selecciona una plantilla.");
      setLoading(false);
      return;
    }

    try {
      // Usar la jerarquía de Firestore para guardar el evento bajo el usuario
      const eventsCollection = collection(db, "users", user.uid, "events");
      await addDoc(eventsCollection, {
        ...formData,
        template: selectedTemplate,
        status: "draft",
        createdAt: serverTimestamp(),
      });

      // Redirigir al dashboard después de guardar
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error al guardar el evento:", err);
      setError("Ocurrió un error al guardar el evento. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-playfair font-bold text-center text-gray-800 mb-8">
          Crear Nuevo Evento
        </h1>

        {/* Sección de selección de plantilla */}
        {!selectedTemplate && (
          <div className="text-center">
            <h2 className="text-2xl font-montserrat font-semibold text-gray-700 mb-4">
              Paso 1: Elige una plantilla
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.keys(templates).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold py-6 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                  <span className="block text-xl font-playfair">
                    {templates[key].title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Formulario dinámico */}
        {selectedTemplate && (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-montserrat font-semibold text-gray-700">
                Paso 2: Detalles del evento ({templates[selectedTemplate].title}
                )
              </h2>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="text-purple-600 hover:underline"
              >
                Cambiar plantilla
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {templates[selectedTemplate].fields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 font-montserrat"
                    htmlFor={field.name}
                  >
                    {field.label}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-center my-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`mt-8 w-full font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:scale-105"
              } text-white font-montserrat`}
            >
              {loading ? "Guardando..." : "Guardar Evento"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
