import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketChatService {
  private hubConnection: HubConnection;
  private messageSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:7242/chatHub')
    .build();

    this.startConnection();
  }

  public startConnection(): void {
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
      this.messageSubject.next({ user, message });
      console.log(`${user} says ${message}`);
    });
  }

  public sendMessage(message: string): void {
    this.hubConnection
      .invoke('SendMessage', 'HelloUser', message)
      .catch((err) => console.error('Error while sending message: ' + err));
  }

  public getMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
