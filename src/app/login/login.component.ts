import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
// custom
import { Logger } from "../_library/logger";
import { StitchService, SessionStorageService } from "../_services/index";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  private log = new Logger("Login", "Component");
  constructor(
    private stitch: StitchService,
    public session: SessionStorageService,
    private router: Router
  ) {}
  ngOnInit() {
    // check if callback
    if ( this.stitch.isAuthenticated()) {
      this.log.i("Callback after social login, proceed to dashboard");
      this.router.navigate(["/dashboard"]);
    }
  }
  googleLogin() {
    this.log.functionName = "googleLogin";
    this.log.i("Do google login");
    this.session.is_processing = true;
    this.stitch.doLoginGoogle();
  }
  fbLogin() {
    this.log.functionName = "fbLogin";
    this.log.i("Do facebook login");
    this.stitch.doLoginFB();
  }
  // todo: Login using username/password
  anonymousLogin() {
    this.log.functionName = "anonymousLogin";
    this.stitch.doLoginAnonymous().then(() => {
      this.log.i("Successful anonymous login");
      this.log.l("Navigating to dashboard");

      this.router.navigate(["/dashboard"]);
    }).catch( err => {
      this.log.w("Login failed");
      alert("Login failed!");
    });
  }
}
