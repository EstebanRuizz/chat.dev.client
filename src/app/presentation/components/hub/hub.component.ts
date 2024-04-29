import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EnumSocket } from '../../../core/application/enums/EnumSocket';
import { UserMessageDTO } from '../../../core/application/DTO/UserMessageDTO';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.css',
})
export class HubComponent {
  private hubConnection: HubConnection;
  private messageSubject: Subject<any> = new Subject<any>();
  public lastMessage: UserMessageDTO = { user: '', message: '' };
  public messageForm!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7242/chatHub')
      .build();

    this.startConnection();
    this.initForm();
  }

  private initForm(): void {
    this.messageForm = this.formBuilder.group({
      userMessage: ['', [Validators.required]],
      userId: ['', [Validators.required]],
    });
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
    this.hubConnection.on(EnumSocket.ReceiveMessage, (user, message) => {
      this.lastMessage = {
        user: user,
        message: message,
      };
      console.log(`${user} says ${message}`);
    });
  }

  public sendMessage(): void {
    console.log(this.messageForm.get('userMessage')!.value);

    this.hubConnection
      .invoke(
        EnumSocket.SendMessage,
        'Esteban',
        this.messageForm.get('userMessage')!.value
      )
      .catch((err) => console.error('Error while sending message: ' + err));
  }

  public getMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
