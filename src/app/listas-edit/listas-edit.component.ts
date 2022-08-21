import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Lista } from '../models/lista';
import { ListasService } from '../services/listas.service';
import { Item } from '../models/item';

@Component({
    selector: 'app-listas-edit',
    templateUrl: './listas-edit.component.html',
    styleUrls: ['./listas-edit.component.scss'],
    providers: [DatePipe]
})

export class ListasEditComponent implements OnInit {

    @Input() selectedLista: Lista;
    @Input() indexLista: number;

    public formulario: FormGroup;

    public miLista = new Lista();
    public titulo: string;

    constructor(
        private listasService: ListasService,
        private alertController: AlertController,
        private modalController: ModalController,
        private datePipe: DatePipe
    ) { }

    ngOnInit() {
        let nomInicial = null;
        if (this.selectedLista) {
            this.titulo = "Rename List";
            this.miLista = this.selectedLista;
            nomInicial = this.selectedLista.nombre;
        } else {
            this.titulo = "New List";
            this.miLista.nombre = "";
            this.miLista.items = [];
            this.miLista.creada = "";
            this.miLista.modificada = "";
        }

        this.formulario = new FormGroup({
            "nomlista": new FormControl(nomInicial, [Validators.required, Validators.maxLength(50)])
        })
    }


    onClose() {
        this.modalController.dismiss();
    }

    //Actualizamos la lista en la base de datos:

    onGrabarLista() {

        //Comprobamos que el nombre de la lista no haya quedado en blanco:

        if (this.formulario.invalid) {
            this.aviso("The list should have a name.");
            return;
        }

        //Grabamos la lista en la base de datos:

        if (!this.selectedLista) {
            this.miLista.nombre = this.formulario.get("nomlista").value;
            this.miLista.creada = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
            this.miLista.modificada = this.miLista.creada;
            console.log("nueva lista...");
            console.log(this.miLista);
            this.listasService.crearLista(this.miLista);
        } else {
            this.miLista.nombre = this.formulario.get("nomlista").value;
            this.miLista.modificada = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
            this.listasService.actualizarLista(this.miLista, this.indexLista);
        }

        //Cerramos la página modal:

        this.modalController.dismiss();

    }

    async aviso(pMensaje: string) {
        const alert = await this.alertController.create({
            header: 'Warning',
            message: pMensaje,
            buttons: ['OK']
        });
        await alert.present();
    }

}