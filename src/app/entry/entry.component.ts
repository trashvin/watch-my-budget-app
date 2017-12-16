import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
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
    this.action = data.action;
    if (this.action === this.constant.action_add ) {
      this.entry = new Entry(0, "", false, 0, "");
    } else {
      this.entry = this.session.active_entry;
    } 
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSave() {
    this.session.is_processing = true;
    this.log.l(this.session.is_processing);
    this.event = this.session.active_event;
    this.log.raw(this.event);
    if ( this.action === this.constant.action_add ) {
      this.entry.id = this.event.entry_counter + 1;
      this.stitch.addEntry(this.event, this.entry);
    } else {
      this.stitch.editEntry(this.event, this.entry);
    }
    
    this.dialogRef.close();
  }
  onEdit() {
    this.action = this.constant.action_edit;
    this.title = "Edit Entry";
  }
  

}
