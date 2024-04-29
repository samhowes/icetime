import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Firestore} from "@firebase/firestore";

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {
  isBusy = false

  constructor(

  ) {
  }

  ngOnInit(): void {

  }

}
