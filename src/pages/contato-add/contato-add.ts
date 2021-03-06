import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
/**
 * Generated class for the ContatoAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority : 'low',
  segment  : 'ContatoAdd/:token/:code_id/:setor_id/:page_contato/:btn_publicar/:msg_servidor/:pais_campo/:email_campo/:campo_link/:contato/:departamento/:load_aguarde/:load_enviando',
  defaultHistory:['MeusCodesPage']
})
@Component({
  selector: 'page-contato-add',
  templateUrl: 'contato-add.html',
})
export class ContatoAddPage {
  pais                 : any[];
    //validação de formulario
  public cadastroForm : any;
  model               : contato;
  ctt_pais       : String;
  ctt_titulo     : String;
  ctt_conteudo   : String;
  ctt_tipo       : String;
  token          : any;
  word=/[^0-9]+/g;
  id_code          : any;
  tipo           :any[];
  tp:String;
  isMostraNumber  : String;
  sector_id :String;
  isEmail :String;
  tipos2 : any[];
  load_aguarde;
  load_enviando;
  departamento;
		pais_campo ;
		contato;
		email_campo;
    campo_link;
    lang;
    msg_servidor;
    msg_exlcuir;
    texto;
    page_contato;
    btn_publicar;

  constructor(
                public navCtrl        : NavController,
                public navParams      : NavParams,
                formBuilder           : FormBuilder,
                private codeProvider  : CodeProvider,
                public  net           : NetworkProvider,
                public loadingCtrl    : LoadingController,
                public toast          : ToastController,
                public util           : UtilService

                ) {
                  this.model = new contato();
                  this.cadastroForm = formBuilder.group({
                   pais        : ['', Validators.required],
                   titulo      : ['', Validators.required],
                   conteudo    : ['', Validators.required],
                   tipo        : ['', Validators.required],

                  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContatoAddPage');
    this.sector_id        = "";
    this.id_code          = this.navParams.get('code_id');
    this.token            = this.navParams.get('token');
    this.sector_id        = this.navParams.get('setor_id');
    this.page_contato     = this.navParams.get('page');
    this.btn_publicar     = this.navParams.get('btn_publicar');
    this.load_aguarde     = this.navParams.get('load_aguarde');
    this.load_enviando     = this.navParams.get('load_enviando');
    this.msg_servidor     = this.navParams.get('msg_servidor');
    this.pais_campo       = this.navParams.get('pais_campo');
    this.email_campo      = this.navParams.get('email_campo');
    this.campo_link       = this.navParams.get('campo_link');
    this.contato          = this.navParams.get('contato');
    this.departamento     = this.navParams.get('departamento');
    this.lang     = this.navParams.get('lang');
    console.log(this.sector_id);
    this.tp               = this.navParams.get('tipo');
    console.log(this.tp);
    console.log(this.tp);
    this.pais             = [];
    this.tipo             = [];
    this.tipos2           = [];
    this.isMostraNumber   = "";
    this.isEmail          = "";
    this.getPais();
    this.getListTipo();

    if(this.sector_id != ""){
        this.getSetor();
        this.util.showLoading(this.load_aguarde);
    }
    //this.model.tipo="Whatsapp";
    if(this.sector_id == ""){
      this.model.pais       = "Brazil";
      this.model.calling_code ="+55";
      this.ctt_pais="Brazil";
      console.log("entrei aqui",this.tp);
      this.model.tipo=this.tp;
      if(this.model.tipo   =="whatsapp" || this.model.tipo   =="telefone"){
        this.isMostraNumber = "true";
      }else if(this.model.tipo   =="email"){
        this.isEmail = "true";
      }else{
        this.isMostraNumber = "";
      }
    }

  }
  getPais(){

    this.util.getPaisALL().then((result: any) =>{
      this.pais = result.data;

      } ,(error:any) => {});

  }
  change_segmento($event) {
    this.setFilteredItems();
    console.log(this.model.pais,this.model.calling_code);

  }
  change_segmento_tipo($event) {
   // $event.replace("+",'');
    this.model.tipo =$event;
    if($event =="whatsapp" || $event =="telefone"){
      this.isMostraNumber = "true";
    }else{
      this.isMostraNumber = "";
    }
    if($event =="email"){
        this.isEmail = "true";
    }
  }
  compareFn(e1: String, e2: String): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }
  compare(e1: String, e2: String): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }
  getSetor(){

        this.codeProvider.contato(this.id_code,this.token,"true","","","","","","get",this.sector_id,this.lang).then(
          (result: any) =>{
            console.log('Resultado dos contatos em cotato-adds.ts::', result);
          this.util.loading.dismissAll();
                if(result.status == 200){
                      this.model.tipo              = result.code_sector.tipo;
                      this.model.titulo            = result.code_sector.titulo;
                      this.ctt_conteudo            = result.code_sector.conteudo;
                      this.model.pais              = result.code_sector.pais;
                      this.model.calling_code      = result.code_sector.calling_code;
                      this.model.conteudo          = this.ctt_conteudo;
                      this.tp = this.model.tipo;
                      console.log(this.model.tipo,this.model.conteudo);
                      if(this.model.tipo   =="whatsapp" || this.model.tipo   =="telefone"){
                        this.isMostraNumber = "true";
                      }else{
                        this.isMostraNumber = "";
                      }
                }else if(result.status == 402){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                  this.navCtrl.push('LoginPage',{lang:this.lang});
                }
                else if(result.status == 403){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                }
            } ,(error:any) => {
              this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              this.util.loading.dismissAll();
              this.navCtrl.setRoot('HomePage');
            });

  }
  getListTipo(){

    this.codeProvider.contato(this.id_code,this.token,"list","","","","","","get",this.sector_id,this.lang).then(
      (result: any) =>{
        console.log('Resultado dos contatos em cotato-adds.ts: line-195:', result);
      //this.util.loading.dismissAll();
             this.tipo = result;
             console.log(result);
        } ,(error:any) => {
          this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
         // this.util.loading.dismissAll();
         // this.navCtrl.setRoot('HomePage');
        });

}
 create(){

    this.util.showLoading(this.load_enviando);
          let action;
          if(this.sector_id == ""){
              action ="create";
              if(this.model.pais == "Brazil"){
                  this.model.pais= this.ctt_pais;
              }

          }else{
            action ="update";
          }
          this.codeProvider.contato(this.id_code,this.token,"true",this.model.tipo,this.model.calling_code,this.model.pais,this.model.conteudo,this.model.titulo,action,this.sector_id,this.lang).then(
            (result: any) =>{
              console.log('Resultado dos contatos em cotato-adds.ts:line-221:', result);
                  this.util.loading.dismissAll();
                  if(result.status == 200){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.closeModal();
                    //this.navCtrl.push('ContatoListPage', {token:this.token,code_id:this.id_code });
                    // this.navCtrl.push('LoginPage');
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                    this.navCtrl.push('LoginPage',{lang:this.lang});
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                  }
              } ,(error:any) => {
                this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.util.loading.dismissAll();
                this.navCtrl.setRoot('HomePage');
              });

 }

 filterItems(searchTerm){
  return this.pais.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });

}
setFilteredItems() {
  this.tipos2 = this.filterItems(this.model.pais);
  this.model.calling_code = this.tipos2[0].dial_code;
  console.log(this.tipos2[0]);
}
closeModal() {
  this.navCtrl.pop();
}
}
export class contato{
  calling_code : String;
  pais        :  String;
  titulo      : String;
  conteudo    : String;
  setor_id    : String;
  tipo        : String;

}
