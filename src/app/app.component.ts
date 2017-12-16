import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
// Custom
import { AlertService } from "./_services/alert.service";
import { Logger } from "./_library/logger";
import { DialogBoxComponent } from "./dialog-box/dialog-box.component";
import { AppConstants } from "./app-constants";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private log = new Logger("App", "Component");
  subscriber: Subscription;
  constructor(
    private alert: AlertService,
    private dialog: MatDialog,
    private constant: AppConstants
    
  ) {
    this.subscriber = this.alert.getMessage().subscribe(message => {
      const dialogRef = this.dialog.open(DialogBoxComponent, {
        data: {message: message.text, title: "Result", type: this.constant.dialog_ok_only},
        width: "250px"
      });
    });

    
  }
}
