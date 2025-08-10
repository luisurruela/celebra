import { useState } from "react";

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, guests }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la confirmación');
      }

      setSent(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (sent) {
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
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Tu name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
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
