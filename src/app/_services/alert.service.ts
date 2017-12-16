import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AlertService {
  private message = new Subject<any>();
  constructor() { }
  sendMessage(message: string, type = 1, category = 0) {
    this.message.next({text: message, type: type});
  }
  getMessage(): Observable<any> {
    return this.message.asObservable();
  }
  clearMessage() {
    this.message.next();
  }

}
