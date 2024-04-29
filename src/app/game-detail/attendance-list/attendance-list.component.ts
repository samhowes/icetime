import {Component, Input, OnInit} from '@angular/core';
import {Game, OldPlayer} from "../../game-list/game";
import {GamesService} from "../../games.service";
import {GamePlayer} from "../game-detail.component";

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
  @Input('players') players: GamePlayer[] = []
  @Input('game') game: Game = {} as Game
  constructor(
    private games: GamesService
  ) { }

  ngOnInit(): void {
  }

  async removePlayer(player: GamePlayer) {
    await this.games.removePlayer(player.rsvp)
  }

  async resendInvite(player: GamePlayer) {
    await this.games.invitePlayer(this.game, player.player, player.rsvp.id)
  }
}
