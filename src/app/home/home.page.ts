import { Router } from '@angular/router';
import { AuthenticationService } from './../services/auth-firebase.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
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
        private alertController: AlertController,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.nomUsuario = this.authenticationService.activeUser.displayName;
        this.subscripcion = this.listasService.misListasSbj.subscribe(pListas => {
            this.misListas = pListas;
        })
        this.listasService.obtenerListasUsuario(this.authenticationService.activeUser.email);
    }

    ngOnDestroy(): void {
        this.subscripcion.unsubscribe();
    }


    getItems(pIndice: number): string {
        return this.listasService.obtenerChurroItems(pIndice)
    }


    onEditLista(pIdLista: string | null) {
        this.router.navigate(["listas-edit", pIdLista]);
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
