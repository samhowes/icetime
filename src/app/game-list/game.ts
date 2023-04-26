import {DocumentReference} from "@angular/fire/compat/firestore";

export interface Game {
  id: string,
  name: String,
  players: PlayerAttendance[]
}

export interface PlayerAttendance {
  status: 'pending'|'confirmed'|'declined',
  playerId: DocumentReference
}

export interface Player {
  id: string
  name: string

}
