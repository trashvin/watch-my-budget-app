import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from "@angular/forms";
// Custom
import { Event } from "../_models/index";
import { StitchService, SessionStorageService } from "../_services/index";
import { Logger } from "../_library/logger";
import { AppConstants } from "../app-constants";
import { AppComponent } from "../app.component";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"]
})
export class EventComponent {
  new_event = new Event("", "", null);
  event_form: FormGroup;
  title;
  action = 0;
  private is_add_new: boolean;
  private log = new Logger("Event", "Component");
  event;
  min_date = new Date();
  constructor(
    public constant: AppConstants,
    private stitch: StitchService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EventComponent>,
    public session: SessionStorageService
  ) { 
    
    this.dialogRef.disableClose = true;
    this.title = data.title;
    let disable = true;
    // this.is_add_new = (data.action === this.constant.action_add) ? true : false;
    this.action = data.action;
    if (this.action === this.constant.action_add) {
      this.event = new Event("", "", new Date());
      disable = false;
    } else {
      this.event = this.session.active_event;
      disable = false;
    }
    this.event_form = new FormGroup({
      description: new FormControl({value: "", disable: disable}, Validators.required),
      date: new FormControl({value: "", disable: disable}),
      is_closed: new FormControl({value: "", disable: disable})
    });
    
    this.event_form.setValue({
      "description": this.event.description,
      "date": this.event.date,
      "is_closed": this.event.is_closed !== true ? false : true;
    });
  }
  private getFormValues() {
    this.event.description = this.event_form.get("description").value;
    this.event.date = this.event_form.get("date").value;
    this.event.is_closed = this.event_form.get("is_closed").value;
  }

  onSaveEvent() {
    this.log.functionName = "onAddEvent";
    this.log.i("Adding new event");
    this.log.raw(this.event);
    this.getFormValues();
    if (this.event_form.status === "VALID") {
      this.session.is_processing = true;
      if ( this.action === this.constant.action_add) {
        this.stitch.addEvent(this.event);
      } else {
        this.log.raw(this.event);
        this.stitch.updateEvent(this.event);
      }
      this.dialogRef.close();
    }
    
    // this.stitch.addEvent(this.new_event);
  }
  onCancel() {
    this.dialogRef.close();
  }
  onEdit() {
    this.action = this.constant.action_edit;
    this.title = "Edit Event";
  }

}
