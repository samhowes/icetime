import {Component, OnInit} from '@angular/core';
import {tap} from "rxjs";
import {Router} from "@angular/router";
import {GamesService} from "../games.service";
import {MatDialog} from "@angular/material/dialog";
import {EditGameComponent} from "../edit-game/edit-game.component";
import {Game} from "./game";
import {AuthService} from "../auth.service";

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
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
  }

  createGame() {
    if (!this.auth.user) {
      this.auth.showSignIn('Sign in to Create a Game')
        .subscribe(() => this.editGame())
    }
    else {
      this.editGame();
    }

  }

  private editGame() {
    const ref = this.dialog.open(EditGameComponent, {
      minWidth: '300px',
      data: {} as Game
    })
    ref.afterClosed().subscribe(res => {
      if (!res) return
      const game = res as Game
      this.router.navigate(['/games', game.id]).then()
    })
  }
}
