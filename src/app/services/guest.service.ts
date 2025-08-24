import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';
import { Auth, user, User } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

import { Guest } from '../types/event';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  userId: string | null = null;
  constructor(private afs: Firestore, private auth: Auth) {
    this.getUserAuth().subscribe((user) => {
      this.userId = user ? user.uid : null;
    });
  }
  
  public getUserAuth(): Observable<User | null> {
    return user(this.auth);
  }

  private guestsColRef(userId: string, eventId: string) {
    return collection(this.afs, `users/${userId}/events/${eventId}/guests`);
  }

  list(eventId: string): Observable<Guest[]> {
  if (this.userId) {
    const q = query(this.guestsColRef(this.userId, eventId), orderBy('name', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Guest[]>;
  }

  return this.getUserAuth().pipe(
    switchMap(user => {
      this.userId = user?.uid ?? null;
      if (!this.userId) return of([]);
      const q = query(this.guestsColRef(this.userId, eventId), orderBy('name', 'asc'));
      return collectionData(q, { idField: 'id' }) as Observable<Guest[]>;
    })
  );
}

  async create(eventId: string, guest: Guest) {
    return addDoc(this.guestsColRef(this.userId!, eventId), guest);
  }

  async update(eventId: string, guestId: string, partial: Partial<Guest>) {
    const ref = doc(this.afs, `users/${this.userId}/events/${eventId}/guests/${guestId}`);
    return updateDoc(ref, partial as any);
  }

  async remove(eventId: string, guestId: string) {
    const ref = doc(this.afs, `users/${this.userId!}/events/${eventId}/guests/${guestId}`);
    return deleteDoc(ref);
  }

}
