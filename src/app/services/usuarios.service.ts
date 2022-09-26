import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Usuario } from '../models/usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {

    constructor(
        private db: AngularFireDatabase,
        private genericService: GenericService
    ) {
    }

    obtenerUsuario(pUsuarioEmail: string) {
        return this.db.object<Usuario>("/usuarios/" + this.genericService.email2Key(pUsuarioEmail)).valueChanges();
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
