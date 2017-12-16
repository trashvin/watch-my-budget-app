import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";

// Custom
import { Event } from "../_models/index";
import { StitchService, SessionStorageService } from "../_services/index";
import { Logger } from "../_library/logger";
import { AppConstants } from "../app-constants";


@Component({
  selector: "app-dialog-box",
  templateUrl: "./dialog-box.component.html",
  styleUrls: ["./dialog-box.component.css"]
})
export class DialogBoxComponent {
  private log = new Logger("DialogBox", "Component");
  message: string;
  title: string;
  ok_visible = false;
  cancel_visible = false;
  yes_visible = false;
  no_visible = false;
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private constant: AppConstants
  ) { 
    this.dialogRef.disableClose = true;
    this.message = data.message;
    this.title = data.title;
    this.log.l(data.type);
    switch (data.type) {
      case this.constant.dialog_ok_only:
        this.ok_visible = true;
        break;
      case this.constant.dialog_ok_cancel:
        this.ok_visible = true;
        this.cancel_visible = true;
        break;
      case this.constant.dialog_yes_no:
        this.yes_visible = true;
        this.no_visible = true;
        break;
      default:
        this.ok_visible = true;
    }
  }
  onOk() {
    this.dialogRef.close({result: this.constant.dialog_result_ok});
  }
  onCancel() {
    this.dialogRef.close({result: this.constant.dialog_result_cancel});
  }
  onYes() {
    this.dialogRef.close({result: this.constant.dialog_result_yes});
  }
  onNo() {
    this.dialogRef.close({result: this.constant.dialog_result_no});
  }


}
