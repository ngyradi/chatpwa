import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [UserService]
})
export class AppComponent {
  title = 'chat'
}
