import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
// Custom
import { environment } from "../../environments/environment";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent {
  version = environment.version;
  copyright = environment.copyright;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }


}
