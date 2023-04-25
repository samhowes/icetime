import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Game} from "../game-list/game-list.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GamesService} from "../games.service";

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
  ) {
    this.title = data.name ? 'Edit: ' + data.name : 'New Game'
    this.form = this.fb.group({name: this.fb.control(data.name)})
  }

  ngOnInit(): void {
  }

  async save() {
    this.isBusy = true
    const game = this.form.value as Game
    game.players = []
    await this.games.createGame(game)
    this.dialogRef.close(game)
  }
}
