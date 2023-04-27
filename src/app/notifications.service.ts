import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class Notifications {

  constructor(
    private snackbar: MatSnackBar,
    private db: AngularFirestore
  ) { }

  info(message: string) {
    this.snackbar.open(message, 'Dismiss', {
      duration: 3000
    })
  }

  error(message: any) {
    const ref = this.snackbar.open(message, 'Report Error')
    ref.onAction().subscribe(() => {
      this.db.collection('errors').add(message).then()
      throw message
    })
  }
}
