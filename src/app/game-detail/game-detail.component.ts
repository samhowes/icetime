import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Game} from "../game-list/game-list.component";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit {
  public game!: Game;

  constructor(
    private games: GamesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    const id = this.route.snapshot.paramMap.get("id")
    this.games.getById(id!).subscribe(g => {
      if (g === null) {
        this.snackbar.open(`Game id ${id} not found`, "OK")
        this.router.navigate(["/games"]).then()
        return
      }
      this.game = g;
    })
  }

  ngOnInit(): void {
  }

}
