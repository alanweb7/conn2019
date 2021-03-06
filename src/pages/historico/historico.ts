import { UsuarioService } from './../../providers/movie/usuario.service';
import { Component } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams, AlertController, ToastController, Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { HistoricoService } from '../../providers/historico/historico.service';
import { Historico } from '../../models/historico.model';
import { ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
@IonicPage({
  priority: 'off',
  segment: 'Historico/:token',
  defaultHistory: ['HomePage'],

})
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {
  hist: Historico[] = [];
  @ViewChild(Navbar) navBar: Navbar;
  endLat: any;
  endLong: any;
  token: any;
  page;
  msg_exlcuir;
  btn_cancelar;
  btn_excluir;
  msg_erro;
  excluir_msg;
  visite_code;
  lang;
  public userInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private historico: HistoricoService,
    public toast: ToastController,
    private socialSharing: SocialSharing,
    private geoProv: GeolocationProvider,
    private translate: TranslateService,
    private platform: Platform,
    private usuario: UsuarioService,

  ) {

  }
  ionViewDidLoad() {
    this.token = String;
    this.token = "";
    this.token = this.navParams.get('token');
    this.lang = this.navParams.get('lang');

    //CHAMDA DO  BANCO DE DADOS
    this.mostrarStorage();
    this._translateLanguage();
    this.pushGeoinfo();
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.navCtrl.setRoot('HomePage');

    }

    this.userData();

  }

  // capta o que tem no storage
  mostrarStorage() {
    this.historico.getAll()
      .then(async (movies: any) => {
        this.hist = movies;

        console.log('HISTORICO: ', movies);

        let list = [];
        for (let i = 0; i < movies.length; i++) {
          list.push(movies[i].id);
        }
        let myHistory = JSON.stringify(list);
        //  alert('HISTORICO: ' + myHistory );
      });
  }
  pushGeoinfo() {

    this.geoProv.getGeolocation().then((resp: String[]) => {
      console.log('home', resp);

      this.endLat = resp["latitude"];
      this.endLong = resp["longitude"];
      console.log('home', this.endLat, this.endLong);
    });

  }
  pushPage(codeNumber) {

    console.log('historico sem gps');
    let redirectData = {
      liberado: false, origem: 3, lang: this.lang, token: this.token,
      code: codeNumber,
      latitude: this.endLat, longitude: this.endLong,
      telephone: ""
    };

    this.navCtrl.push('RedirectPage', { data: redirectData });

    // this.navCtrl.push('DetalheCodePage', {liberado:false,origem:3,lang:this.lang,token:this.token,
    //   code: codeNumber,
    //   latitude: this.endLat, longitude: this.endLong ,
    //   telephone: ""
    // });


  }
  //chamada alerta de confirmação antes de excluir
  showConfirm(id_serv) {
    const confirm = this.alertCtrl.create({
      title: this.msg_exlcuir,
      message: '',
      buttons: [
        {
          text: this.btn_cancelar,
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: this.btn_excluir,
          handler: () => {
            this.removerFavorito(id_serv);
          }
        }
      ]
    });
    confirm.present();
  }
  removerFavorito(id_serv) {
    //grava o historico
    this.historico.delete(id_serv)
      .then((remove) => {
        if (remove) {
          this.navCtrl.setRoot(this.navCtrl.getActive().component); //atualiza apagina atual
          this.toast.create({ message: this.excluir_msg, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'sucesso' }).present();

        } else {
          this.toast.create({ message: this.msg_erro, position: 'botton', duration: 3000, closeButtonText: 'Ok!', cssClass: 'error' }).present();

        }

      });

  }
  // compartilhar social share
  shareSheetShare(code, card) {
    console.log("card", card);
    if (code != "" && code != null && code != undefined) {
      //remover os espaços em branco e trocar por _
      code = code.replace(/\s/g, "_");
      console.log("card", code);
    }

    let userData = this.userInfo[0];
    let nome = '';
    let sobrenome = '';

    if (userData.name) {
      nome = userData.name;
    }
    if (userData.sobrenome) {
      sobrenome = userData.sobrenome;
    }

    let user = nome + ' ' + sobrenome;

    this.socialSharing.share(user + " convida você para conhecer seu canal Connect ->", "Share subject", card, "https://kscode.com.br/card?code=" + code).then(() => {
      console.log("shareSheetShare: Success");
    }).catch((error) => {
      console.error("shareSheetShare: failed", error);
    });

  }
  private _translateLanguage(): void {
    this.translate.use(this.lang);
    console.log("linguagem", this.lang);
    this._initialiseTranslation();
  }
  private _initialiseTranslation(): void {
    setTimeout(() => {
      this.page = this.translate.instant("default.page_fav");
      this.btn_cancelar = this.translate.instant("default.btn_cancelar");
      this.btn_excluir = this.translate.instant("default.btn_excluir");
      this.msg_exlcuir = this.translate.instant("default.msg_exlcuir");
      this.msg_erro = this.translate.instant("default.msg_erro");
      this.excluir_msg = this.translate.instant("default.excluir_msg");
      this.visite_code = this.translate.instant("default.visite_code");
    }, 250);
  }


  userData() {
    this.platform.ready().then(() => {
      this.usuario.getAll()
        .then((user: any) => {
          console.log('Dados do banco interno: ', user);
          this.userInfo = user;
        });
    });
  }

}
