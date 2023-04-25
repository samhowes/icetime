import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  players$ = this.games.players$;

  constructor(
    private games: GamesService,
  ) { }

  ngOnInit(): void {
  }

}
