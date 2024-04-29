import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GamesService} from "../games.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OldPlayer} from "../game-list/game";

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {

  notFound = false
  isBusy = true;
  id: string;
  player: OldPlayer|null = null;

  form!: FormGroup
  constructor(
    private route: ActivatedRoute,
    private games: GamesService,
    private fb: FormBuilder,
  ) {
    this.id = route.snapshot.paramMap.get('id')!
    this.games.getPlayer(this.id).subscribe(player => {
      this.isBusy = false
      if (!player) {
        this.notFound = true
        return
      }
      this.notFound = false
      this.form = this.fb.group({name: this.fb.control(player.name)})
      this.player = player
    })
  }

  ngOnInit(): void {
  }

  async save() {
    await this.games.updatePlayer(this.id, this.form.value)
  }
}
