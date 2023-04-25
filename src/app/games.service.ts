import { Injectable } from '@angular/core';
import {filter, map, Observable, of} from "rxjs";
import {Game} from "./game-list/game-list.component";

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private games: Game[] = [new Game("1", "Bangor v Portland")]

  constructor() { }

  getGames(): Observable<Game[]> {
    return of(this.games);
  }

  getById(id: string): Observable<Game|null> {
    return this.getGames().pipe(
      map(g => {
        const game = g.filter(i => i.id == id)
        return game.length > 0 ? game[0] : null
      })
    )
  }
}
