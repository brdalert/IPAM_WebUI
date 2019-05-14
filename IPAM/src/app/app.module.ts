import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatCardModule, MatInputModule, MatSelectModule, MatDialogModule, MatListModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RecordFormComponent } from './record-form/record-form.component';
import { ReactiveFormsModule, FormsModule} from '@angular/forms'
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogOverviewComponent } from './dialog-overview/dialog-overview.component';


@NgModule({
  declarations: [
    AppComponent,
    RecordFormComponent,
    DialogOverviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[DialogOverviewComponent]
})
export class AppModule { }
