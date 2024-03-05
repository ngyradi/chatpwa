import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
  standalone: true,
  selector: 'app-mobile-hamburger-menu-button',
  templateUrl: './mobile-hamburger-menu-button.component.html',
  styleUrls: ['./mobile-hamburger-menu-button.component.css'],
  imports: [CommonModule]
})
export class MobileHamburgerMenuButtonComponent {
  @Input() isOpen!: boolean
}
