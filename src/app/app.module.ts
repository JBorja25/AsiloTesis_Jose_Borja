import { HomeComponent } from './home/home.component';

import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { HTTP } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ReactiveFormsModule, FormBuilder, FormsModule} from '@angular/forms';
import { initializeApp, provideFirebaseApp  }from '@angular/fire/app';
import { Component } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { provideStorage,getStorage } from '@angular/fire/storage';



import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CreateComponent } from './auth/create/create.component';
import { EditComponent } from './auth/edit/edit.component';
import { ShowComponent } from './auth/show/show.component';
import { RegisAsiComponent } from './auth/regis-asi/regis-asi.component';
import { CookieService } from 'ngx-cookie-service';

// import { RegisterModule } from './auth/register/register.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthasilosGuard } from './guards/authasilos.guard';
import { AuthService } from './auth/services/auth.service';
import { RegisallComponent } from './auth/regisall/regisall.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import { PruebaComponent } from './shared/prueba/prueba/prueba.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { Prueba2Component } from './shared/prueba2/prueba2/prueba2.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';


import { MatStepperModule } from '@angular/material/stepper';
import { ProformaModule } from './auth/proforma/proforma.module';
import { PerfilComponent } from './auth/perfil/perfil.component';
import { MatLabel } from '@angular/material/form-field';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { PerfilesComponent } from './auth/perfiles/perfiles.component';



@NgModule({
  declarations: [
  AppComponent,
   CreateComponent,
   EditComponent,
   ShowComponent,
   EditComponent,
   RegisAsiComponent,
   RegisallComponent,
   PruebaComponent,
   Prueba2Component,
   PerfilComponent,
   NavbarComponent,
   HomeComponent,
   RegisterComponent,
   LoginComponent,
   PerfilesComponent

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireAuthModule,
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,
  
    AngularFireStorageModule,
    MatSidenavModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatListModule,
   

    MatStepperModule,
    ProformaModule

  ],
  providers: [CookieService, AuthService],
  bootstrap: [AppComponent],
  exports:[
    NavbarComponent
  ]
})
export class AppModule { }
