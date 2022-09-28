import { Usuario } from './../models/usuario';
import { UsuariosService } from './usuarios.service';
import { Item } from './../models/item';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Lista } from '../models/lista';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

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

    public misListasSbj = new Subject<Lista[]>();
    //miListaSbj = new Subject<Lista>();

    afoListas: AngularFireObject<Lista[]>;
    aflListas: AngularFireList<Lista>;

    //misListas: Observable<any[]>;

    private misListas: Lista[];


    constructor(
        private httpClient: HttpClient,
        private usuariosService: UsuariosService,
        private db: AngularFireDatabase
    ) {
        this.aflListas = db.list("/listas");
    }


    obtenerListasUsuario(pUsuarioEmail: string) {
        this.misListas = [];
        this.usuariosService.obtenerUsuario(pUsuarioEmail).subscribe(resultado => {
            resultado.listas.forEach(pIdLista => {
                this.obtenerUnaLista(pIdLista).subscribe(pLista => {
                    this.misListas.push(pLista);
                })
            })
            this.misListasSbj.next(this.misListas);
        })

    }



    //Devolvemos los datos de una única lista:

    obtenerUnaLista(pListaId: string) {
        return this.db.object<Lista>("/listas/" + pListaId).valueChanges().pipe(take(1));
    }

    //Obtenemos un string con los items de una lista separados por ",":

    obtenerChurroItems(pIndexLista: number): string {
        return "churro de items...";
    }

    //Creamos una nueva lista:

    crearLista(pLista: Lista) {
        return this.aflListas.push(pLista);
    }


    //Modificamos el array de usuarios de una lista:

    grabarUsuariosLista(pListaId: string, pCompartidaCon: string[]) {
        let afoLista: AngularFireObject<Lista>;
        afoLista = this.db.object("/listas/" + pListaId);
        return afoLista.update({ compartida_con: pCompartidaCon });
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
