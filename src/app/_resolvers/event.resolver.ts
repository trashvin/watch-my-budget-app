import { Injectable } from "@angular/core";
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { Subscription } from "rxjs/Subscription";


import { StitchService, LocalStorageService, SessionStorageService } from "../_services/index";
import { Logger } from "../_library/logger";

@Injectable()
export class EventResolver implements Resolve<any> {
  private log = new Logger("Event", "Resolver");
  private subscriber: Subscription;
  constructor(
    private stitch: StitchService,
    private store: LocalStorageService,
    private session: SessionStorageService,
    private route: ActivatedRoute
  ) {
    
  }
  resolve(routeSnapshot: ActivatedRouteSnapshot
  ) {
    this.session.is_processing = true;
    this.log.i("Resolving event data");
    this.stitch.getEvent(routeSnapshot.params.event_id);
    this.session.is_processing = false;
    return this.stitch.eventsChanged.value[0];
  }
}
