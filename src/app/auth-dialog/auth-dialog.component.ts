import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-auth.dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {
  isBusy = false

  constructor(
    public auth: AuthService,
    private dialog: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {message: string}
  ) { }

  ngOnInit(): void {
    this.auth.signIn('#firebaseui-auth-container').subscribe(() => this.finishSignIn())
  }

  private finishSignIn() {
    this.dialog.close()
  }
}
