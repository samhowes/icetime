import {Component, Inject, inject, OnInit} from '@angular/core';
import {Game, Player, PlayerAttendance} from "../../game-list/game";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GamesService} from "../../games.service";

export class ConfirmAttendanceData {
  public attendance: PlayerAttendance;
  constructor(
    public game: Game,
    public playerId: string,
  ) {
    const index = game.players.findIndex(p => p.playerId.id === playerId)
    this.attendance = this.game.players[index]
  }
}

@Component({
  selector: 'app-confirm-attendance',
  templateUrl: './confirm-attendance.component.html',
  styleUrls: ['./confirm-attendance.component.scss']
})
export class ConfirmAttendanceComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmAttendanceData,
    private games: GamesService,
    private ref: MatDialogRef<ConfirmAttendanceComponent>,
  ) { }

  ngOnInit(): void {
  }

  async confirm() {
    this.data.attendance.status = 'confirmed'
    await this.save()
  }

  async decline() {
    this.data.attendance.status = 'declined'
    await this.save()
  }

  private async save() {
    await this.games.update(this.data.game)
    this.ref.close()
  }
}
