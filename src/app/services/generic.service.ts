import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GenericService {

    constructor(
        private alertController: AlertController
    ) { }


    public email2Key(pEmail: string): string {
        return pEmail.replace(/\./g, "~");
    }

    public key2Email(pKey: string): string {
        return pKey.replace(/~/g, ".");
    }

    public async aviso(pMensaje: string) {
        const alert = await this.alertController.create({
            header: 'Warning',
            message: pMensaje,
            buttons: ['OK']
        });
        await alert.present();
    }



}
