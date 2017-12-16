import { RouterModule, Routes } from "@angular/router";
import { Router, ActivatedRoute, CanActivate} from "@angular/router";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "./_services/index";
import { ProfileResolver, EventsResolver, EventResolver } from "./_resolvers/index";
import { EventsComponent } from "./events/events.component";
import { EntriesComponent } from "./entries/entries.component";

const ROUTES: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
    canActivate: [AuthGuardService]
  },
  { path: "login", component: LoginComponent },
  { path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    resolve: { profile: ProfileResolver, events: EventsResolver },
    children: [
      {
        path: "",
        redirectTo: "events",
        pathMatch: "full"
      },
      {
        path: "events",
        component: EventsComponent,
        resolve: { events: EventsResolver },
      },
      {
        path: "event/:event_id",
        pathMatch: "full",
        component: EntriesComponent,
        resolve: { event: EventResolver }
      }
    ]
  }
];

export const AppRoutes = RouterModule.forRoot(ROUTES);
