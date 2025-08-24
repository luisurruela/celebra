import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Auth, user, User } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import { generateUniqueSlug } from '../helpers/slug-generator';
import { Event, Guest } from '../types/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  public getUserAuth(): Observable<User | null> {
    return user(this.auth);
  }

  getEvents(): Observable<Event[]> {
    return this.getUserAuth().pipe(
      switchMap((user) => {
        if (!user) {
          return new Observable<Event[]>();
        }
        const eventsCollection = collection(
          this.firestore,
          `users/${user.uid}/events`
        );
        return collectionData(eventsCollection, {
          idField: 'id',
        }) as Observable<Event[]>;
      })
    );
  }
  
  async addEvent(newEvent: Event): Promise<void> {
    const currentUser: User | null = await firstValueFrom(this.getUserAuth());
    if (!currentUser) throw new Error('User not authenticated.');

    const eventTitle = newEvent.template === 'boda' ? newEvent.nombresNovios : newEvent.nombreFestejado;
    const slug = await generateUniqueSlug(this.firestore, currentUser.uid, 'events', eventTitle || 'evento');

    const eventWithSlug = { ...newEvent, slug };
    const eventsCollection = collection(this.firestore, `users/${currentUser.uid}/events`);
    await addDoc(eventsCollection, eventWithSlug);
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const currentUser: User | null = await firstValueFrom(this.getUserAuth());
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }

    // Referencia al evento
    const eventDocRef = doc(
      this.firestore,
      `users/${currentUser.uid}/events/${eventId}`
    );

    const docSnap = await getDoc(eventDocRef);

    if (!docSnap.exists()) {
      return null;
    }

    // Construir evento base
    const eventData = { id: docSnap.id, ...(docSnap.data() as Event) };

    // Referencia a la subcolección "guests"
    const guestsColRef = collection(
      this.firestore,
      `users/${currentUser.uid}/events/${eventId}/guests`
    );

    const guestsSnap = await getDocs(guestsColRef);
    const guests: Guest[] = guestsSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Guest),
    }));

    // Retornar evento con invitados incluidos
    return {
      ...eventData,
      guests,
    };
  }

  async updateEvent(event: Event): Promise<void> {
    const currentUser: User | null = await firstValueFrom(this.getUserAuth());
    if (!currentUser || !event.id) {
      throw new Error('User not authenticated or event ID not provided.');
    }
    const { id, ...eventData } = event;
    const eventDoc = doc(
      this.firestore,
      `users/${currentUser.uid}/events/${id}`
    );
    await updateDoc(eventDoc, eventData);
  }

  async deleteEvent(eventId: string): Promise<void> {
    const currentUser: User | null = await firstValueFrom(this.getUserAuth());
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }
    const eventDoc = doc(
      this.firestore,
      `users/${currentUser.uid}/events/${eventId}`
    );
    await deleteDoc(eventDoc);
  }
}
