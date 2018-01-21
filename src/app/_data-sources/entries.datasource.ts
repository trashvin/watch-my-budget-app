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
import { Entry, Event } from "../_models/index";
import { Logger } from "../_library/logger";
import { StitchService, LocalStorageService } from "../_services/index";
export class EntriesDataSource extends DataSource<Entry> {
  private log = new Logger("Entries", "DataSource");
  private entries: Entry[];
  private event_id;
  constructor(
    private stitch: StitchService,
    event_id
  ) {
    super();
    this.event_id = event_id;
    
  }
  connect(): Observable<Entry[]> {
    return this.stitch.entriesChanged;
    
  }
  disconnect(): void {
    // throw new Error("Method not implemented.");
  }
  get total_expenses(): number {
    const entries = this.stitch.entriesChanged.value;
    let total = 0;
    if ( entries != null) {
      for (const entry of entries) {
        if ( entry.is_expense && !entry.is_excluded) {
          total += +entry.amount;
        }
      }
    }
    return total;
  }
  get total_funds(): number {
    const entries = this.stitch.entriesChanged.value;
    let total = 0;
    if ( entries != null) {
      for (const entry of entries) {
        if ( !entry.is_expense && !entry.is_excluded) {
          total += +entry.amount;
        }
      }
    }
    return total;
  }
  get total(): number {
    const entries = this.stitch.entriesChanged.value;
    let total = 0;
    if ( entries != null) {
      for (const entry of entries) {
        if ( !entry.is_excluded) {
          if ( !entry.is_expense ) {
            total += +entry.amount;
          } else {
            total -= entry.amount;
          }
          
        }
      }
    }
    return total;
  }
  get has_entries(): boolean {
    const entries = this.stitch.entriesChanged.value;
    if ( entries != null) {
      if ( entries.length === 0) {
        return false;
      }
      return true;
    }
    return false;
  }
  

  
}
