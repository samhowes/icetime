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
import {from, Observable, Subject, tap} from "rxjs";
import {Notifications} from "./notifications.service";
import {Auth} from "@angular/fire/auth";
import {AuthDialogComponent} from "./auth-dialog/auth-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
    this.name = (userInfo.displayName || "Anonymous").split(' ')[0]
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
    localStorage.setItem(AuthService.storageKey, JSON.stringify(this.user))
  }

  anonymousSignIn(): Observable<any> {
    return from(signInAnonymously(this.firebase!!.auth))
      .pipe(
        tap((credential: UserCredential) => this.finishSignIn(credential.user)))
  }

  signOut(): Observable<any> {
    localStorage.removeItem(AuthService.storageKey)
    this.user = undefined
    return from(signOut(this.firebase!!.auth))
  }
}
