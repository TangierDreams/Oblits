import { Item } from './../models/item';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

    private misListas: Lista[];

    // private misListas: Lista[] = [
    //     {
    //         nombre: "Lista del Mercadona",
    //         items: [
    //             { nombre: "Bacalao al Pil Pil", cantidad: 2, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Latas de tomate triturado", cantidad: 5, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Tortilla de patata con cebolla", cantidad: 2, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Rollos de papel de cocina", cantidad: 10, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //         ],
    //         creada: "2022-01-01",
    //         modificada: "2022-01-01"
    //     },
    //     {
    //         nombre: "Lista del Caprabo",
    //         items: [
    //             { nombre: "Patatas fritas de bolsa", cantidad: 2, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Mejillones en escabeche", cantidad: 5, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Pan de hamburguesa", cantidad: 2, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Rollos de papel higiénico", cantidad: 10, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //         ],
    //         creada: "2022-01-01",
    //         modificada: "2022-01-01"
    //     },
    //     {
    //         nombre: "Lista del mercado Central",
    //         items: [
    //             { nombre: "Pescado fresco para el horno", cantidad: 2, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Tomates de la Sra. María de la Huerta", cantidad: 5, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Platos de comida preparada", cantidad: 6, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Pata de cordero muy tierna", cantidad: 1, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //         ],
    //         creada: "2022-01-01",
    //         modificada: "2022-01-01"
    //     },
    //     {
    //         nombre: "Lista de la Farmacia",
    //         items: [
    //             { nombre: "Caja de Frenadol", cantidad: 1, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Champú anticaspa Querosil Forte", cantidad: 1, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Caja de aspirinas efervescentes", cantidad: 1, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //             { nombre: "Cajas de paracetamol de 100 mgr", cantidad: 1, comprado: false, creado: "2022-05-01", modificado: "2022-06-01" },
    //         ],
    //         creada: "2022-01-01",
    //         modificada: "2022-01-01"
    //     },
    // ]

    constructor(
        private httpClient: HttpClient,
        private db: AngularFireDatabase
    ) { }


    obtenerListasBD() {
        this.afoListas = this.db.object("/" + environment.USUARIO + "/listas");
        this.afoListas.snapshotChanges().subscribe(resultado => {
            this.misListas = [];
            let objetoLista = resultado.payload.toJSON();
            let keyListas = Object.keys(objetoLista);
            for (let i = 0; i < keyListas.length; i++) {
                let lista = new Lista();
                let keyLista = keyListas[i];
                lista.nombre = objetoLista[keyLista].nombre;
                lista.creada = objetoLista[keyLista].creada;
                lista.modificada = objetoLista[keyLista].modificada;
                lista.items = [];
                let keyItems = Object.keys(objetoLista[keyLista].items)
                for (let j = 0; j < keyItems.length; j++) {
                    let keyItem = keyItems[j];
                    lista.items.push(objetoLista[keyLista].items[keyItem])
                }
                this.misListas.push(lista);
            }
            this.misListasSbj.next(this.misListas);
        })
    }

    //Devolvemos los datos de una única lista:

    obtenerLista(pIndexLista: number): Lista {
        return this.misListas[pIndexLista];
    }

    //Obtenemos un string con los items de una lista separados por ",":

    obtenerChurroItems(pIndexLista: number): string {
        let churro: string = "";
        if (this.misListas[pIndexLista].items) {
            this.misListas[pIndexLista].items.forEach(item => {
                churro = churro + item.nombre + ", "
            })
            churro = churro.slice(0, -2);
        }
        return churro;
    }

    //Creamos una nueva lista:

    crearLista(pLista: Lista) {
        this.misListas.push(pLista);
        this.grabarListasBD();
        this.misListasSbj.next(this.misListas);
    }

    //Actualizamos los datos de una lista:

    actualizarLista(pLista: Lista, pIndexLista: number) {
        this.misListas[pIndexLista] = pLista;
        this.grabarListasBD();
        this.misListasSbj.next(this.misListas);
    }

    //Eliminar una lista y todos sus items:

    eliminarLista(pIndexLista: number) {
        this.misListas.splice(pIndexLista, 1);
        this.grabarListasBD();
        this.misListasSbj.next(this.misListas);
    }

    //Añadimos un item a una lista:

    addItem(pIndexLista: number, pItem: Item) {
        if (!this.misListas[pIndexLista].items) {
            this.misListas[pIndexLista].items = [];
        }
        this.misListas[pIndexLista].items.push(pItem);
        this.grabarListasBD();
        this.miListaSbj.next(this.misListas[pIndexLista]);
    }

    //Actualizamos un item de una lista:

    updateItem(pIndexLista: number, pItem: Item, pIndexItem: number) {
        this.misListas[pIndexLista].items[pIndexItem] = pItem;
        this.grabarListasBD();
        this.miListaSbj.next(this.misListas[pIndexLista]);
    }

    //Eliminamos un item de una lista:

    eliminarItem(pIndexLista: number, pIndexItem: number) {
        this.misListas[pIndexLista].items.splice(pIndexItem, 1);
        this.grabarListasBD();
        this.miListaSbj.next(this.misListas[pIndexLista]);
    }

    //Actualizamos el item como comprado o no comprado:

    actualizarComprado(pIndexLista: number, pIndexItem: number) {
        this.misListas[pIndexLista].items[pIndexItem].comprado = !this.misListas[pIndexLista].items[pIndexItem].comprado;
        this.grabarListasBD();
        this.miListaSbj.next(this.misListas[pIndexLista]);
    }


    //Grabamos las listas en la BD Realtime bajo el usuario correspondiente:

    grabarListasBD() {
        this.httpClient.put(
            environment.RUTA_BD + "/" + environment.USUARIO + "/listas.json",
            this.misListas
        ).subscribe(respuesta => {
            console.log(respuesta);
        })
    }


}
