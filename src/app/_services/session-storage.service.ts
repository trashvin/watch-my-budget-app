import { Injectable } from "@angular/core";
import { Event, Entry } from "../_models/index";

@Injectable()
export class SessionStorageService {
  constructor() {}
  getValue(key: string) {
    return sessionStorage.getItem(key);
  }
  setValue(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }
  public set is_processing(value: boolean) {
    // setting this value starts a new session, clear local storage
    this.setValue("is_processing", value.toString() );
  }
  public get is_processing(): boolean {
    const value = this.getValue("is_processing");
    if ( value != null && value.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
  }
  public set active_event(event: Event) {
    const value = JSON.stringify(event);
    this.setValue("active_event", value);
  }
  public get active_event(): Event {
    return JSON.parse(this.getValue("active_event"));
  }
  public set active_entry(entry: Entry) {
    const value = JSON.stringify(entry);
    this.setValue("active_entry", value);
  }
  public get active_entry(): Entry {
    return JSON.parse(this.getValue("active_entry"));
  }
  public set is_main(value: boolean) {
    // setting this value starts a new session, clear local storage
    this.setValue("is_main", value.toString() );
  }
  public get is_main(): boolean {
    const value = this.getValue("is_main");
    if ( value != null && value.toLowerCase() === "true") {
        return true;
    } else {
        return false;
    }
  }
}
