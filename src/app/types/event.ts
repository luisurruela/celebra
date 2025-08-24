export interface Event {
  createdAt: Date;
  fecha: string;
  id?: string;
  lugarCeremonia: string;
  lugarRecepcion: string;
  nombresNovios?: string;
  nombreFestejado?: string;
  lugar?: string;
  status: string;
  template: string;
  guests: Guest[];
}

export interface Guest {
  id?: string;
  name: string;
  allowed: number;
  email?: string;
  phone?: string;
  confirmed: GuestStatus;
}

export enum GuestStatus {
  Pending = 'pending',   // aún no confirma
  Confirmed = 'confirmed', // confirmó que asistirá
  Declined = 'declined', // dijo que no asistirá
}