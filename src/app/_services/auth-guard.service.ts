import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router } from "@angular/router";
//
import { Logger } from "../_library/logger";
import { StitchService } from "../_services/stitch.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  private log = new Logger("AuthGuard", "Service");
  constructor(
    private stitch: StitchService,
    private router: Router
  ) {}
  canActivate(): boolean {
    this.log.functionName = "canActivate";
    this.log.i("Auth Guard is ON");
    if (!this.stitch.isAuthenticated()) {
      this.log.w("Route Forbidden");
      this.log.l("Redirecting to login");
      this.router.navigate(["/login"]);
      return false;
    } else {
      this.log.l("Route allowed");
      return true;
    }
  }
}
