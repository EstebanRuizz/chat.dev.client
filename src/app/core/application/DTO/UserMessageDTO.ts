export class UserMessageDTO {
  user: string;
  message: string;

  constructor(user: string, message: string) {
    this.user = user;
    this.message = message;
  }
}
