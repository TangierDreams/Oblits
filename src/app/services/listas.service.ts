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
    //aflListas: AngularFireList<Lista>;

    //misListas: Observable<any[]>;

    private misListas: Lista[];


    constructor(
        private httpClient: HttpClient,
        private usuariosService: UsuariosService,
        private db: AngularFireDatabase
    ) {
        //this.aflListas = db.list("/listas");
    }


    //Obtenemos un array con todas las listas de un usuario:

    obtenerListasUsuario(pUsuarioEmail: string) {
        this.misListas = [];
        this.usuariosService.obtenerUnUsuario(pUsuarioEmail).subscribe(resultado => {
            if (resultado.listas) {
                resultado.listas.forEach(pListaId => {
                    this.obtenerUnaLista(pListaId).subscribe(pLista => {
                        pLista.id = pListaId;
                        this.misListas.push(pLista);
                    })
                })
            }
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

    crearLista(pLista: Lista, pListaId: string) {
        pLista.id = null;
        if (pListaId) {
            let afoLista: AngularFireObject<Lista>;
            afoLista = this.db.object("/listas/" + pListaId);
            console.log("hacemos un set de /listas/" + pListaId);
            return afoLista.set(pLista);
        } else {
            let aflListas: AngularFireList<Lista>;
            aflListas = this.db.list("/listas");
            console.log("Hacemos un push de la nueva lista");
            return aflListas.push(pLista);            
        }
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

    eliminarLista(pListaId: string) {
        return this.obtenerUnaLista(pListaId).subscribe(pLista => {
            pLista.compartida_con.forEach(pUsuarioEmail => {
                this.usuariosService.obtenerUnUsuario(pUsuarioEmail).subscribe(pUsuario => {
                    const auxListas = pUsuario.listas.filter((item) => item !== pListaId);
                    this.usuariosService.grabarListasUsuario(pUsuarioEmail, auxListas)
                        .then(() => {
                            console.log("Eliminada la lista " + pListaId + " del usuario " + pUsuarioEmail);
                        });
                })
            })
            this.db.object<Lista>("/listas/" + pListaId).remove();
            console.log("Eliminada la lista " + pListaId);
        })
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
