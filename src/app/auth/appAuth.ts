import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Firebase} from "@app/firebase";
import {auth} from "firebaseui";
import {IcetimeUser} from "@auth/icetimeUser";
import {Observable, ReplaySubject} from "rxjs";
import {AuthDialogComponent, AuthDialogData} from "@auth/auth.dialog/auth.dialog.component";

export class StorageKeys {
  static returnUrl = "auth:returnUrl"
}

@Injectable({providedIn: "root"})
export class AppAuth {
  ui: firebaseui.auth.AuthUI;

  public user: IcetimeUser|null = null
  public user$ = new ReplaySubject<IcetimeUser|null>(1)

  constructor(private dialog: MatDialog,
              private firebase: Firebase,
  ) {
    this.ui = new auth.AuthUI(this.firebase.auth)

    this.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = {
          id: user.uid,
          displayName: user.displayName || 'Unknown',
        }
      }
      this.user$.next(this.user)
    })
  }

  returnToUrl() {
    let returnUrl = localStorage.getItem(StorageKeys.returnUrl) || "/"
    localStorage.removeItem(StorageKeys.returnUrl)
    window.location.pathname = returnUrl
  }

  launchUI(signInMessage: string): Observable<boolean> {
    // don't clobber an existing returnUrl on authentication retry
    if (!localStorage.getItem(StorageKeys.returnUrl))
      localStorage.setItem(StorageKeys.returnUrl, document.location.pathname)
    const data = new AuthDialogData(signInMessage)
    const ref = this.dialog.open(AuthDialogComponent, {data})
    return ref.afterClosed()
  }
}
