import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

// custom
import { Logger } from "../_library/logger";
import { AppConstants } from "../app-constants";
import { Event, Entry } from "../_models/index";
import { SessionStorageService } from "../_services/session-storage.service";
import { AlertService } from "../_services/alert.service";
// For mongodb-stitch
declare var stitch: any;

@Injectable()
export class StitchService {
  private log = new Logger("Stitch", "Service");
  private client = new stitch.StitchClient(environment.stitch_app_id);
  private db: any;
  private events_collection: any;
  private online = true;
  eventsChanged: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);
  entriesChanged: BehaviorSubject<Entry[]> = new BehaviorSubject<Entry[]>([]);
  private result_message = new Subject<any>();
  private event_list = [];
  private entry_list = [];
  constructor(
    private alert: AlertService,
    private constant: AppConstants,
    private session: SessionStorageService
  ) {
    this.online = this.connect();
  }
  private connect() {
    this.log.functionName = "connect";
    if (this.client !== undefined) {
      this.db = this.client
        .service("mongodb", "mongodb-atlas")
        .db(environment.db_name);
      this.events_collection = this.db.collection(environment.event_collection);
      this.log.i("DB online");
      this.getEvents();
      return true;
    } else {
      this.log.e("DB offline");
      return false;
    }
  }
  isAuthenticated(): boolean {
    this.log.functionName = "isAuthenticated";
    let result = false;
    if (this.client.authedId() !== undefined) {
      this.log.i("Authed Id:" + this.client.authedId());
      result = true;
    }
    this.log.l(`Result : ${result}`);
    return result;
  }
  doLoginAnonymous() {
    return this.client.login();
  }
  doLoginGoogle() {
    this.client.authenticate(this.constant.google_auth);
  }
  doLoginFB() {
    this.client.authenticate(this.constant.fb_auth);
  }
  getEvents() {
    return this.events_collection
      .find({ owner_id: this.client.authedId() })
      .then(result => {
        return this.populateEvents(result);
      })
      .catch(err => this.log.e(err));
  }
  populateEvents(data) {
    this.log.functionName = "populateData";
    this.log.l("Inside populate");
    this.event_list = [];
    
    data.forEach(element => {
      this.log.raw(element);
      const event = new Event(
        this.client.authedId(),
        element.description,
        element.date
      );
      event._id = element._id;
      event.is_closed = element.is_closed;
      event.entry_counter = element.entry_counter;
      event.entries = element.entries;
      this.event_list.push(event);
      this.entry_list = element.entries;
    });
    this.log.raw(this.event_list);
    const events_data = this.event_list.slice();
    this.eventsChanged.next(events_data);
    this.session.is_processing = false;
    return this.event_list;
  }
  getEvent(id) {
    this.log.functionName = "getEvent";
    this.log.l(`Getting event : ${id}`); 
    const data = this.event_list.filter(i => i._id.toString() === id.toString());
    this.eventsChanged.next(data);
    const entries = data[0].entries;
    this.entriesChanged.next(entries);
  }
  addEvent(new_event: Event) {
    this.log.functionName = "addEvent";
    this.log.i("Add new event");

    new_event.owner_id = this.client.authedId();

    try {
      this.events_collection
        .insert([new_event])
        .then(result => {
          if (result.insertedIds.length > 0) {
            this.alert.sendMessage("New Event Added.");
            this.getEvents();
          } 
        })
        .catch(err => this.log.e(err));
    } catch (err) {
      this.log.e(err);
    }
  }
  updateEvent(updated_event: Event) {
    this.log.functionName = "updateEvent";
    this.log.l(`Updating ${updated_event.description}`);
    this.events_collection.updateOne({_id: updated_event._id},
      {$set: { description: updated_event.description, date: new Date(updated_event.date), 
        is_closed: updated_event.is_closed}}, { upsert: false})
        .then( result => {
          this.alert.sendMessage("Event Edited.");
          this.log.raw(result);
          this.getEvents();
          this.session.is_processing = false;
        })
        .catch(err => this.log.e(err));
  }
  deleteEvent(id) {
    this.log.functionName = "deleteEvent";
    this.log.i(`Deleting event : ${id}`);

    this.events_collection.deleteOne({_id: id})
      .then( result => {
          this.log.raw(result);
          if (result.deletedCount === 1) {
            this.event_list = this.event_list.filter(i => i._id !== id);
            const data = this.event_list.slice();
            this.eventsChanged.next(data);
            this.session.is_processing = false;
            this.alert.sendMessage("Event Deleted.");
          }
      }). catch( err => this.log.e(err));

  }
  addEntry(event: Event, new_entry: Entry) {
    this.log.functionName = "addEntry";
    this.log.i(`Adding Entry : ${new_entry.description} to Event : ${event.description}`);
    this.events_collection.updateOne({_id: event._id},
      {$push: {entries: {id: new_entry.id, description: new_entry.description, 
        is_expense: new_entry.is_expense, amount: new_entry.amount, 
        category: new_entry.category}}, $inc: {entry_counter: 1}})
      .then( result => {
        this.log.raw(result);
        event.entry_counter += 1;
        event.entries = result.result[0].entries;
        this.entriesChanged.next(event.entries);
        this.session.active_event = event;
        this.session.is_processing = false;
        this.alert.sendMessage("Entry Added.");
      })
      .catch(err => {
        this.log.e(err);
        this.alert.sendMessage("Error adding entry.", this.constant.message_error);
      });
  }
  deleteEntry(event: Event, entry: Entry) {
    this.log.functionName = "deleteEntry";
    this.log.i(`Deleting ${entry.description}.`);
    this.events_collection.updateOne({_id: event._id},
      {$pull: {entries: {id: entry.id}}})
      .then( result => {
        this.log.raw(result);
        event.entries = result.result[0].entries;
        this.entriesChanged.next(event.entries);
        this.session.active_event = event;
        this.session.is_processing = false;
        this.alert.sendMessage("Deleted entry.");
      })
      .catch( err => {
        this.log.e(err);
        this.alert.sendMessage("Error deleting entry.", this.constant.message_error);
        this.session.is_processing = false;
      });
  }
  editEntry(event: Event, entry: Entry) {
    this.log.functionName = "editEntry";
    this.log.l(`Editing entry for event ${event.description}`);
    this.events_collection.updateOne({_id: event._id, "entries.id": entry.id },
      {$set: {"entries.$.description": entry.description, "entries.$.amount": entry.amount,
       "entries.$.is_expense": entry.is_expense, "entries.$.category": entry.category}},
      { upsert: false})
      .then( result => {
        this.log.raw(result);
        event.entries = result.result[0].entries;
        this.entriesChanged.next(event.entries);
        this.alert.sendMessage("Entry edited.");
        this.session.active_event = event;
        this.session.is_processing = false;
      })
      .catch( err => {
        this.log.e(err);
        this.alert.sendMessage("Error editing entry.", this.constant.message_error);
        this.session.is_processing = false;
      });
  }
  doLogout() {
    return this.client.logout();
  }
  getUserProfile() {
    this.log.functionName = "getUserProfile";
    this.log.i("Getting user profile");

    return this.client.userProfile()
      .then(result => {
        return result;
      })
      .catch(err => {
        this.log.e(err);
        this.alert.sendMessage("Error fetching profile", this.constant.message_error);
      });
  }
}
