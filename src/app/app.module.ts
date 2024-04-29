import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {provideAuth, getAuth, connectAuthEmulator} from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import { GameListComponent } from './game-list/game-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import {connectFirestoreEmulator, getFirestore, provideFirestore} from "@angular/fire/firestore";
import {AngularFireModule} from "@angular/fire/compat";
import {ReactiveFormsModule} from "@angular/forms";
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { AttendanceListComponent } from './game-detail/attendance-list/attendance-list.component';
import {PlayerListComponent} from "./player-list/player-list.component";
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { ConfirmAttendanceComponent } from './game-detail/confirm-attendance/confirm-attendance.component';
import { LeagueComponent } from './league/league.component';


@NgModule({
  declarations: [
    AppComponent,
    GameListComponent,
    GameDetailComponent,
    PlayerDetailsComponent,
    PlayerListComponent,
    EditGameComponent,
    AttendanceListComponent,
    AuthDialogComponent,
    ConfirmAttendanceComponent,
    LeagueComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
      if (environment.useEmulators) {
        const auth = getAuth(app)
        connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings:true})
        const firestore = getFirestore(app)
        connectFirestoreEmulator(firestore, 'localhost', 8080)
      }
      return app
    }),
    provideAuth((app) => {
      const auth = getAuth()
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings:true})
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080)
      }
      return firestore
    }),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
