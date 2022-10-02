import { GenericService } from './../services/generic.service';
import { Subscription } from 'rxjs';
import { UsuariosService } from './../services/usuarios.service';
import { AuthenticationService } from './../services/auth-firebase.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Lista } from '../models/lista';
import { ListasService } from '../services/listas.service';

@Component({
    selector: 'app-listas-edit',
    templateUrl: './listas-edit.page.html',
    styleUrls: ['./listas-edit.page.scss'],
    providers: [DatePipe]
})
export class ListasEditPage implements OnInit {

    public formulario: FormGroup;
    public listaId: string;
    public listaCompartida: string[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private listasService: ListasService,
        private usuariosService: UsuariosService,
        private datePipe: DatePipe,
        private authenticationService: AuthenticationService,
        private genericService: GenericService
    ) { }

    ngOnInit() {

        //Cogemos el código de lista pasado por parámetro:

        this.listaId = this.activatedRoute.snapshot.paramMap.get('listaId');

        //Montamos el formulario:

        this.formulario = new FormGroup({
            "nomLista": new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            "usuario": new FormControl(null, Validators.maxLength(50)),
        });

        //Si hemos pasado un código de lista, la leemos:

        if (this.listaId !== "new") {
            this.listasService.obtenerUnaLista(this.listaId).subscribe(pLista => {
                this.formulario.patchValue({"nomLista": pLista.nombre});
                this.listaCompartida = pLista.compartida_con.filter(pItem => pItem !== this.authenticationService.activeUser.email);
            }) 
        } 
    }

    //Añadimos un usuario con el que compartimos la lista:

    onAddUser() {
        this.listaCompartida.push(this.formulario.get("usuario").value);
        this.formulario.get("usuario").reset();
    }


    //Grabamos la lista en Realtime:

    onGrabarLista() {

        //Comprobamos que el nombre de la lista no haya quedado en blanco:

        if (this.formulario.invalid) {
            this.genericService.aviso("The list should have a name.");
            return;
        }

        //Creamos un objeto "Lista" con los datos del formulario

        let nuevaLista = new Lista();
        nuevaLista.nombre = this.formulario.get("nomLista").value;
        nuevaLista.propietario = this.authenticationService.activeUser.email;
        nuevaLista.modificada = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        if (this.listaId == "new") {
            nuevaLista.creada = nuevaLista.modificada;
        }
        this.listaCompartida.unshift(this.authenticationService.activeUser.email);
        nuevaLista.compartida_con = this.listaCompartida;



        if (this.listaId !== "new") {

            //Si es una modificación, eliminamos la lista y la volvemos a crear con el mismo código:

            console.log("lista a modificar: " + this.listaId);
            this.listasService.listaActualId = this.listaId;
            this.listasService.oEliminarLista.subscribe(() => {
                this.listasService.crearLista(nuevaLista, this.listaId)
                .then(() => {
    
                    //Añadimos la lista a los usuarios con las que se comparte:
    
                    this.listaCompartida.forEach(emailCompartidaCon => {
                        this.usuariosService.obtenerUnUsuario(emailCompartidaCon).subscribe(usuarioCompartido => {
                            let listasUsuario: string[] = [];
                            if (usuarioCompartido.listas) {
                                listasUsuario = usuarioCompartido.listas;
                            }
                            listasUsuario.push(this.listaId);
                            this.usuariosService.grabarListasUsuario(emailCompartidaCon, listasUsuario)
                                .then(() => {
                                    console.log("Actualizada lista: " + this.listaId + " al usuario " + usuarioCompartido.nombre + "...");
                                });
                        })
                    })
                });
            })
            
    
        } else {

            console.log("Se crea una nueva lista...");

            this.listasService.crearLista(nuevaLista, null)
            .then((lista) => {

                //Añadimos la lista a los usuarios con las que se comparte:

                this.listaCompartida.forEach(emailCompartidaCon => {
                    this.usuariosService.obtenerUnUsuario(emailCompartidaCon).subscribe(usuarioCompartido => {
                        let listasUsuario: string[] = [];
                        if (usuarioCompartido.listas) {
                            listasUsuario = usuarioCompartido.listas;
                        }
                        listasUsuario.push(lista.key);
                        this.usuariosService.grabarListasUsuario(emailCompartidaCon, listasUsuario)
                            .then(() => {
                                console.log("Añadida nueva lista: " + lista.key + " al usuario " + usuarioCompartido.nombre + "...");
                            });
                    })
                })
            });
        }

        this.formulario.reset();
    }







}
