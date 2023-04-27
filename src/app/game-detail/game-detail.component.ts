import {Component, OnInit} from '@angular/core';
import {GameDetails, GamesService} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormArray, FormBuilder} from "@angular/forms";
import {map, Observable, of, startWith, take} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {Player, PlayerAttendance, RsvpStatus} from "../game-list/game";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmAttendanceComponent, ConfirmAttendanceData} from "./confirm-attendance/confirm-attendance.component";
import {AuthService} from "../auth.service";
import {EditGameComponent, EditGameData} from "../edit-game/edit-game.component";

export class PlayerControls {
  constructor(
    public a: PlayerAttendance,
    public player: Player,
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

  hasChanges = false;
  addPlayer = this.fb.control('');
  addPlayerForm = this.fb.group({player: this.addPlayer})
  filteredOptions$: Observable<Player[]> = of([])

  players$ = this.games.players$
  autoCompleteDisplay = (player: any) => (player || {} as Player).name ? (player as Player).name : player;
  currentPlayer: Player|null = null;
  currentAttendance: PlayerAttendance|null = null;
  canManage = false;

  constructor(
    private games: GamesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private auth: AuthService,
  ) {
    const id = this.route.snapshot.paramMap.get("id")
    this.games.getDetails(id!).subscribe(d => {
      if (d === null) {
        this.snackbar.open(`Game id ${id} not found`, "OK")
        this.router.navigate(["/games"]).then()
        return
      }
      this.details = d!;
      if (d?.game.manager.userId === this.auth.user?.userInfo.uid) {
        this.canManage = true
      }
      const queryMap = this.route.snapshot.queryParamMap
      const confirm = queryMap.get('confirm')
      const decline = queryMap.get('decline')

      this.getPlayers(d!, confirm)
      this.isBusy = false
    })
  }

  private getPlayers(d: GameDetails, currentPlayerId: string|null) {
    const pmap = new Map<string, PlayerAttendance>()
    for (const player of d.game.players) {
      pmap.set(player.playerId.id, player)
    }

    this.games.getPlayers().subscribe(players => {
      for (const p of players) {
        const a = pmap.get(p.id)!
        if (!a) continue
        if (p.id === currentPlayerId) {
          this.currentPlayer = p
          this.currentAttendance = a;
        }
        switch (a.status) {
          case "confirmed":
            d.confirmed.push(p)
            break
          case "pending":
            d.pending.push(p)
            break
          default:
            d.declined.push(p)
            break
        }
      }
      this.filteredOptions$ = this.addPlayer.valueChanges.pipe(
        startWith(''),
        map(value => {
          if (value == null) return players.filter(p => !pmap.has(p.id))
          if (!value.toLowerCase) return []
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
    this.details.game.players.push({status: 'pending', playerId: ref})
    await this.games.update(this.details.game)
  }

  async addPlayerToGame(player: Player) {
    await this.games.addPlayer(this.details.game, player)
  }

  async selectPlayer($event: MatAutocompleteSelectedEvent) {
    const player = $event.option.value as Player
    this.addPlayer.reset()
    await this.addPlayerToGame(player)
  }

  async deletePlayer(player: Player) {
    await this.games.deletePlayer(player)
  }

  async confirmAttendance(attendance: PlayerAttendance) {
    await this.rsvp(attendance, 'confirmed')
  }

  async declineAttendance(attendance: PlayerAttendance) {
    await this.rsvp(attendance, 'declined')
  }

  async rsvp(attendance: PlayerAttendance, status: RsvpStatus) {
    attendance.status = status
    await this.games.update(this.details.game)
  }

  editGame() {
    this.dialog.open(EditGameComponent, {
      data: new EditGameData(this.details.game, false),
    })
  }
}
