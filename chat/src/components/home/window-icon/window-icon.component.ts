import { Component, Input } from '@angular/core'

@Component({
  standalone: true,
  selector: 'app-window-icon',
  templateUrl: './window-icon.component.html',
  styleUrls: ['./window-icon.component.css']
})
export class WindowIconComponent {
  @Input() image!: string
  @Input() text!: string
}
