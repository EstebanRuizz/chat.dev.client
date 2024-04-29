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

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7291/chatHub')
      .build();

    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.registerEvents();
      })
      .catch((err) => console.error('Error while starting connection: ' + err));
  }

  private registerEvents(): void {
    this.hubConnection.on('ReceiveMessage', (user, message) => {
      console.log(`${user} says ${message}`);
    });
  }

  public sendMessage(message: string): void {
    this.hubConnection
      .invoke('SendMessage', message)
      .catch((err) => console.error('Error while sending message: ' + err));
  }

  public getMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
