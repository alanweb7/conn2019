import { Component } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, LoadingController, ToastController, ActionSheetController, Events, Slides } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ViewChild } from '@angular/core';
//import Provider
import { ClienteProvider } from './../../providers/cliente/cliente';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
import { UsuarioService } from '../../providers/movie/usuario.service';
//import Native
import { Camera, CameraOptions } from "@ionic-native/camera";

@IonicPage({
  priority: 'off',
  segment: 'MinhaConta/:token/:lang'
})
@Component({
  selector: 'page-minha-conta',
  templateUrl: 'minha-conta.html',
})
export class MinhaContaPage {
  @ViewChild('mySlider') slider: Slides;
  model: Conta;
  @ViewChild(Navbar) navBar: Navbar;
  //validação de formulario
  public contaForm: any;
  photo_bd: any;
  segmentos: any[];
  messagefirst_name = "";
  messagelast_name = "";
  messageuser_name = "";
  messageuser_email = "";
  messageavatar = "";
  messagenome_empresa = "";
  messagensegmento_empresa = "";
  errorfirst_name = false;
  errorlast_name = false;
  erroruser_name = false;
  erroruuser_email = false;
  erroruavatar = false;
  errornome_empresa = false;
  errorsegmento_empresa = false;
  token: any;
  photo_base64: any;
  first_name: String;
  last_name: String;
  user_email: String;
  nome_empresa: String;
  segmento_empresa: String;
  cidade_empresa: String;
  user_cep: String;
  estado_empresa: String;
  avatar: String;
  lang: String;
  nome: String;
  sobrenome: String;
  selectedSegment: string;
  btn_salvar;
  email: String;
  empresa: String;
  segmento: String;
  cep: String;
  cidade: String;
  estado: String;
  page: String;
  msg_servidor;
  load_aguarde;
  data = {
    id_serv: Number,
    name: String,
    sobrenome: String,
    email: String,
    photo: String,
    tp_pessoa: String,
    cpf: String,
    cnpj: String,
    cep: String,
    endereco: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    telefone: String,
    celular: String,
    usuario: String,
    logado: String,
    token: String,

  }
  searchTerm$ = new Subject<string>();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    formBuilder: FormBuilder,
    public net: NetworkProvider,
    public loadingCtrl: LoadingController,
    private cli_Provider: ClienteProvider,
    public toast: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    private usuario: UsuarioService,
    public util: UtilService,
    private events: Events,
  ) {
    //instanica do model login
    this.model = new Conta();
    //instancia do formulario builder para validar os campos
    this.contaForm = formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      user_email: ['', Validators.required],
      nome_empresa: ['', Validators.required],
      segmento_empresa: ['', Validators.required],
      cidade_empresa: ['', Validators.required],
      estado_empresa: ['', Validators.required],
      user_cep: ['', Validators.required],
    });
    this.data.logado = String;
    this.selectedSegment = '0';


  }


  ionViewDidLoad() {
    this.data.name = String;
    this.data.logado = String;
    this.token = this.navParams.get('token');
    this.lang = this.navParams.get('lang');
    this.nome = this.navParams.get('nome');
    this.sobrenome = this.navParams.get('sobrenome');
    this.empresa = this.navParams.get('empresa');
    this.segmento = this.navParams.get('segmento');
    this.cep = this.navParams.get('cep');
    this.cidade = this.navParams.get('cidade');
    this.estado = this.navParams.get('estado');
    this.page = this.navParams.get('page');
    this.email = this.navParams.get('email');
    this.load_aguarde = this.navParams.get('load_aguarde');
    this.msg_servidor = this.navParams.get('msg_servidor');
    this.segmentos = [];
    this.getInfoConta();
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.navCtrl.setRoot('HomePage');

    }
  }
  change_segmento($event) {

    this.model.segmento_empresa = $event;

  }
  onCancel() {
    return this.model.user_cep = "";
  }
  closeModal() {
    this.navCtrl.pop();
  }
  //trocar o slide de acordo com o segment
  onSegmentChanged(segmentButton) {
    const selectedIndex = segmentButton.value;
    this.slider.slideTo(selectedIndex);
  }
  //trocar a o segment de acordo com o slide
  onSlideChanged(slider) {
    const currentSlide = slider.getActiveIndex();
    if (currentSlide == 0) {
      this.selectedSegment = '0';
    } else if (currentSlide == 1) {
      this.selectedSegment = '1';
    } else if (currentSlide == 2) {
      this.selectedSegment = '2';
    }

  }
  //chama pra escolher a opção da foto
  onActionSheet(): void {
    this.actionSheetCtrl.create({
      title: 'Selecione a image',
      buttons: [
        {
          text: 'Galeria',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    }).present();
  }
  onSearchByKeyword() {
    this.util.getCEP(this.model.user_cep)
      .then((results: any) => {
        if (results) {
          this.cidade_empresa = results.cidade;
          this.estado_empresa = results.estado;
          this.model.cidade_empresa = results.cidade;
          this.estado_empresa = results.estado;
        }

      });
    console.log(this.searchTerm$);
  }

  // renovar foto do perfil
  private takePicture(sourceType: number): void {


    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetWidth: 1200,
      targetHeight: 1200
    }

    this.camera.getPicture(cameraOptions)
      .then((fileUri: string) => {

        let base64Image = 'data:image/jpeg;base64,' + fileUri;
        let originPhoto = 'base64';
        this.model.photo = base64Image;
        this.photo_bd = base64Image;

      }).catch((err: Error) => {
        console.log('Erro na funcao da foto do perfil: ', err);
      });

  }

  getInfoConta() {

    this.util.showLoading(this.load_aguarde);
    this.cli_Provider.getinfConta(this.token)
      .then((result: any) => {
        this.util.loading.dismissAll();
        if (result.status == 200) {
          this.cli_Provider.getSegmento().then((result: any) => {
            this.segmentos = result;

          }, (error: any) => { });
          this.first_name = result.first_name;
          this.last_name = result.last_name;
          this.user_email = result.user_email;
          this.nome_empresa = result.nome_empresa;
          this.segmento_empresa = result.segmento_empresa;
          this.cidade_empresa = result.cidade_empresa;
          this.user_cep = result.user_cep;
          this.estado_empresa = result.estado_empresa;
          // this.avatar = result.avatar;
          this.photo_bd = result.avatar;
          ///model
          this.model.first_name = this.first_name;
          this.model.last_name = this.last_name;
          this.model.user_email = this.user_email;
          this.model.nome_empresa = this.nome_empresa;
          this.model.segmento_empresa = this.segmento_empresa;
          this.model.cidade_empresa = this.cidade_empresa;
          this.model.user_cep = this.user_cep;
          this.model.estado_empresa = this.estado_empresa;
          // this.model.avatar = this.avatar;
          // this.photo_bd = this.model.photo;
        } else if (result.status == 402) {
          this.toast.create({ message: result.message, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'error' }).present();
          this.navCtrl.push('LoginPage', { lang: this.lang });

        } else {
          this.toast.create({ message: result.message, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'error' }).present();

        }
      }, (error: any) => {
        this.toast.create({ message: this.msg_servidor, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'error' }).present();
        this.util.loading.dismissAll();
        this.navCtrl.setRoot('HomePage');
      });


  }
  updateConta() {

    this.util.showLoading(this.load_aguarde);
    this.cli_Provider.UpdateAccount(this.model.first_name, this.model.last_name, this.model.avatar, this.model.photo, this.model.user_email, this.model.nome_empresa, this.model.segmento_empresa, this.model.user_cep, this.model.estado_empresa, this.model.cidade_empresa, this.token, this.lang)
      .then((result) => {
        console.log('Dados retornados em minha-conta.ts: ', result);
        this.util.loading.dismissAll();
        if (result.status == 200) {
          this.toast.create({ message: result.message, position: 'botton', duration: 10000, showCloseButton: true, closeButtonText: 'Ok!', cssClass: 'sucesso' }).present();
          this.usuario.update(result.user_data.first_name, result.user_data.last_name, result.user_data.user_email, result.user_data.avatar, "", "", "1", this.token, result.user_data.user_id)
            .then((data: any) => {
              let dados = new Data();
              dados.id_serv = result.user_data.user_id;
              dados.name = result.user_data.first_name;
              dados.sobrenome = result.user_data.last_name;
              dados.email = result.user_data.user_email;
              dados.photo = result.user_data.avatar;
              dados.logado = "1";
              dados.token = this.token;
              this.first_name = result.user_data.first_name;
              this.last_name = result.user_data.last_name;
              this.user_email = result.user_data.user_email;
              this.events.publish('dados', dados);

            });
          this.usuario.update_Endereco(result.user_data.nome_empresa, result.user_data.segmento_empresa, result.user_data.user_cep, result.user_data.cidade_empresa, result.user_data.estado_empresa, result.user_data.user_id).then((data: any) => {
          });

        } else if (result.status == 402) {
          this.toast.create({ message: result.message, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'error' }).present();
          this.navCtrl.push('LoginPage', { lang: this.lang });

        } else {
          this.toast.create({ message: result.message, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'error' }).present();

        }
      }, (error: any) => {
        this.toast.create({ message: this.msg_servidor, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'error' }).present();
        this.util.loading.dismissAll();
        this.navCtrl.setRoot('HomePage');
      });


  }
}
export class Conta {
  first_name: String;
  last_name: String;
  user_email: String;
  avatar: String;
  photo: String;
  nome_empresa: String;
  segmento_empresa: String;
  cidade_empresa: String;
  estado_empresa: String;
  user_cep: String;
}
export class Data {
  public id_serv: number;
  public name: String;
  public sobrenome: String;
  public email: String;
  public photo: String;
  public logado: String;
  public token: String;
}
