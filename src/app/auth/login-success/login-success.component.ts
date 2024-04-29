import {Component, OnInit} from '@angular/core';
import {AppAuth} from "@auth/appAuth";

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private auth: AppAuth
  ) {
  }

  ngOnInit() {
    this.finishLogin()
  }

  finishLogin() {
    this.auth.returnToUrl()
  }
}
