import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class Notifications {

  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  info(message: string, persistent = false) {
    this.snackbar.open(message, 'Dismiss', {
      duration: persistent ? 0 : 5000
    })
  }

  action(message: string, action: () => void) {
    const ref = this.snackbar.open(message, 'GO TO CLIPBOARD', {
      duration: 0,
      horizontalPosition: "center",
      verticalPosition: "bottom"
    })
    ref.onAction().subscribe(() => {
      action()
    })
  }

  error(error: any) {
    let message: string
    if (typeof error === 'string') {
      message = error
    } else if (error instanceof Error) {
      message = error.toString()
    } else if (error instanceof HttpErrorResponse) {
      message = error.message
    } else {
      message = error
    }
    const ref = this.snackbar.open(message, 'Report Error', {
      horizontalPosition: "center",
      verticalPosition: "bottom"
    })
    ref.onAction().subscribe(() => {
      // this.firebase.reportError(message)
      console.error(error)
    })
  }
}
