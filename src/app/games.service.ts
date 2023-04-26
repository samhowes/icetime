import {Injectable} from '@angular/core';
import {filter, map, Observable, of, share, shareReplay, switchMap, tap} from "rxjs";
import {Game, Player, PlayerAttendance} from "./game-list/game-list.component";
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";

const idObj = {idField: 'id'}

export class GameDetails {
  players = new Map<PlayerAttendance, Player>();
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
    private db: AngularFirestore
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
            console.log('new details')

            const pMap = new Map<string, Player>()
            for (const p of players) {
              pMap.set(p.id, p)
            }
            const details = new GameDetails(game)
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
    await this.db.collection('games').doc(game.id).set(game)
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
    game.players.push({isConfirmed: false, playerId: doc.ref})
    await this._games.doc(game.id).set(game)
  }

  async invitePlayer() {
    console.log('what')
    const email = {
      to: ['sam@samhowes.com'],
      from: 'icetime@samhowes.com',
      message: {
        subject: 'Hello from Firebase!',
        text: 'This is the plaintext section of the email body.',
        html: 'This is the <code>HTML</code> section of the email body.',
      }
    }
    const ref = await this.db.collection('mail').add(email)
    console.log(ref.id)
  }
}
