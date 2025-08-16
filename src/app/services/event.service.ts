import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Auth, user, User } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import { Event } from '../types/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  /**
   * Obtiene todos los eventos del usuario actual en tiempo real.
   * @returns Un Observable con la lista de eventos.
   */
  getEvents(): Observable<Event[]> {
    return user(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          // If the user is not logged in, return an empty Observable
          return new Observable<Event[]>();
        }
        
        // Get the current user's events collection
        const eventsCollection = collection(this.firestore, `users/${user.uid}/events`);
        
        // Return an observable with the collection data
        return collectionData(eventsCollection, { idField: 'id' }) as Observable<Event[]>;
      })
    );
  }

  /**
   * Adds a new event for the current user.
   * @param newEvent The event data to be added.
   * @returns A promise that resolves when the event is added.
   */
  async addEvent(newEvent: Event): Promise<void> {
    const currentUser: User | null = await firstValueFrom(user(this.auth));
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }
    const eventsCollection = collection(this.firestore, `users/${currentUser.uid}/events`);
    await setDoc(doc(eventsCollection), newEvent);
  }

  /**
   * Gets the data of a specific event by its ID.
   * @param eventId The ID of the event to retrieve.
   * @returns A promise that resolves with the event data or null if not found.
   */
  async getEventById(eventId: string): Promise<Event | null> {
    const currentUser: User | null = await firstValueFrom(user(this.auth));
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }
    const eventDoc = doc(this.firestore, `users/${currentUser.uid}/events/${eventId}`);
    const docSnap = await getDoc(eventDoc);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() as Event };
    } else {
      return null;
    }
  }

  /**
   * Updates an existing event.
   * @param event The event data to update.
   * @returns A promise that resolves when the event is updated.
   */
  async updateEvent(event: Event): Promise<void> {
    const currentUser: User | null = await firstValueFrom(user(this.auth));
    if (!currentUser || !event.id) {
      throw new Error('User not authenticated or event ID not provided.');
    }
    const { id, ...eventData } = event; // Extracts the id and the rest of the data
    const eventDoc = doc(this.firestore, `users/${currentUser.uid}/events/${id}`);
    await updateDoc(eventDoc, eventData);
  }

  /**
   * Deletes an existing event.
   * @param eventId The ID of the event to delete.
   * @returns A promise that resolves when the event is deleted.
   */
  async deleteEvent(eventId: string): Promise<void> {
    const currentUser: User | null = await firstValueFrom(user(this.auth));
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }
    const eventDoc = doc(this.firestore, `users/${currentUser.uid}/events/${eventId}`);
    await deleteDoc(eventDoc);
  }
}
