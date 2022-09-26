import { UsuariosService } from './../services/usuarios.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/auth-firebase.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Lista } from '../models/lista';
import { ListasService } from '../services/listas.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

    public misListas: Lista[];
    public subscripcion: Subscription
    public nomUsuario: string

    constructor(
        private authenticationService: AuthenticationService,
        private navController: NavController,
        private listasService: ListasService,
        private modalController: ModalController,
        private alertController: AlertController,
        private router: Router,
        private usuariosService: UsuariosService,
    ) { }

    ngOnInit(): void {
        this.nomUsuario = this.authenticationService.activeUser.displayName;
        this.subscripcion = this.listasService.misListasSbj.subscribe(valor => {
            this.misListas = valor;
        })
        this.listasService.obtenerListasBD();


    }

    ngOnDestroy(): void {
        this.subscripcion.unsubscribe();
    }


    getItems(pIndice: number): string {
        return this.listasService.obtenerChurroItems(pIndice)
    }


    onEditLista(pIdLista: string | null) {
        this.router.navigate(["listas-edit", pIdLista])
        //let copiaLista: Lista = null;
        // if (pLista) {
        //     copiaLista = Object.assign({}, pLista);
        // }
        // this.modalController.create({
        //     component: ListasEditComponent,
        //     breakpoints: [0.25, 0.50],
        //     initialBreakpoint: 0.25,
        //     componentProps: { selectedLista: copiaLista, indexLista: pIndexLista }
        // })
        //     .then(elemento => {
        //         elemento.present();
        //     });

    }

    onDeleteLista(pIndex: number) {
        this.alertController
            .create({
                header: this.misListas[pIndex].nombre,
                message: "Do you really want to delete this list?",
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel"
                    },
                    {
                        text: "Delete",
                        handler: () => {
                            this.listasService.eliminarLista(pIndex);
                        }
                    }
                ]
            })
            .then(alertEl => {
                alertEl.present();
            });
    }

    onLogout() {
        this.alertController
            .create({
                header: "Logout",
                message: "Are you sure you want to log out?",
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel"
                    },
                    {
                        text: "Logout",
                        handler: () => {
                            this.authenticationService.signOut();
                            //this.router.navigate(['auth']);
                            this.navController.navigateRoot('/auth');
                        }
                    }
                ]
            })
            .then(alertEl => {
                alertEl.present();
            });


    }

}
