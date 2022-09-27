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
    public idLista: string;
    private subscripUsuario: Subscription;
    public listaCompartida: string[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private listasService: ListasService,
        private usuariosService: UsuariosService,
        private datePipe: DatePipe,
        private authenticationService: AuthenticationService,
        private genericService: GenericService
    ) { }

    ngOnInit() {
        this.idLista = this.activatedRoute.snapshot.paramMap.get('idLista');
        this.formulario = new FormGroup({
            "nomLista": new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            "usuario": new FormControl(null, Validators.maxLength(50)),
        });
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

        let nuevaLista = new Lista();
        nuevaLista.nombre = this.formulario.get("nomLista").value;
        nuevaLista.propietario = this.authenticationService.activeUser.email;
        nuevaLista.creada = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        nuevaLista.modificada = nuevaLista.creada;
        this.listaCompartida.unshift(this.authenticationService.activeUser.email);
        nuevaLista.compartida_con = this.listaCompartida;

        this.listasService.crearLista(nuevaLista)
            .then((lista) => {

                //Añadimos la lista a los usuarios con las que se comparte:

                this.listaCompartida.forEach(emailCompartidaCon => {
                    this.usuariosService.obtenerUsuario(emailCompartidaCon).subscribe(usuarioCompartido => {
                        let listasUsuario: string[] = [];
                        if (usuarioCompartido.listas) {
                            listasUsuario = usuarioCompartido.listas;
                        }
                        listasUsuario.push(lista.key);
                        this.usuariosService.grabarListasUsuario(emailCompartidaCon, listasUsuario)
                            .then(() => {
                                console.log("Añadida nueva lista al usuario " + usuarioCompartido.nombre + "...");
                            });
                    })
                })
            });

        this.formulario.reset();
    }







}
