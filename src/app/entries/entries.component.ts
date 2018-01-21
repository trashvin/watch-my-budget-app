import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { Router, Route, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Location } from "@angular/common";

// custom
import { EventComponent } from "../event/event.component";

import { Event, Entry} from "../_models/index";
import { SessionStorageService, StitchService } from "../_services/index";
import { EntryComponent } from "../entry/entry.component";
import { AppConstants } from "../app-constants";
import { Logger } from "../_library/logger";
import { EventsDataSource } from "../_data-sources/events.datasource";
import { EntriesDataSource } from "../_data-sources/entries.datasource";
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";

@Component({
  selector: "app-entries",
  templateUrl: "./entries.component.html",
  styleUrls: ["./entries.component.css"]
})
export class EntriesComponent implements OnInit {
  entries: Entry[];
  event: Event;
  column_headers = ["indicator","exclude", "description", "action"];
  data_source;
  private subscriber: Subscription;
  private is_view_active: boolean;
  private log = new Logger("Entries", "Component");
  total_expenses = 0;
  total_funds = 0;
  total = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionStorageService,
    private dialog: MatDialog,
    private constant: AppConstants,
    private stitch: StitchService,
    private changeDetector: ChangeDetectorRef,
    private location: Location
  ) { }

  ngOnInit() {
    this.subscriber = this.route.params.subscribe(params => {
      this.event = this.route.snapshot.data["event"];
      this.session.active_event = this.event;
      this.log.raw(this.event);
    });
    // this.entries = this.event.entries;
    this.data_source = new EntriesDataSource(this.stitch, this.event._id);
    if (this.is_view_active) {
      this.log.l("Detecting changes...");
      this.changeDetector.detectChanges();
    }
    // this.event = this.session.active_event;
    this.session.is_processing = false;
    this.session.is_main = false;
  }
  onAddEntry() {
    // this.session.is_processing = true;
    this.log.raw(this.event);
    const dialogRef = this.dialog.open(EntryComponent, {
      data: {title: "New Entry", action: this.constant.action_add},
      width: "410px"
    });
  }
  onDelete(entry: Entry) { 
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {message: `Do you want to delete ${entry.description}?`, title: "Confirm Delete", type: this.constant.dialog_yes_no},
      width: "350px"
    });
    dialogRef.afterClosed().subscribe(result => {
      this.log.raw(result);
      if (result.result === this.constant.dialog_result_yes) {
        this.log.i("Deleting....");
        this.session.is_processing = true;
        this.event = this.session.active_event;
        this.stitch.deleteEntry(this.event, entry);
      }
    });
  }
  onEdit(entry: Entry) {
    this.session.active_event = this.event;
    this.session.active_entry = entry;
    const dialogRef = this.dialog.open(EntryComponent, {
      data: {title: "Edit Entry", action: this.constant.action_edit},
      width: "350px"
    });
  }
  onDetails(entry: Entry) {
    this.session.active_event = this.event;
    this.session.active_entry = entry;
    const dialogRef = this.dialog.open(EntryComponent, {
      data: {title: "Entry Detail", action: this.constant.action_view},
      width: "350px"
    });
  }
  goBack() {
    this.location.back();
  }
  
}
