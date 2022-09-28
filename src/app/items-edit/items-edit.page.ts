import { DatePipe } from '@angular/common';
import { Item } from './../models/item';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListasService } from './../services/listas.service';
import { Lista } from './../models/lista';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-items-edit',
    templateUrl: './items-edit.page.html',
    styleUrls: ['./items-edit.page.scss'],
    providers: [DatePipe]
})


export class ItemsEditPage implements OnInit, OnDestroy {

    public idLista: number;
    public miLista: Lista;
    public formulario: FormGroup;
    public subscripcion: Subscription;
    public indexItem: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private listasService: ListasService,
        private alertController: AlertController,
        private datePipe: DatePipe
    ) { }

    ngOnInit() {
        this.indexItem = -1;
        this.idLista = +this.activatedRoute.snapshot.paramMap.get('idLista');

        // this.subscripcion = this.listasService.miListaSbj.subscribe(lista => {
        //     this.miLista = lista;
        // })
        //this.miLista = this.listasService.obtenerLista(this.idLista);

        this.formulario = new FormGroup({
            "nomItem": new FormControl(null, [Validators.required, Validators.maxLength(50)])
        });
    }

    ngOnDestroy(): void {
        this.subscripcion.unsubscribe();
    }


    editarItem(pItem: Item, pIndex: number) {
        console.log("editarItem()");
        this.indexItem = pIndex;
        this.formulario.patchValue({
            "nomItem": pItem.nombre
        })

    }

    cancelarItem() {
        this.formulario.reset();
        this.indexItem = -1;
    }

    onGrabarItem() {

        console.log("onGrabarItem()");

        //Comprobamos que el nombre del item no haya quedado en blanco:

        if (this.formulario.invalid) {
            this.aviso("The item should have a name.");
            return;
        }

        let nuevoItem = new Item();

        if (this.indexItem !== -1) {
            nuevoItem = null; //this.miLista.items[this.indexItem];
            console.log(this.indexItem);
            console.log(nuevoItem);
            nuevoItem.nombre = this.formulario.get("nomItem").value;
            nuevoItem.modificado = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
            this.listasService.updateItem(this.idLista, nuevoItem, this.indexItem);
        } else {
            nuevoItem.nombre = this.formulario.get("nomItem").value;
            nuevoItem.comprado = false;
            nuevoItem.creado = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
            nuevoItem.modificado = nuevoItem.creado;
            this.listasService.addItem(this.idLista, nuevoItem);
        }
        this.indexItem = -1;
        this.formulario.reset();
    }


    onActualizarComprado(pIndexItem: number) {
        console.log("actualizarComprado()");
        this.listasService.actualizarComprado(this.idLista, pIndexItem);
    }

    onCompartirItem(pItem: Item, pIndexItem: number) {
        console.log("onCompartirItem()");

    }

    onEliminarItem(pIndexItem: number) {
        console.log("onEliminarItem()");
        this.alertController
            .create({
                header: "pepe", //this.miLista.items[pIndexItem].nombre,
                message: "Do you really want to delete this item?",
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel"
                    },
                    {
                        text: "Delete",
                        handler: () => {
                            this.listasService.eliminarItem(this.idLista, pIndexItem);
                        }
                    }
                ]
            })
            .then(alertEl => {
                alertEl.present();
            });



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
