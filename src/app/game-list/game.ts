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
  manager: Manager
}

export type RsvpStatus = 'pending'|'confirmed'|'declined'
export interface PlayerAttendance {
  id: string
  status: RsvpStatus,
  playerId: string
  gameId: string
}

export interface Player {
  claimed: boolean;
  id: string
  name: string
  email: string
}
