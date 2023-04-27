import {DocumentReference} from "@angular/fire/compat/firestore";

interface Manager {
  userId: string,
  name: string
}

export interface Game {
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

}
