import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";

import { app } from "../firebase/config";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/dashboard";
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 border rounded-lg shadow-lg bg-white w-full">
      <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
        {isNewUser ? "Crea tu Cuenta" : "Inicia Sesión"}
      </h2>
      {error && (
        <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
      )}

      <form onSubmit={handleEmailSignIn}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 font-montserrat"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 font-montserrat"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 w-full font-montserrat"
        >
          {isNewUser ? "Crear Cuenta" : "Iniciar Sesión"}
        </button>
      </form>

      <div className="my-6 text-center text-gray-400 font-montserrat">
        — O —
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 w-full flex items-center justify-center font-montserrat"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.65 12.01c0-.78-.07-1.5-.2-2.2H12.01v4.18h5.92c-.27 1.44-1.04 2.65-2.22 3.44v2.7h3.48c2.04-1.88 3.23-4.75 3.23-8.12z" />
          <path d="M12.01 22c3.2 0 5.86-1.05 7.82-2.85l-3.48-2.7c-1.02.7-2.31 1.1-3.69 1.1-2.84 0-5.26-1.92-6.13-4.5H2.3v2.7C4.1 20.08 7.7 22 12.01 22z" />
          <path d="M5.88 13.91c-.24-.7-.38-1.44-.38-2.19s.14-1.49.38-2.19V6.9h-3.48c-.96 1.9-1.5 4-1.5 6.2s.54 4.3 1.5 6.2l3.48-2.7z" />
          <path d="M12.01 6.38c1.64 0 3.1.66 4.25 1.66l3.05-3.05C17.86 2.15 15.2 1 12.01 1c-4.31 0-7.91 1.92-9.71 4.9L5.88 9.1c.87-2.58 3.29-4.5 6.13-4.5z" />
        </svg>
        Inicia con Google
      </button>

      <p className="mt-6 text-center text-gray-700 font-montserrat text-sm">
        {isNewUser ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsNewUser(!isNewUser);
          }}
          className="text-purple-600 hover:underline"
        >
          {isNewUser ? "Inicia Sesión" : "Regístrate"}
        </a>
      </p>
    </div>
  );
}
