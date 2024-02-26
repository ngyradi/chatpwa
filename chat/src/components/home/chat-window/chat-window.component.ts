import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../../models/Chatroom';

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  imports: [FormsModule],
})
export class ChatWindowComponent{

  messages : ChatMessage[];
  message: string;

  constructor() {
    this.messages = [];
    this.message = "";
   }

   sendMessage(){
    this.message = "";
   }

}
