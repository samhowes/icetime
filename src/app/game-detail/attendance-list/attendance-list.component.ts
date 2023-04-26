import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../game-list/game";

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {
  @Input('players') players: Player[] = []
  constructor() { }

  ngOnInit(): void {
  }

}
