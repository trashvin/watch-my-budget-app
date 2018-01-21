import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from "@angular/forms";

// Custom
import { Event, Entry } from "../_models/index";
import { StitchService, SessionStorageService } from "../_services/index";
import { Logger } from "../_library/logger";
import { AppConstants } from "../app-constants";
import { AppComponent } from "../app.component";

@Component({
  selector: "app-entry",
  templateUrl: "./entry.component.html",
  styleUrls: ["./entry.component.css"]
})
export class EntryComponent {
  entry_form: FormGroup;
  private log = new Logger("Entry", "Component");
  is_add_new: boolean;
  action = 0;
  title: string;
  entry: Entry;
  event: Event;
  constructor(
    private stitch: StitchService,
    public constant: AppConstants,
    private session: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EntryComponent>,
  ) { 
    this.dialogRef.disableClose = true;
    this.title = data.title;
    this.event = this.session.active_event;
    // this.is_add_new = (data.action === this.constant.action_add) ? true : false;
    let disable = true;
    this.action = data.action;
    if (this.action === this.constant.action_add ) {
      this.entry = new Entry(0, "", false, 0, "");
      disable = false;
    } else {
      this.entry = this.session.active_entry;
      disable = false;
    } 
    this.entry_form = new FormGroup({
      description: new FormControl({value: "", disable: disable}, Validators.required),
      amount: new FormControl({value: "", disable: disable}, Validators.min(0)),
      is_expense: new FormControl({value: "", disable: disable})
    });
    this.entry_form.setValue({
      "description": this.entry.description,
      "amount": this.entry.amount,
      "is_expense": this.entry.is_expense !== true ? false : true;
    });
  }
  private getFormValues() {
    this.entry.description = this.entry_form.get("description").value;
    this.entry.amount = this.entry_form.get("amount").value;
    this.entry.is_expense = this.entry_form.get("is_expense").value;
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSave() {
    this.log.l(this.session.is_processing);
    this.event = this.session.active_event;
    this.log.raw(this.event);
    this.getFormValues();
    if (this.entry_form.status === "VALID") {
      this.session.is_processing = true;
      if ( this.action === this.constant.action_add ) {
        this.entry.id = this.event.entry_counter + 1;
        this.stitch.addEntry(this.event, this.entry);
      } else {
        this.stitch.editEntry(this.event, this.entry);
      }   
      this.dialogRef.close();
    }
  }
  onEdit() {
    this.action = this.constant.action_edit;
    this.title = "Edit Entry";
  }
  

}
