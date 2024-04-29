import { TestBed } from '@angular/core/testing';

import { SocketChatService } from './socket-chat.service';

describe('SocketChatService', () => {
  let service: SocketChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
