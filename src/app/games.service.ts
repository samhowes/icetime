import {Injectable} from '@angular/core';
import {filter, map, Observable, of, share, shareReplay, switchMap, tap} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {Game, PlayerAttendance, Player} from "./game-list/game";
import {AuthService} from "./auth.service";
import {Notifications} from "./notifications.service";

const idObj = {idField: 'id'}

export class GameDetails {
  players = new Map<PlayerAttendance, Player>();
  confirmed: Player[] = [];
  pending: Player[] = [];
  declined: Player[] = []
  constructor(
    public game: Game
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private _games: AngularFirestoreCollection<Game> = this.db.collection('games')
  private _players = this.db.collection<Player>('players')
  players$: Observable<Player[]> = this._players
    .valueChanges(idObj)
    .pipe(
      tap(p => console.log('new players', p)),
      shareReplay(1))

  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    private notifications: Notifications,
  ) {
  }

  getGames(): Observable<Game[]> {
    return this._games.valueChanges(idObj)
  }

  getById(id: string): Observable<Game | undefined> {
    return this._games.doc(id)
      .valueChanges({idField: 'id'})
  }

  getDetails(gameId: string): Observable<GameDetails | undefined> {
    return this.getById(gameId).pipe(
      switchMap((game) => {
        if (!game) return of(undefined)
        return this.players$.pipe(
          map(players => {

            const pMap = new Map<string, Player>()
            for (const p of players) {
              pMap.set(p.id, p)
            }
            const details = new GameDetails(game)
            if (!game.players) game.players = []
            for (const a of game.players) {
              details.players.set(a, pMap.get(a.playerId.id)!)
            }
            return details
          })
        )
      })
    )
  }

  getPlayers(): Observable<Player[]> {
    return this.players$
  }

  async createPlayer(playerName: string): Promise<DocumentReference<Player>> {
    const ref = await this._players
      .add({name: playerName} as Player)
    return ref
  }

  async deletePlayer(player: Player) {
    await this.db.collection('players').doc(player.id).delete()
  }

  async update(game: Game) {
    await this._games.doc(game.id).set(game)
  }

  getPlayer(id: string): Observable<Player|undefined> {
    return this._players.doc(id).valueChanges()
  }

  async updatePlayer(id: string, value: Player) {
    await this._players.doc(id).update(value)
  }

  async createGame(game: Game): Promise<void> {
    const ref = await this._games.add(game)
    game.id = ref.id
  }

  async addPlayer(game: Game, player: Player) {
    const doc = this._players.doc(player.id)
    game.players.push({status: 'pending', playerId: doc.ref})
    await this._games.doc(game.id).set(game)
    await this.invitePlayer(game, player)
  }

  async invitePlayer(game: Game, player: Player) {
    if (this.auth.user?.userInfo.uid != game.manager.userId) {
      this.notifications.info("Only the game manager can send invites")
      return
    }
    const url = `${window.location.origin}/games/${game.id}`
    const confirm = url + `?confirm=${player.id}`

    const email = {
      to: [player.email],
      from: 'icetime@samhowes.com',
      message: {
        subject: `${game.manager.name} has invited you to Icetime: ${game.name}`,
        html: `<p>Click the following link or paste it into your browser to confirm or decline your
availability: <a href="${confirm}">${confirm}</a></p>`,
      }
    }
    const ref = await this.db.collection('mail').add(email)
    console.log(ref.id)
  }

  async removePlayer(game: Game, player: Player) {
    const a = game.players.findIndex(a => a.playerId.id === player.id)
    if (a < 0) console.error("Player not added to game", game, player)
    game.players.splice(a, 1)
    await this._games.doc(game.id).set(game)
  }
}
