import { GenericService } from './../services/generic.service';
import { UsuariosService } from './../services/usuarios.service';
import { AuthenticationService } from './../services/auth-firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Usuario } from '../models/usuario';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

    public formulario: FormGroup;

    isLogin: boolean = true;

    constructor(
        private authService: AuthenticationService,
        private usuariosService: UsuariosService,
        private router: Router,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private genericService: GenericService,
    ) { }

    ngOnInit() {
        this.formulario = new FormGroup({
            "nombre": new FormControl(null),
            "email": new FormControl(null, [Validators.required, Validators.email]),
            "password": new FormControl(null, [Validators.required, Validators.minLength(6)])
        });
    }

    ionViewWillEnter() {
    }

    onSubmit() {
        if (!this.formulario.valid) return;
        this.authenticate();
    }

    onOlvidado() {
        if (!this.formulario.controls.email.valid) {
            this.mostrarMensaje("Se necesita una dirección de correo válida");
            return;
        }
        this.alertController
            .create({
                header: "Change password",
                message: "Are you sure you want to change your password?",
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel"
                    },
                    {
                        text: "Change",
                        handler: () => {
                            this.authService.srvPasswordRecover(this.formulario.value.email)
                                .then((response) => {
                                    this.mostrarMensaje("Se ha enviado un enlace a su correo para cambiar la contraseña. Verifique su bandeja de entrada (o la de spam)")
                                }, error => {
                                    this.mostrarMensaje("Error al enviar el mail para restaurar la contraseña. " + error.message)
                                })
                        }
                    }
                ]
            })
            .then(alertEl => {
                alertEl.present();
            });
    }


    authenticate() {
        const email = this.formulario.value.email;
        const password = this.formulario.value.password;
        const nombre = this.formulario.value.nombre;

        this.loadingController
            .create({ keyboardClose: true, message: "Signing up..." })
            .then(objLoading => {
                objLoading.present();
                if (this.isLogin) {
                    this.authService.logIn(email, password)
                        .then((response) => {
                            objLoading.dismiss();
                            this.formulario.reset();
                            this.router.navigate(['home']);
                        }, error => {
                            objLoading.dismiss();
                            this.mostrarMensaje("No se ha podido realizar login del usuario. " + error.message);
                        })
                } else {
                    this.authService.createUser(email, password, nombre)
                        .then((response) => {
                            const nuevoUsuario = new Usuario();
                            nuevoUsuario.uid = response.user.uid;
                            nuevoUsuario.nombre = response.user.displayName;
                            nuevoUsuario.email = response.user.email;
                            this.usuariosService.grabarUsuario(nuevoUsuario);
                            objLoading.dismiss();
                            this.formulario.reset();
                            this.router.navigate(['home']);
                        }, error => {
                            objLoading.dismiss();
                            this.mostrarMensaje("No se ha podido crear el usuario. " + error.message);
                        })
                }
            });
    }


    //Cambiamos el modon de Login a SignUp y viceversa:

    cambiarModo() {
        this.isLogin = !this.isLogin;
    }

    //Mostramos un mensaje al usuario:

    mostrarMensaje(pMensaje: string) {
        this.alertController
            .create({
                header: "Authentication",
                message: pMensaje,
                buttons: ['OK']
            })
            .then(objAlert => objAlert.present());
    }


}
