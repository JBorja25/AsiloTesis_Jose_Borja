import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { CambiarimgComponent } from '../profileasilo/cambiarimg/cambiarimg.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profileadmin',
  templateUrl: './profileadmin.component.html',
  styleUrls: ['./profileadmin.component.scss']
})
export class ProfileadminComponent implements OnInit {

  token: string = '';

  data: any = {};
  dataUser: any = {};
  nombre: string = '';
  telefono: string = '';
  direccion: string = '';
  correo: string = '';
  idDoc: string = '';
  passw: string = '';
  
  constructor(
    private _auth: AuthService,
    private _cookie: CookieService,
    private _id: MatDialog,
    private _dialog: MatDialog,
    public router: Router,
    private _token: CookieService,
    private toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.token = this._cookie.get('uid');
    this.getData();
    this._auth.insertName()
    .subscribe((resp) =>{
      this.nombre = resp.displayName;
    })
  }


  getData() {
    this._auth.traerDataFirebase(this.token)
      .subscribe((resp) => {
        console.log(resp);

        for (let f of resp.docs) {
          console.log(f.id);
          
          this.data = f.data()
          this.idDoc = f.id;

        }
        console.log(this.data);


        console.log(this.data);

        this._auth.insertCorreo()
          .subscribe((resp) => {
            console.log(resp);
            this.dataUser = resp;

            console.log(this.dataUser);
          }

          );


      });
  }




  guardar() {


    // if de la contrasenia
    this._auth.insertName()
      .subscribe((cambiarnom) => {
        console.log(this.nombre);

        let nom = this.nombre.length > 0 ? this.nombre : this.dataUser.displayName; //copia lineas y cambiar
        cambiarnom.updateProfile({
          displayName: nom
        })
          .then((nombre) => {
            console.log('cambiado nombre');
            console.log(this.direccion);
            
            let num = (this.telefono.length > 0) ? this.telefono : this.data.phone;
           
            let corr = (this.correo.length > 0) ? this.correo : this.dataUser.email;
            

            if(this.correo.length > 0){

              this._auth.insertCorreo()
                .subscribe((respc) => {
                  respc.updateEmail(corr)
                    .then((r) => {
                      console.log('actualizado cooreo');
  
                    })
                    .catch((err) => {
                      console.log(err);
  
                    })
                })
            }


            if (this.passw.length > 0) {
              cambiarnom.updatePassword(this.passw)
                .then((phone) => {
                  console.log('cambiado contrasenia', this.passw);
                }).catch((error) => {
                  console.log(error);
                })
            }

            
            let dir = (this.direccion.length > 0) ? this.direccion : this.data.direccion;

            this._auth.updateDireccion(dir, num, this.idDoc)
              .then((respDirec) => {
                console.log('se actualizo');
                this.getData();

              })
              .catch((error) => { });
          })
          this.toastr.success('INFORMACION ', 'Actualizada!');
      });
  }

  cambioNombre(evento: any) {
    this.nombre = evento;
  }

  cambioTelefono(evento: any) {
    this.telefono = evento;
  }

  cambioDireccion(evento: any) {
    this.direccion = evento;
  }
  cambioCorreo(evento: any) {
    this.correo = evento;
  }


  cambiarImg(evento: any) {

    const dialog = this._dialog.open(CambiarimgComponent, {
      disableClose: false,
      data: {
        data: this.dataUser.displayName
      }

    });

    dialog.afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.getData();
        }
      })

  }
  async cerrar(){
    this._cookie.deleteAll();
    await  this._auth.logout();
    this.router.navigateByUrl('/login', {replaceUrl: true, skipLocationChange: false});
  }

  cambioPass(evento: any){

  }
cambiarcor(){

}
}
