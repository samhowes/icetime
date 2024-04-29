import {Injectable} from '@angular/core';
import {map, Observable, of, shareReplay, switchMap, tap} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {Game, OldPlayer, PlayerAttendance} from "./game-list/game";
import {AuthService} from "./auth.service";
import {Notifications} from "./notifications.service";
import * as moment from "moment";

const idObj = {idField: 'id'}

export class GameDetails {
  date: moment.Moment;
  constructor(
    public game: Game
  ) {
    this.date = moment(game.date)
  }
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private _games: AngularFirestoreCollection<Game> = this.db.collection('games')
  private _players = this.db.collection<OldPlayer>('players')
  players$: Observable<OldPlayer[]> = this._players
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
      map((game) => {
        if (!game) return undefined
        return new GameDetails(game)
      })
    )
  }

  getPlayers(): Observable<OldPlayer[]> {
    return this.players$
  }

  async createPlayer(playerName: string): Promise<OldPlayer> {
    const ref = await this._players
      .add({name: playerName} as OldPlayer)
    const player = await ref.get()
    return player.data()!
  }

  async deletePlayer(player: OldPlayer) {
    await this.db.collection('players').doc(player.id).delete()
  }

  async update(game: Game) {
    await this._games.doc(game.id).update(game)
  }

  getPlayer(id: string): Observable<OldPlayer|undefined> {
    return this._players.doc(id).valueChanges()
  }

  async updatePlayer(id: string, value: OldPlayer) {
    await this._players.doc(id).update(value)
  }

  async createGame(game: Game): Promise<void> {
    const ref = await this._games.add(game)
    game.id = ref.id
  }

  async addPlayer(game: Game, player: OldPlayer) {
    const ref = await this.db.collection('rsvp').add({
      playerId: player.id,
      gameId: game.id,
      status: 'pending'
    })

    await this.invitePlayer(game, player, ref.id)
  }

  async invitePlayer(game: Game, player: OldPlayer, rsvpId: string) {
    if (this.auth.user?.userInfo.uid != game.manager.userId) {
      this.notifications.info("Only the game manager can send invites")
      return
    }
    const url = `${window.location.origin}/games/${game.id}`
    const confirm = url + `?confirm=${rsvpId}`

    let to = player.email
    if (url.includes("localhost")) {
      to = 'sam@samhowes.com'
    }

    const email = {
      to: [to],
      from: 'icetime@samhowes.com',
      message: {
        subject: `${game.manager.name} has invited you to Icetime: ${game.name}`,
        html: `<p>Click the following link or paste it into your browser to confirm or decline your
availability: <a href="${confirm}">${confirm}</a></p>`,
      }
    }
    const ref = await this.db.collection('mail').add(email)
    console.log(email)
  }

  async removePlayer(rsvp: PlayerAttendance) {
    await this.db.collection('rsvp').doc(rsvp.id).delete()
  }

  getRsvps(gameId: string): Observable<PlayerAttendance[]> {
    return this.db.collection<PlayerAttendance>('rsvp', ref => ref
      .where("gameId", "==", gameId))
      .valueChanges(idObj)
  }

  async updateRsvp(rsvp: PlayerAttendance) {
    return await this.db.collection<PlayerAttendance>('rsvp').doc(rsvp.id).update(rsvp)
  }
}
