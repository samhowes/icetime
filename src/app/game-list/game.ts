import {Obj} from "../../lib/obj";

export interface League {
  id: string
  name: string
  commissionerId: string
}

export interface PlayerInvite {
  id: string
  name: string
  email: string
  leagueId: string
  invitedById: string
  invitedAt?: string
  declinedAt?: string
  registeredAt?: string
  userId?: string
}

export interface PlayerRegistration {
  id: string
  inviteId: string
  playerId: string
  status: 'approved'|'declined'
}

export class SkillLevel {
  static sub = new SkillLevel('sub', 'Substitute')
  static regular = new SkillLevel('regular', 'Regular')

  constructor(
    public id: string,
    public name: string
  ) {
  }
}

export class Position {
  static goalie = new Position('goalie', 'Goalie')
  static skater = new Position('skater', 'Skater')
  constructor(
    public id: string,
    public name: string
  ) {
  }
}

export interface Player {
  id: string
  name: string
  email: string
  inviteId: string
  leagues: Obj<boolean> // map of league id to approved or declined
  skillLevel: string
  position: string
}

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

export interface OldPlayer {
  claimed: boolean;
  id: string
  name: string
  email: string
}
