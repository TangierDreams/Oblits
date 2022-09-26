import { Item } from './../models/item';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Lista } from '../models/lista';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//Firebase:
import {
    AngularFireDatabase,
    AngularFireList,
    AngularFireObject,
} from '@angular/fire/compat/database';

@Injectable({
    providedIn: 'root'
})
export class ListasService {

    misListasSbj = new Subject<Lista[]>();
    miListaSbj = new Subject<Lista>();

    afoListas: AngularFireObject<Lista[]>;
    aflListas: AngularFireList<Lista>;

    misListas: Observable<any[]>;


    constructor(
        private httpClient: HttpClient,
        private db: AngularFireDatabase
    ) {
        this.aflListas = db.list("/listas");
    }


    obtenerListasBD() {

    }

    //Devolvemos los datos de una única lista:

    obtenerLista(pIndexLista: number) {
    }

    //Obtenemos un string con los items de una lista separados por ",":

    obtenerChurroItems(pIndexLista: number): string {
        return "churro de items...";
    }

    //Creamos una nueva lista:

    crearLista(pLista: Lista) {
        return this.aflListas.push(pLista);
    }

    //Actualizamos los datos de una lista:

    actualizarLista(pLista: Lista, pIndexLista: number) {

    }

    //Eliminar una lista y todos sus items:

    eliminarLista(pIndexLista: number) {
    }

    //Añadimos un item a una lista:

    addItem(pIndexLista: number, pItem: Item) {
    }

    //Actualizamos un item de una lista:

    updateItem(pIndexLista: number, pItem: Item, pIndexItem: number) {
    }

    //Eliminamos un item de una lista:

    eliminarItem(pIndexLista: number, pIndexItem: number) {
    }

    //Actualizamos el item como comprado o no comprado:

    actualizarComprado(pIndexLista: number, pIndexItem: number) {
    }

}
