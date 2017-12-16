import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
// Custom
import { environment } from "../../environments/environment";
import { version } from "punycode";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent {
  version: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.version = environment.version;
  }


}
