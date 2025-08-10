import { addDoc, collection } from "firebase/firestore";

// src/pages/api/rsvp.js
import { db } from "../../firebase/config";

export const prerender = false;

export async function POST({ request }) {
  const { name, guests } = await request.json();

  try {
    await addDoc(collection(db, "RSVPs"), {
      name,
      guests,
      timestamp: new Date(),
    });
    return new Response(JSON.stringify({ message: "Confirmación exitosa!" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error al confirmar", error: error.message }),
      { status: 500 }
    );
  }
}