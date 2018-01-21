import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Router, ActivatedRoute, CanActivate } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule, NgControl } from "@angular/forms";
// material
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatCardModule, MatProgressBarModule, 
         MatProgressBar, MatFormFieldModule, MatDatepicker, MatDatepickerInput, MatNativeDateModule, MatSnackBar 
          } from "@angular/material";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldControl } from "@angular/material/form-field";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBarModule} from "@angular/material/snack-bar";
// custom
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppRoutes } from "./app.routes";
import { AuthGuardService, StitchService, SessionStorageService, LocalStorageService } from "./_services/index";
import { Logger } from "./_library/logger";
import { AppConstants } from "./app-constants";
import { ProfileResolver, EventsResolver, EventResolver } from "./_resolvers/index";
import { EventsComponent } from "./events/events.component";
import { EventComponent } from "./event/event.component";
import { AboutComponent } from "./about/about.component";
import { EntryComponent } from "./entry/entry.component";
import { EntriesComponent } from "./entries/entries.component";
import { DialogBoxComponent } from "./dialog-box/dialog-box.component";
import { AlertService } from "./_services/alert.service";

@NgModule({
  declarations: [
    AppComponent, 
    LoginComponent, 
    DashboardComponent, 
    EventsComponent, 
    EventComponent, 
    AboutComponent, 
    EntryComponent, 
    EntriesComponent, 
    DialogBoxComponent
  ],
  entryComponents: [
    AboutComponent,
    EventComponent,
    DialogBoxComponent,
    EntryComponent
  ],
  imports: [
    BrowserModule, 
    HttpModule, 
    FormsModule, 
    AppRoutes,
    BrowserAnimationsModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  providers: [
    AuthGuardService,
    StitchService,
    SessionStorageService,
    LocalStorageService,
    AppConstants,
    ProfileResolver,
    EventsResolver,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    EventResolver,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
