import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { Location } from "@angular/common";

// custom
import { AboutComponent } from "../about/about.component";
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";
import { Logger } from "../_library/logger";
import { StitchService, LocalStorageService, SessionStorageService } from "../_services/index";
import { AppConstants } from "../app-constants";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  private log = new Logger("Dashboard", "Component");
  subscriber: Subscription;
  user_name: string;
  user_email: string;
  user_picture: string;
  private changeDetector: ChangeDetectorRef;
  constructor(
    private stitch: StitchService,
    private router: Router,
    private store: LocalStorageService,
    private route: ActivatedRoute,
    private constant: AppConstants,
    public session: SessionStorageService,
    private dialog: MatDialog,
    private location: Location
  ) {
  }
  ngOnInit() {
    // this.session.is_processing = false;
    this.subscriber = this.route.params.subscribe(params => {
      const profile = this.route.snapshot.data[this.constant.resolved_profile];
      const events = this.route.snapshot.data[this.constant.resolved_events];
      this.store.user_email = profile.data.email;
      this.store.user_name = profile.data.name;
      this.store.user_picture = profile.data.picture;
    });
    this.user_name = this.store.user_name;
    this.user_email = this.store.user_email;
    this.user_picture = this.store.user_picture;
    this.log.i("After subscribe");
    this.router.navigate(["/dashboard/events"]);
    this.session.is_main = true;
  }
  onLogout() {
    this.log.functionName = "logout";
    this.log.i("Do logout");

    this.stitch.doLogout().then(() => {
      this.log.i("Successful logout");
      this.log.l("Navigating to login");
      this.router.navigate(["/login"]);
      this.session.is_processing = false;
    }).catch( err => {
      this.log.e(err);
    });
  }
  showData() {
    // this.stitch.getData().then( result => {
    //   this.log.l(result);
    // }).catch( err => {
    //   this.log.e(err);
    // });
  }
  onAbout() {
     const dialogRef = this.dialog.open(AboutComponent, {
        data: {message: ""},
        width: "250px"
      });

      /** 
       const dialogRef = this.dialog.open(DialogBoxComponent, {
        data: {message: "Hello World!", title: "Alert", type: this.constant.dialog_yes_no},
        width: "250px"
      });

      dialogRef.afterClosed().subscribe(result => {
        this.log.raw(result.result);
      });
      */
  }
  goBack() {
    this.location.back();
    this.session.is_main = true;
  }
  onHome() {
    this.router.navigate(["/dashboard/events"]);
  }
}
