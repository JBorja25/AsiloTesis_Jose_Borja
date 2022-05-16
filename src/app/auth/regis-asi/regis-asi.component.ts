import { AfterViewInit, Component, OnInit } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PostService } from 'src/app/models/post.service';
import { AuthService } from '../services/auth.service';

import { DomSanitizer } from '@angular/platform-browser';

import { Post } from '../../models/post.model';
import { SubirfotosService } from '../services/subirfotos/subirfotos.service';

@Component({
  selector: 'app-regis-asi',
  templateUrl: './regis-asi.component.html',
  styleUrls: ['./regis-asi.component.scss']
})
export class RegisAsiComponent implements OnInit, AfterViewInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;



  toppings: FormGroup;
  showFiller = false;
  public postForm:FormGroup;
  uuid: string = '';
  confirmar: boolean = false;
  rechazar: boolean = false;
  mostrarFormulario: boolean = true;
  aprobado: boolean = false;
  cuentaVerificada:boolean = false;
  public registroAnterior: any = {};
  idDoc: string = '';
  mayus = 'mayus';
  mostrarImagen: any = '';
  FotoSubir: File;

  urlFotofirebase: any = '';
  rool:string='';
  
  constructor(
    public postService:PostService,
    public formBuilder:FormBuilder,
    public router: Router,
    private _cookie: CookieService,
    private _auth: AuthService,
    private _fotos: SubirfotosService,
    private _sanitazer: DomSanitizer,
    private _formBuilder: FormBuilder

  ) {
    this.postForm= this.formBuilder.group({
      name:[''],
      address:[''],
      email:[''],
      fono:[''],
    });
    this.uuid = this._cookie.get('uid');
    this.registroAnterior = 'prueba de envio';
  }
  ngAfterViewInit(): void {
    
    this.rool=this._cookie.get('tipo')
  }
  
  
  async ngOnInit() {
    this.getDataFirebase();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  getDataFirebase(){
    // console.log(this.re);
    
    this._auth.getPost(this.uuid)
    .subscribe((respData: any) =>{
      console.log(respData);
      if(respData.docs.length > 0){
        for(let f of respData.docs){
          console.log(f.data());
          this.mostrarFormulario = f.data().mostrarRegistroAsilo;
          this.confirmar = f.data()?.confirmacion;
          this.rechazar = f.data().rechazar;
          this.aprobado = f.data().aprobado;
          this.registroAnterior = f.data();
          this.cuentaVerificada=f.data().cuentaVerificada;
          this.idDoc = f.id;
        }
        
      }
    });
  }
  onSubmit(){
    // trear la data del usuario
    // iddoc
    this._auth.traerDataFirebase(this.uuid)
    .subscribe((respData) =>{
      console.log(respData);
      for(let f of respData.docs){
        let enviarFirebase: Post = {
          ...this.postForm.value,
          uid: this.uuid,
          mostrarRegistroAsilo: false,
          rechazar: false,
          confirmacion: true,
          aprobado: false,
          cuentaVerificada:false,
          foto: this.urlFotofirebase
        }
        this.postService.createPosts(enviarFirebase)
        .then((resp) =>{
          console.log('se registro correctamente' ,resp);
          this.getDataFirebase();

          this._fotos.insertImages(this.FotoSubir);

        })
      }
      
    })
    // // this.router.navigate(['/home'])
    // alert("registro realizado\muchas gracias ");
  }


  llenadoFormulario(evento: any){
    console.log(evento);
    this.getDataFirebase();
    
  }

/* 
  TODO: falta de hacer algo
*/
  // funciona para una imagen
  cambioImagen(evento: any){
    
    console.log(evento);
    this.FotoSubir = evento.target.files[0];
    const rul =URL.createObjectURL(evento.target.files[0]);
    this.mostrarImagen = (evento.target.files.length > 0) ? this._sanitazer.bypassSecurityTrustUrl(rul): '';
    console.log(rul);
    this._fotos.insertImages(this.FotoSubir)
    .then((resp)=>{
      resp.ref.getDownloadURL()
      .then((respGet)=>{
        this.urlFotofirebase = respGet;
      })
      .catch((error) =>{

      });
    }).catch((error)=>{

    });
    
  }


  cambioImagenPdf(evento: any){
    console.log(evento.target.files[0]);
    
  }

  async cerrar(){
    this._cookie.deleteAll();
    await  this._auth.logout();
    this.router.navigateByUrl('/login', {replaceUrl: true, skipLocationChange: false});
  }

  


}
