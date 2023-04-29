import {Component, Inject, OnInit} from '@angular/core';
import {Game} from "../../game-list/game";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GamesService} from "../../games.service";
import {GamePlayer} from "../game-detail.component";

export class ConfirmAttendanceData {
  constructor(
    public game: Game,
    public gamePlayer: GamePlayer,
  ) {
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
    this.data.gamePlayer.rsvp.status = 'confirmed'
    await this.save()
  }

  async decline() {
    this.data.gamePlayer.rsvp.status = 'declined'
    await this.save()
  }

  private async save() {
    await this.games.update(this.data.game)
    this.ref.close()
  }
}
