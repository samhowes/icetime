import {Component, Input} from '@angular/core';

@Component({
  selector: 'home-link',
  template: `<a routerLink="/">Icetime</a>`
})
export class HomeLinkComponent {}

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input('loading') loading = false
  @Input('appName') appName = true
}

