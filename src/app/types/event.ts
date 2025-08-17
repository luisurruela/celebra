export interface Event {
  createdAt: Date;
  fecha: string;
  id?: string;
  lugarCeremonia: string;
  lugarRecepcion: string;
  nombresNovios?: string;
  nombreFestejado?: string;
  status: string;
  template: string;
}
