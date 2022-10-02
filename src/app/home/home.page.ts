import { UsuariosService } from './../services/usuarios.service';
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
    public subscripUsuario: Subscription;
    public subscripListas: Subscription;
    public nomUsuario: string;

    constructor(
        private authenticationService: AuthenticationService,
        private navController: NavController,
        private listasService: ListasService,
        private alertController: AlertController,
        private router: Router,
        private usuariosService: UsuariosService
    ) { }

    ngOnInit(): void {
        this.nomUsuario = this.authenticationService.activeUser.displayName;

        this.subscripListas = this.listasService.misListasSbj.subscribe(pListas => {
            console.log("obtenemos las listas...");
            this.misListas = pListas;
        })

        this.subscripUsuario = this.usuariosService.observarUsuarioActivo().subscribe(pUsuario => {
            console.log("obtenerListasUsuario...");
            this.listasService.obtenerListasUsuario(this.authenticationService.activeUser.email)
        })


    }

    ngOnDestroy(): void {
        this.subscripUsuario.unsubscribe();
        this.subscripListas.unsubscribe();
    }


    getItems(pIndice: number): string {
        return this.listasService.obtenerChurroItems(pIndice)
    }


    onEditLista(pListaId: string | null) {
        this.router.navigate(["listas-edit", pListaId]);
    }

    onDeleteLista(pListaId: string, pListaNombre: string) {
        this.alertController
            .create({
                header: pListaNombre,
                message: "Do you really want to delete this list?",
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel"
                    },
                    {
                        text: "Delete",
                        handler: () => {
                            this.listasService.eliminarLista(pListaId);
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
