import { Item } from "./item";

export class Lista {
    id?: string | null;
    nombre: string;
    propietario: string;
    compartida_con?: string[] | null;
    creada: string;
    modificada: string;
}
