import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GamesService} from "../games.service";
import {Game} from "../game-list/game";
import {AuthService} from "../auth.service";

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
    @Inject(MAT_DIALOG_DATA) data: Game,
    private dialogRef: MatDialogRef<EditGameComponent>,
    private fb: FormBuilder,
    private games: GamesService,
    private auth: AuthService,
  ) {
    this.title = data.name ? 'Edit: ' + data.name : 'New Game'
    this.form = this.fb.group({name: this.fb.control(data.name)})
  }

  ngOnInit(): void {
  }

  async save() {
    this.isBusy = true
    const game = this.form.value as Game
    game.manager = {
      name: this.auth.user!.name,
      userId: this.auth.user!.userInfo.uid
    }
    game.players = []
    await this.games.createGame(game)
    this.dialogRef.close(game)
  }
}
