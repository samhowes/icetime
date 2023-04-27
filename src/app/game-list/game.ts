import {DocumentReference} from "@angular/fire/compat/firestore";

interface Manager {
  userId: string,
  name: string
}

export interface Game {
  description: string;
  date: string,
  startTime: string,
  id: string,
  name: String,
  players: PlayerAttendance[],
  manager: Manager
}

export type RsvpStatus = 'pending'|'confirmed'|'declined'
export interface PlayerAttendance {
  status: RsvpStatus,
  playerId: DocumentReference
}

export interface Player {
  id: string
  name: string
  email: string
}
