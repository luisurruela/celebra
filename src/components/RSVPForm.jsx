import { useState } from "react";

export default function RSVPForm() {
  const [nombre, setNombre] = useState("");
  const [asistentes, setAsistentes] = useState(1);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Confirmación recibida: ${nombre}, ${asistentes} asistentes`);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">
          ¡Gracias por confirmar! Te esperamos.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto"
    >
      <div className="mb-4">
        <label
          htmlFor="nombre"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Tu nombre:
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="asistentes"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Número de asistentes:
        </label>
        <input
          type="number"
          id="asistentes"
          value={asistentes}
          onChange={(e) => setAsistentes(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          min="1"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Confirmar
        </button>
      </div>
    </form>
  );
}
