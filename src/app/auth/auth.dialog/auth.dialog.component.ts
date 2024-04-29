import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AppAuth} from "@auth/appAuth";
import {User, GoogleAuthProvider, AuthCredential} from '@firebase/auth'
import {Notifications} from "@app/notifications";

export class AuthDialogData {
  constructor(
    public message: string
  ) {
  }
}

export interface AuthResult {
  user: User,
  credential: AuthCredential
}

@Component({
  selector: 'app-auth.dialog',
  templateUrl: './auth.dialog.component.html',
  styleUrls: ['./auth.dialog.component.scss']
})
export class AuthDialogComponent implements AfterViewInit {
  isBusy: boolean = true

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AuthDialogData,
    private auth: AppAuth,
    private notifications: Notifications,
    private ref: MatDialogRef<AuthDialogComponent>
  ) {
  }


  ngAfterViewInit(): void {
    const self = this
    this.auth.ui.start('#firebaseui-auth-container', {
      // autoUpgradeAnonymousUsers: true, // throws a linkWithPopup is not a function error
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: "auth/login/success",
      signInFlow: 'popup', // redirect causes the user to not update for some reason
      callbacks: {
        signInSuccessWithAuthResult(authResult: AuthResult, redirectUrl?: string): boolean {
          return true
        },
        signInFailure(error: firebaseui.auth.AuthUIError): Promise<void> | void {
          self.notifications.error(error)
        },
        uiShown() {
          self.isBusy = false
        },
      }
    })
  }

  refuseSignIn() {
    this.ref.close(false)
    this.notifications.info("Refused sign in.")
  }
}
