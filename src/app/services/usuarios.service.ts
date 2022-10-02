import { AuthenticationService } from './auth-firebase.service';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Usuario } from '../models/usuario';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {

    constructor(
        private db: AngularFireDatabase,
        private genericService: GenericService,
        private authenticationService: AuthenticationService
    ) {
    }

    observarUsuarioActivo() {
        return this.db.object<Usuario>("/usuarios/" + this.genericService.email2Key(this.authenticationService.activeUser.email)).valueChanges();
    }

    obtenerUnUsuario(pUsuarioEmail: string) {
        return this.db.object<Usuario>("/usuarios/" + this.genericService.email2Key(pUsuarioEmail)).valueChanges().pipe(take(1));
    }

    //Creamos un nuevo usuario:

    grabarUsuario(pUsuario: Usuario) {
        let afoUsuario: AngularFireObject<Usuario>;
        afoUsuario = this.db.object("/usuarios/" + this.genericService.email2Key(pUsuario.email));
        return afoUsuario.set(pUsuario);
    }


    //Modificamos el array de listas de un usuario:

    grabarListasUsuario(pUsuarioEmail: string, pListas: string[]) {
        let afoUsuario: AngularFireObject<Usuario>;
        afoUsuario = this.db.object("/usuarios/" + this.genericService.email2Key(pUsuarioEmail));
        return afoUsuario.update({ listas: pListas });
    }


}
