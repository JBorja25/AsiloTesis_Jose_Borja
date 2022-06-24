import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { CambiarimgComponent } from '../cambiarimg/cambiarimg.component';
import { ChangemailComponent } from '../changemail/changemail.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-profileasilo',
  templateUrl: './profileasilo.component.html',
  styleUrls: ['./profileasilo.component.scss']
})
export class ProfileasiloComponent implements OnInit {

  token: string = '';

  data: any = {};
  dataUser: any = {};
  nombre: string = '';
  telefono: string = '';
  direccion: string = '';
  correo: string = '';
  idDoc: string = '';
  passw: string = '';
  mostrarFormulario: boolean = true;
  aprobado: boolean = false;
  patternCorreo: boolean = false;

  profileAsilo: FormGroup;

  constructor(
    private _auth: AuthService,
    private _cookie: CookieService,
    private _dialog: MatDialog,
    public router: Router,
    private toastr: ToastrService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.token = this._cookie.get('uid');

    this.getData();
    this.getDataFirebase();
    
    this.crearFormulario();
  } 

  crearFormulario(){
    this.profileAsilo = this._fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: [''],
      direccion: [''],
      email: ['', [Validators.pattern('^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?$')]],
      passw: ['', [Validators.minLength(6)]]
    })
  }

  getDataFirebase(){
    // console.log(this.re);
    
    this._auth.getPost(this.token)
    .subscribe((respData: any) =>{
      console.log(respData);
      if(respData.docs.length > 0){
        for(let f of respData.docs){
          this.aprobado = f.data().aprobado;
          console.log(f.data());
          this.mostrarFormulario = f.data().mostrarRegistroAsilo;
        }
        
      }
    });
  }


  getData() {
    this._auth.traerDataFirebase(this.token)
      .subscribe((resp: any) => {
        console.log(resp);

        for (let f of resp.docs) {
          // this.data = f.data()
          this.idDoc = f.id;
          

          this._auth.insertName()
          .subscribe((resp) =>{
            this.profileAsilo.setValue({
              nombre: resp.displayName,
              telefono: f.data().phone,
              direccion: f.data().direccion,
              email: resp.email,
              passw: ''
            })
          });
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

  async cerrar(){
    this._cookie.deleteAll();
    await  this._auth.logout();
    this.router.navigateByUrl('/login', {replaceUrl: true, skipLocationChange: false});
  }

  guardar() {


    // if de la contrasenia
    this._auth.insertName()
      .subscribe((cambiarnom) => {
        console.log(this.nombre);

        let nom =this.profileAsilo.get('nombre').value.length > 0 ? this.profileAsilo.get('nombre').value : this.dataUser.displayName; //copia lineas y cambiar
        cambiarnom.updateProfile({
          displayName: nom
        })
          .then((nombre) => {
            console.log('cambiado nombre', nombre);
            this.getData();
            console.log(this.direccion);
            
            
           
            
            
            if(this.profileAsilo.get('email').value.length > 2 && (this.profileAsilo.get('email').dirty || this.profileAsilo.get('email').touched)){
              let corr = (this.profileAsilo.get('email').value.length > 0) ? this.profileAsilo.get('email').value : this.dataUser.email;

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


            if (this.profileAsilo.get('passw').value.length > 5 && (this.profileAsilo.get('passw').dirty || this.profileAsilo.get('passw').touched)) {
              let passw = this.profileAsilo.get('passw').value;
              cambiarnom.updatePassword(passw)
                .then((phone) => {
                  console.log('cambiado contrasenia', passw);
                }).catch((error) => {
                  console.log(error);
                })
            }

            
            let dir = (this.profileAsilo.get('direccion').value.length > 0) ? this.profileAsilo.get('direccion').value : this.data.direccion;
            let num = (this.profileAsilo.get('telefono').value.length > 0) ? this.profileAsilo.get('telefono').value : this.data.phone;
            this._auth.updateDireccion(dir, num, this.idDoc)
              .then((respDirec) => {
                console.log('se actualizo');
                this.getData();

              })
              .catch((error) => { });
          })
          
      });
      this.toastr.success('INFORMACION ', 'Actualizada!');

      
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
    if(this.correo.match('^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?$')){
      this.patternCorreo = false;
    }else{
      this.patternCorreo = true;
    }
  }
  cambioPass(evento: any) {
    this.passw = evento;
  }

  cambiarcor() {
    if(this.correo.length > 0 || this.passw.length > 0){
      const dialog = this._dialog.open(ChangemailComponent, {
        disableClose: true,
      });
      dialog.afterClosed()
        .subscribe((resp) => {
          console.log(resp);
          
          if (resp) {
            this.guardar();
            this.passw = '';
            // this._auth.logout();
            
          }
        });
      
    }else{
      // this.getData();
      this.guardar();
    }

    

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


  /* Errores */

  get errorNombre(){
    return this.profileAsilo.get('nombre').hasError('required') && (this.profileAsilo.get('nombre').touched || this.profileAsilo.get('nombre').dirty);
  }
  get errorNombreMin(){
    return this.profileAsilo.get('nombre').hasError('minlength') && (this.profileAsilo.get('nombre').touched || this.profileAsilo.get('nombre').dirty);
  }

  get errorCorreo(){
    return this.profileAsilo.get('email').hasError('pattern') && (this.profileAsilo.get('email').touched || this.profileAsilo.get('email').dirty);
  }
  get errorCorreoVacio(){
    return this.profileAsilo.get('email').value.length > 0 && (this.profileAsilo.get('email').touched || this.profileAsilo.get('email').dirty);
  }

  get errorPassw(){
    return this.profileAsilo.get('passw').hasError('minlength') && (this.profileAsilo.get('passw').touched || this.profileAsilo.get('passw').dirty);
  }
  get errorPasswVacio(){
    return this.profileAsilo.get('passw').value.length > 0 && (this.profileAsilo.get('passw').touched || this.profileAsilo.get('passw').dirty);
  }
  




}
