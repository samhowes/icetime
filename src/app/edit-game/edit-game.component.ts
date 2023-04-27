import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GamesService} from "../games.service";
import {Game} from "../game-list/game";
import {AuthService} from "../auth.service";
import * as moment from "moment";
import {Moment} from "moment";

export class EditGameData {
  constructor(
    public game: Game,
    public isCreate: boolean,
  ) {
  }
}

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.scss']
})
export class EditGameComponent implements OnInit {
  title: string;
  form: FormGroup;
  isBusy = false

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: EditGameData,
    private dialogRef: MatDialogRef<EditGameComponent>,
    private fb: FormBuilder,
    private games: GamesService,
    private auth: AuthService,
  ) {
    this.title = data.game.name ? 'Edit: ' + data.game.name : 'New Game'
    console.log(data.game)
    this.form = this.fb.group({
      name: this.fb.control(data.game.name),
      date: this.fb.control(moment(data.game.date)),
      startTime: this.fb.control(data.game.startTime),
      description: this.fb.control(data.game.description),
    })
  }

  ngOnInit(): void {
  }

  async save() {
    this.isBusy = true
    const game = Object.assign({}, this.data.game, this.form.value as Game)
    const date = this.form.value.date as Moment
    game.date = (date as Moment).format()
    game.manager = {
      name: this.auth.user!.name,
      userId: this.auth.user!.userInfo.uid
    }
    game.players = []
    console.log(this.data)
    if (this.data.isCreate) {
      await this.games.createGame(game)
    } else {
      await this.games.update(game)
    }
    this.dialogRef.close(game)
  }
}
