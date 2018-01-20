import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";


// Custom
import { EventComponent } from "../event/event.component";
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";
import { Event } from "../_models/index";
import { StitchService, SessionStorageService } from "../_services/index";
import { Logger } from "../_library/logger";
import { EventsDataSource } from "../_data-sources/events.datasource";
import { AppConstants } from "../app-constants";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.css"]
})
export class EventsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() events: Event[];
  column_headers = ["description", "action"];
  data_source;
  subscriber: Subscription;
  private is_view_active: boolean;
  private log = new Logger("Events", "Component");
  over_budget = false;
  constructor(
    private router: Router,
    private session: SessionStorageService,
    private stitch: StitchService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private constant: AppConstants,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.log.i("Init");
    // this.subscriber = this.route.params.subscribe(params => {
    //   this.events = this.route.snapshot.data[this.constant.resolved_events];
    // });
    // this.subscriber = this.stitch.getMessage().subscribe(message => { this.log.w(message.text); });
    this.data_source = new EventsDataSource(this.stitch);
    if (this.is_view_active) {
      this.log.l("Detecting changes...");
      this.changeDetector.detectChanges();
    }
    this.session.is_processing = false;
  }
  ngOnDestroy(): void {
    this.is_view_active = false;
  }
  ngAfterViewInit(): void {
    this.is_view_active = true;
  }
  onAddEvent() {
    const dialogRef = this.dialog.open(EventComponent, {
      data: {title: "Add Event", action: this.constant.action_add},
      width: "410px"
    });
  }
  onSelectRow(event: Event ) {
    this.session.active_event = event;
    this.router.navigateByUrl("/dashboard/event/" + event._id);
  }
  onEditEvent(event: Event) {
    this.session.active_event = event;
    const dialogRef = this.dialog.open(EventComponent, {
      data: {title: "Edit Event", action: this.constant.action_edit},
      width: "410px"
    });
  }
  onDeleteEvent(event:Event) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {message: `Do you want to delete ${event.description}?`, title: "Confirm Delete", type: this.constant.dialog_yes_no},
      width: "410px"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.log.raw(result);
      if (result.result === this.constant.dialog_result_yes) {
        this.log.i("Deleting....");
        this.session.is_processing = true;
        this.stitch.deleteEvent(event._id);
      }
    });
  }
  onDetailEvent(event: Event) {
    this.session.active_event = event;
    const dialogRef = this.dialog.open(EventComponent, {
      data: {title: "Event Details", action: this.constant.action_view},
      width: "410px"
    });
  }
  getEntryCount(event: Event): number {
    return (event.entries !== undefined) ? event.entries.length : 0;
  }
  getProgress(event: Event) {
    if (event.getTotalFund() >= event.getTotalExpense()) {
      return (event.getTotalExpense() / event.getTotalFund()) * 100;
    } else {
      return 100 * ( event.getTotalFund() / event.getTotalExpense());
    }
  }
  isOverBudget(event: Event) {
    return ( event.getTotalExpense() > event.getTotalFund()) ? true : false ;
  }

}
