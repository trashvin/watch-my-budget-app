import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";

import { StitchService, LocalStorageService } from "../_services/index";
import { Logger } from "../_library/logger";

@Injectable()
export class ProfileResolver implements Resolve<any> {
  private log = new Logger("Profile", "Resolver");
  constructor(
    private stitchService: StitchService,
    private store: LocalStorageService
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    this.log.i("Resolving profile data");
    return this.stitchService.getUserProfile();
  }
}
