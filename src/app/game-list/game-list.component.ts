import {Component, OnInit} from '@angular/core';
import {of} from "rxjs";
import {Router} from "@angular/router";
import {GamesService} from "../games.service";

export class Game {
  constructor(
    public id: string,
    public name: String
  ) {
  }
}

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  games$ = this.games.getGames()

  constructor(
    private router: Router,
    private games: GamesService,
  ) {
  }

  ngOnInit(): void {
  }
}
