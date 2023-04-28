import {Injectable} from '@angular/core';
import {auth as firebaseUiAuth} from "firebaseui";
import {
  signInAnonymously,
  signOut,
  UserInfo,
  AdditionalUserInfo,
  GoogleAuthProvider,
  UserCredential
} from "firebase/auth";
import {from, Observable, Subject, take, tap} from "rxjs";
import {Notifications} from "./notifications.service";
import {Auth} from "@angular/fire/auth";
import {AuthDialogComponent} from "./auth-dialog/auth-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Player} from "./game-list/game";

export interface AuthResult {
  user: UserInfo,
  additionalUserInfo: AdditionalUserInfo,
  credentials: UserCredential,
}

export class AppUserInfo {
  static load(str: string) {
    const user = new AppUserInfo({} as UserInfo)
    Object.assign(user, JSON.parse(str))
    return user
  }

  public name: string;

  constructor(
    public userInfo: UserInfo
  ) {
    this.name = userInfo.displayName!
  }
}

@Injectable({
  providedIn: 'root'
})
export class Firebase {
  ui = new firebaseUiAuth.AuthUI(this.auth)

  constructor(
    public auth: Auth
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static storageKey: string = 'firebase/auth'

  user?: AppUserInfo
  loadingFirebaseUi = true

  constructor(
    private notifications: Notifications,
    private firebase: Firebase,
    private dialog: MatDialog,
    private db: AngularFirestore,
  ) {
    try {
      const authStr = localStorage.getItem(AuthService.storageKey)
      if (authStr) {
        this.user = AppUserInfo.load(authStr)
      }
    } catch (e) {
      console.log('failed to parse auth string', e)
    }
  }

  showSignIn(message: string = ''): Observable<any> {
    return this.dialog.open(AuthDialogComponent, {
      data: {
        message
      },
      disableClose: true
    }).afterClosed().pipe(tap(() => {
      this.notifications.info(`Welcome, ${this.user!!.name}!`)
    }))
  }

  signIn(locator: string): Observable<boolean> {
    const obs = new Subject<boolean>()
    this.firebase?.ui.start(locator, {
      callbacks: {
        signInSuccessWithAuthResult: (authResult: AuthResult, redirectUrl) => {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          this.finishSignIn(authResult.user);
          obs.next(true)
          return false; // don't redirect: assume we're in a modal
        },
        uiShown: () => {
          // The widget is rendered.
          // Hide the loader.
          this.loadingFirebaseUi = false
        },
        signInFailure: (error: firebaseui.auth.AuthUIError): Promise<void> | void => {
          this.notifications.error(error.message)
        }
      },
      signInFlow: 'popup',
      signInOptions: [
        // List of OAuth providers supported.
        GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID
      ],
      // Other config options...
    });
    return obs
  }

  private finishSignIn(user: UserInfo) {
    this.user = new AppUserInfo(user)

    const doc = this.db.collection<Player>('players', ref => ref
      .where('id', '==', this.user!.userInfo.uid))
    doc
      .valueChanges()
      .pipe(take(1))
      .subscribe(value => {
        if (value.length == 0) {
          this.db.collection<Player>('players', (q) =>
            q.where('email', '==', this.user!.userInfo.email))
            .valueChanges({idField: 'id'})
            .pipe(take(1))
            .subscribe(players => {
              if (players.length > 1) {
                this.notifications.error('Found multiple players with your email, please contact sam@samhowes.com')
              }
              if (players.length) {
                this.updateProfile(players[0], players[0].id)
              }
              else this.updateProfile({} as Player, this.user!.userInfo.uid!)
            })
        } else {
          this.updateProfile(value[0], value[0].id);
        }

      })
    localStorage.setItem(AuthService.storageKey, JSON.stringify(this.user))
  }

  private updateProfile(player: Player, id: string) {
    player.name = this.user!.name
    player.email = this.user!.userInfo.email!
    player.claimed = true
    this.db.collection<Player>('players').doc(id)
      .set(player, {merge: true}).then(() => console.log('updated profile'))
  }

  signOut(): Observable<any> {
    localStorage.removeItem(AuthService.storageKey)
    this.user = undefined
    return from(signOut(this.firebase!!.auth))
  }
}
