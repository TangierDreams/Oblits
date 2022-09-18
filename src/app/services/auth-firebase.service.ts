import { Usuario } from './../models/usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { FirebaseApp } from '@angular/fire/app';


@Injectable({
    providedIn: 'root',
})

export class AuthenticationService {
    activeUser: any;
    //userIsLoggedIn: boolean = false;
    //emailUser: string = "";

    constructor(
        public angularFireAuth: AngularFireAuth,
        public httpClient: HttpClient,
        public router: Router,
        public ngZone: NgZone
    ) {

        // this.ngFireAuth.authState.subscribe((user) => {
        //     if (user) {
        //         //this.userIsLoggedIn = true;
        //         //this.emailUser = user.email;
        //         this.userData = user;
        //         console.log("grabo el usuario");
        //         console.log(this.userData);
        //         localStorage.setItem('user', JSON.stringify(this.userData));
        //         JSON.parse(localStorage.getItem('user'));
        //     } else {
        //         //this.userIsLoggedIn = false;
        //         //this.emailUser = "";
        //         console.log("borro el usuario");
        //         localStorage.setItem('user', null);
        //         JSON.parse(localStorage.getItem('user'));
        //     }
        //});
    }

    // Login with email/password

    srvLogIn(email: string, password: string) {
        return new Promise<any>((resolve, reject) => {
            this.angularFireAuth.signInWithEmailAndPassword(email, password)
                .then(
                    res => {
                        console.log(res.user);
                        this.activeUser = res.user;
                        localStorage.setItem('user', JSON.stringify(res.user));
                        //JSON.parse(localStorage.getItem('user'));
                        resolve(res);
                    },
                    err => {
                        this.activeUser = null;
                        localStorage.removeItem('user');
                        reject(err)
                    }
                )
        })
            .catch((error) => {
                console.log(error);
            });
    }


    // this.auth.auth.createUserWithEmailAndPassword(email, password)
    // .then((user: auth.UserCredential) => {
    //   user.user.updateProfile({
    //     displayName: username
    //   });
    // })


    srvCreateUser(pEmail: string, pPassword: string, pNombre: string) {
        return new Promise<any>((resolve, reject) => {
            this.angularFireAuth.createUserWithEmailAndPassword(pEmail, pPassword)
                .then(
                    respuesta => {
                        console.log(respuesta);
                        respuesta.user.updateProfile({
                            displayName: pNombre
                        })
                            .then(() => {
                                this.activeUser = respuesta.user;
                                localStorage.setItem('user', JSON.stringify(respuesta.user));
                                resolve(respuesta);
                            },
                                error => {
                                    this.activeUser = null;
                                    localStorage.removeItem('user');
                                    reject(error)
                                }
                            )
                    },
                    error => {
                        this.activeUser = null;
                        localStorage.removeItem('user');
                        reject(error)
                    }
                )
        })
            .catch((error) => {
                console.log(error);
            });
    }


    // Email verification when new user register

    // SendVerificationMail() {
    //     return this.ngFireAuth.currentUser.then((user) => {
    //         return user.sendEmailVerification().then(() => {
    //             this.router.navigate(['login']);
    //         });
    //     });
    // }

    // Recover password

    // srvPasswordRecover(pEmail: string) {
    //     return this.ngFireAuth
    //         .sendPasswordResetEmail(pEmail)
    //         .then(() => {
    //             window.alert(
    //                 'Password reset email has been sent, please check your inbox.'
    //             );
    //         })
    //         .catch((error) => {
    //             window.alert(error);
    //         });
    // }

    srvPasswordRecover(pEmail: string) {
        return new Promise<any>((resolve, reject) => {
            this.angularFireAuth.sendPasswordResetEmail(pEmail)
                .then(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err)
                    }
                )
        })
            .catch((error) => {
                console.log(error);
            });
    }


    // Returns true when user is logged in

    get isLoggedIn(): boolean {
        if (!this.activeUser) {
            this.activeUser = JSON.parse(localStorage.getItem('user'));
        }
        return !!this.activeUser;
    }

    // // Returns true when user's email is verified

    // get isEmailVerified(): boolean {
    //     const user = JSON.parse(localStorage.getItem('user'));
    //     //No vamos a verificar por email:
    //     //**return user.emailVerified !== false ? true : false;
    //     return true;
    // }

    // Sign in with Gmail

    GoogleAuth() {
        return this.AuthLogin(new auth.GoogleAuthProvider());
    }

    // Auth providers

    AuthLogin(provider) {
        return this.angularFireAuth
            .signInWithPopup(provider)
            .then((result) => {
                this.activeUser = result.user;
                localStorage.setItem('user', JSON.stringify(result.user));

                //this.userIsLoggedIn = true;
                //this.emailUser = result.user.email;
                // this.ngZone.run(() => {
                //     this.router.navigate(['home']);
                // });
                // this.SetUserData(result.user);
            })
            .catch((error) => {
                this.activeUser = null;
                localStorage.removeItem('user');
                // this.userIsLoggedIn = false;
                // this.emailUser = "";
                // window.alert(error);
            });
    }

    // // Store user in localStorage

    // private SetUserData(user) {
    //     const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
    //         `users/${user.uid}`
    //     );
    //     const userData: User = {
    //         uid: user.uid,
    //         email: user.email,
    //         displayName: user.displayName,
    //         photoURL: user.photoURL,
    //         emailVerified: user.emailVerified,
    //     };
    //     return userRef.set(userData, {
    //         merge: true,
    //     });
    // }

    // Sign-out

    srvSignOut() {
        return this.angularFireAuth.signOut().then(() => {
            //this.userIsLoggedIn = false;
            //this.emailUser = "";
            this.activeUser = null;
            localStorage.removeItem('user');
        });
    }


    //Grabamos las listas en la BD Realtime bajo el usuario correspondiente:

    grabarUsuarioBD(pUsuario: Usuario) {
        this.httpClient.put(
            environment.RUTA_BD + "/usuarios/" + pUsuario.id + ".json",
            pUsuario
        ).subscribe(respuesta => {
            console.log(respuesta);
        })
    }

}