import {Component} from '@angular/core';
import {AuthService} from "./auth.service";
import {environment} from "../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {Notifications} from "./notifications.service";
import {AuthDialogComponent} from "./auth-dialog/auth-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'icetime';
  user = this.auth.user

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    private notifications: Notifications
  ) {
  }

  signOut() {
    this.auth.signOut().subscribe(() => {
      this.notifications.info("Signed out")
      }
    )
  }

  public signIn() {
    this.dialog.open(AuthDialogComponent, {
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.notifications.info(`Welcome, ${this.auth.user!!.name}!`)
    })
  }
}
