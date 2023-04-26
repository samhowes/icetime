import {Component, OnInit} from '@angular/core';
import {of, tap} from "rxjs";
import {Router} from "@angular/router";
import {GamesService} from "../games.service";
import {AngularFirestore, DocumentReference} from "@angular/fire/compat/firestore";
import {MatDialog} from "@angular/material/dialog";
import {EditGameComponent} from "../edit-game/edit-game.component";

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
  isBusy = true;
  games$ = this.games.getGames().pipe(tap(_ => {
    this.isBusy = false;
  }))

  constructor(
    private router: Router,
    private games: GamesService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  createGame() {
    const ref = this.dialog.open(EditGameComponent, {
      minWidth: '300px',
      data: {} as Game})
    ref.afterClosed().subscribe(res => {
      if (!res) return
      const game = res as Game
      this.router.navigate(['/games', game.id]).then()
    })
  }
}
