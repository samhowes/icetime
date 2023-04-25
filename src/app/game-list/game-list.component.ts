import {Component, OnInit} from '@angular/core';
import {of, tap} from "rxjs";
import {Router} from "@angular/router";
import {GamesService} from "../games.service";
import {DocumentReference} from "@angular/fire/compat/firestore";

export interface Game {
  id: string,
  name: String,
  players: PlayerAttendance[]
}

export interface PlayerAttendance {
    isConfirmed: boolean,
    playerId: DocumentReference
}

export interface Player {
  id: string
  name: string

}

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  games$ = this.games.getGames().pipe(tap(g => console.log(g)))

  constructor(
    private router: Router,
    private games: GamesService,
  ) {
  }

  ngOnInit(): void {
  }
}
