import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ListasEditComponent } from '../listas-edit/listas-edit.component';
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

    constructor(
        private listasService: ListasService,
        private modalController: ModalController,
        private alertController: AlertController
    ) { }

    ngOnInit(): void {
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


    onEditLista(pLista: Lista, pIndexLista: number) {
        let copiaLista: Lista = null;
        if (pLista) {
            copiaLista = Object.assign({}, pLista);
        }
        this.modalController.create({
            component: ListasEditComponent,
            breakpoints: [0.25, 0.50],
            initialBreakpoint: 0.25,
            componentProps: { selectedLista: copiaLista, indexLista: pIndexLista }
        })
            .then(elemento => {
                elemento.present();
            });

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

}
