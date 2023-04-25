import {Component, OnInit} from '@angular/core';
import {GameDetails, GamesService} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Player, PlayerAttendance} from "../game-list/game-list.component";
import {FormArray, FormBuilder, FormControl} from "@angular/forms";
import {map, Observable, of, startWith, take} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {DocumentReference} from "@angular/fire/compat/firestore";

export class PlayerControls {
  constructor(
    public a: PlayerAttendance,
    public player: Player,
    public control: FormControl,
  ) {
  }
}

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent implements OnInit {
  public details!: GameDetails;
  formArray: FormArray = this.fb.array([])
  form = this.fb.group({
    confirmed: this.formArray
  })
  isBusy = true

  controls: PlayerControls[] = []
  hasChanges = false;
  addPlayer = this.fb.control('');
  addPlayerForm = this.fb.group({player: this.addPlayer})
  filteredOptions$: Observable<Player[]> = of([])

  players$ = this.games.players$

  constructor(
    private games: GamesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    const id = this.route.snapshot.paramMap.get("id")
    this.games.getDetails(id!).subscribe(d => {
      if (d === null) {
        this.snackbar.open(`Game id ${id} not found`, "OK")
        this.router.navigate(["/games"]).then()
        return
      }
      this.details = d!;

      this.controls = []
      for (let i = 0; i < d!.game.players.length; i++){
        const a = d!.game.players[i];

        const control = new PlayerControls(
          a,
          d!.players.get(a)!,
          this.fb.control(a.isConfirmed)
        )
        this.controls.push(control)
        this.formArray.insert(i, control.control)
      }
      this.getPlayers(d!)
      this.isBusy = false
    })
  }

  private getPlayers(d: GameDetails) {
    const pmap = new Map<string, PlayerAttendance>()
    for (const player of d.game.players) {
      pmap.set(player.playerId.id, player)
    }

    this.games.getPlayers().subscribe(players => {
      this.filteredOptions$ = this.addPlayer.valueChanges.pipe(
        startWith(''),
        map(value => {
          if (value == null) return players.filter(p => !pmap.has(p.id))
          const lower = value.toLowerCase()
          return players.filter(p => {
            if (pmap.has(p.id)) return false
            return p.name.toLowerCase().includes(lower);
          })
        })
      )
    })
  }

  ngOnInit(): void {
  }

  async createNewPlayer(playerName: string) {
    this.addPlayer.reset()
    const ref = await this.games.createPlayer(playerName)
    this.details.game.players.push({isConfirmed: false, playerId: ref})
    await this.games.update(this.details.game)
  }

  async addPlayerToGame(player: Player) {
    console.log(player)
    // this.details.game.players.push(new PlayerAttendance(false, player.id))
    // this.games.update(this.details.game)
  }

  async selectPlayer($event: MatAutocompleteSelectedEvent) {
    const player = $event.option.value as Player
    await this.addPlayerToGame(player)
  }

  async deletePlayer(player: Player) {
    await this.games.deletePlayer(player)
  }
}
