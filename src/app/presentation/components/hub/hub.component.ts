import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.css',
})
export class HubComponent {
  private hubConnection: HubConnection;
  private messageSubject: Subject<any> = new Subject<any>();
  public lastMessage: string = ''

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7242/chatHub')
      .build();

    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started NOW');
        this.registerEvents();
      })
      .catch((err) => console.error('Error while starting connection: ' + err));
  }

  private registerEvents(): void {
    this.hubConnection.on('ReceiveMessage', (user, message) => {
      this.lastMessage = message
      console.log(`${user} says ${message}`);
    });
  }

  public sendMessage(): void {
    this.hubConnection
      .invoke('SendMessage', 'HelloUSer', new Date())
      .catch((err) => console.error('Error while sending message: ' + err));
  }

  public getMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
