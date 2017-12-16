import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Subscription } from "rxjs/Subscription";


import { StitchService, LocalStorageService, SessionStorageService } from "../_services/index";
import { Logger } from "../_library/logger";

@Injectable()
export class EventsResolver implements Resolve<any> {
  private log = new Logger("Events", "Resolver");
  private subscriber: Subscription;
  constructor(
    private stitchService: StitchService,
    private store: LocalStorageService,
    private session: SessionStorageService
  ) {
    
  }
  resolve(route: ActivatedRouteSnapshot) {
    this.session.is_processing = true;
    this.log.i("Resolving events data");
    return this.stitchService.getEvents();
  }
}
