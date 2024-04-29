import {Component, OnInit} from '@angular/core';
import {AppAuth} from "@auth/appAuth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'icetime';
  loaded = false

  constructor(
    private auth: AppAuth
  ) {
  }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.loaded = true
        return
      }

      this.auth.launchUI("Sign in to use Icetime")
    })
  }
}
