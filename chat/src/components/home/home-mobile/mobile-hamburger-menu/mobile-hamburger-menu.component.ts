import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PageState } from '../../../../models/ui.state'
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,
  selector: 'app-mobile-hamburger-menu',
  templateUrl: './mobile-hamburger-menu.component.html',
  styleUrls: ['./mobile-hamburger-menu.component.css'],
  imports: [CommonModule]
})
export class MobileHamburgerMenuComponent {
  PageState = PageState

  @Input() selectedPage?: PageState
  @Output() changePageEvent = new EventEmitter<PageState>()

  changePage (page: PageState): void {
    this.changePageEvent.emit(page)
  }
}
