import { Component, EventEmitter, Output } from '@angular/core'
import { PageState } from '../../../../models/ui.state'

@Component({
  standalone: true,
  selector: 'app-mobile-hamburger-menu',
  templateUrl: './mobile-hamburger-menu.component.html',
  styleUrls: ['./mobile-hamburger-menu.component.css']
})
export class MobileHamburgerMenuComponent {
  @Output() changePageEvent = new EventEmitter<PageState>()
  PageState = PageState

  changePage (page: PageState): void {
    this.changePageEvent.emit(page)
  }
}
