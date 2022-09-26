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

    constructor(
        public angularFireAuth: AngularFireAuth,
        public httpClient: HttpClient,
        public router: Router,
        public ngZone: NgZone
    ) { }

    // Login con email/password

    logIn(email: string, password: string) {
        return new Promise<any>((resolve, reject) => {
            this.angularFireAuth.signInWithEmailAndPassword(email, password)
                .then(
                    res => {
                        console.log(res.user);
                        this.activeUser = res.user;
                        localStorage.setItem('user', JSON.stringify(res.user));
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


    createUser(pEmail: string, pPassword: string, pNombre: string) {
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


    // Recover password

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
            console.log("ActiveUser:");
            console.log(this.activeUser);
        }
        return !!this.activeUser;
    }


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
            })
            .catch((error) => {
                this.activeUser = null;
                localStorage.removeItem('user');
            });
    }


    // Nos vamos...

    signOut() {
        return this.angularFireAuth.signOut().then(() => {
            //this.userIsLoggedIn = false;
            //this.emailUser = "";
            this.activeUser = null;
            localStorage.removeItem('user');
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


    // // Returns true when user's email is verified

    // get isEmailVerified(): boolean {
    //     const user = JSON.parse(localStorage.getItem('user'));
    //     //No vamos a verificar por email:
    //     //**return user.emailVerified !== false ? true : false;
    //     return true;
    // }



}