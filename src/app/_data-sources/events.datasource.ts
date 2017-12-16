import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Route, Router, ActivatedRoute } from "@angular/router";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/observable/of";
import "rxjs/add/operator/switchMap";
import { Location } from "@angular/common";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
// custom
import { Event } from "../_models/index";
import { Logger } from "../_library/logger";
import { StitchService, LocalStorageService } from "../_services/index";
export class EventsDataSource extends DataSource<Event> {
  private log = new Logger("Events", "DataSource");
  constructor(
    private stitch: StitchService
  ) {
    super();
  }
  connect(): Observable<Event[]> {
    this.log.l("Getting events...");
    // get entries then notify
    this.stitch.getEvents();
    return this.stitch.eventsChanged;
  }
  disconnect() {}
  // get data(): Event[] {
  //   return this.stitch.events;
  // }
  get over_count() {
    const events = this.stitch.eventsChanged.value;
    let count = 0;
    if ( events !== null ) {
      for ( const event of events ) {
        if ( event.getTotalExpense() > event.getTotalFund()) {
          count += 1;
        }
      }
    }
    return count;
  }
  get within_count() {
    const events = this.stitch.eventsChanged.value;
    let count = 0;
    if ( events !== null ) {
      for ( const event of events ) {
        if ( event.getTotalExpense() <= event.getTotalFund()) {
          count += 1;
        }
      }
    }
    return count;
  }
}
