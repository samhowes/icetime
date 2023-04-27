import {Component, Input, OnInit} from '@angular/core';
import {Game, Player} from "../../game-list/game";
import {GamesService} from "../../games.service";

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
  @Input('players') players: Player[] = []
  @Input('game') game: Game = {} as Game
  constructor(
    private games: GamesService
  ) { }

  ngOnInit(): void {
  }

  async removePlayer(player: Player) {
    await this.games.removePlayer(this.game, player)
  }

  async resendInvite(player: Player) {
    await this.games.invitePlayer(this.game, player)
  }
}
