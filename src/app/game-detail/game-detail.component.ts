import {Component, OnInit} from '@angular/core';
import {GameDetails, GamesService} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormArray, FormBuilder} from "@angular/forms";
import {combineLatest, combineLatestWith, debounce, map, Observable, of, startWith, take, tap} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {Player, PlayerAttendance, RsvpStatus} from "../game-list/game";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {EditGameComponent, EditGameData} from "../edit-game/edit-game.component";


export class GamePlayer {
  constructor(
    public player: Player,
    public rsvp: PlayerAttendance
  ) {
  }
}

export class PlayerGroupings {
  map: Map<string, Player> = new Map<string, Player>()
  confirmed: GamePlayer[] = [];
  pending: GamePlayer[] = [];
  declined: GamePlayer[] = []
  rsvps: Map<string, PlayerAttendance> = new Map<string, PlayerAttendance>();
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
  currentPlayer: Player | null = null;
  currentAttendance: GamePlayer | null = null;
  canManage = false;

  groupings = new PlayerGroupings()

  constructor(
    private games: GamesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private auth: AuthService,
  ) {
    const gameId = this.route.snapshot.paramMap.get("id")
    this.games.getDetails(gameId!).subscribe(d => {
      if (d === null) {
        this.snackbar.open(`Game id ${gameId} not found`, "OK")
        this.router.navigate(["/games"]).then()
        return
      }
      this.details = d!;
      if (d?.game.manager.userId === this.auth.user?.userInfo.uid) {
        this.canManage = true
      }
      this.isBusy = false
    })

    const queryMap = this.route.snapshot.queryParamMap
    const confirm = queryMap.get('confirm')

    this.games.getPlayers().pipe(
      tap((players) => {
        this.groupings.map = new Map<string, Player>()
        for (const player of players) {
          this.groupings.map.set(player.id, player)
        }
      }),
      combineLatestWith(this.games.getRsvps(gameId!).pipe(tap(rsvps => {
        this.groupings.rsvps = new Map<string, PlayerAttendance>()
        for (const r of rsvps) {
          this.groupings.rsvps.set(r.playerId, r)
        }
      }))),
      map(([players, rsvps]) => {
        this.filterPlayers(players)
        this.groupings.pending = []
          this.groupings.confirmed = []
          this.groupings.declined = []
          for (const rsvp of rsvps) {
            let list: GamePlayer[]
            switch (rsvp.status) {
              case 'pending':
                list = this.groupings.pending
                break;
              case 'confirmed':
                list = this.groupings.confirmed
                break;
              default:
              case 'declined':
                list = this.groupings.declined
                break;
            }
            const player = this.groupings.map.get(rsvp.playerId)
            if (!player) throw new Error(`no player matched for rsvp: ${rsvp.id}`)

            const gamePlayer = new GamePlayer(player, rsvp)
            if (rsvp.id === confirm || rsvp.playerId === this.auth.user?.userInfo.uid) {
              this.currentAttendance = gamePlayer
            }
            list.push(gamePlayer)
          }
        }
      )).subscribe()

    this.games.getRsvps(gameId!).subscribe()
  }

  private filterPlayers(players: Player[]) {
    this.filteredOptions$ = this.addPlayer.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (value == null) {
          return players.filter(p => !this.groupings.rsvps.has(p.id))
        }
        if (!value.toLowerCase) return []
        const lower = value.toLowerCase()
        return players.filter(p => {
          if (this.groupings.rsvps.has(p.id)) return false
          return p.name.toLowerCase().includes(lower);
        })
      })
    )
  }

  ngOnInit(): void {
  }

  async createNewPlayer(playerName: string) {
    console.log('createNewPlayer', playerName)
    this.addPlayer.reset()
    const player = await this.games.createPlayer(playerName)
    await this.games.addPlayer(this.details.game, player)
  }

  async addPlayerToGame(player: Player) {
    await this.games.addPlayer(this.details.game, player)
  }

  async selectPlayer($event: MatAutocompleteSelectedEvent) {
    const player = $event.option.value as Player
    console.log('selectPlayer', player)
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
    await this.games.updateRsvp(attendance)
  }

  editGame() {
    this.dialog.open(EditGameComponent, {
      data: new EditGameData(this.details.game, false),
    })
  }
}
