import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
    },

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },

    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        canLoad: [AuthGuard]
    },

    {
        path: 'items-edit/:idLista',
        loadChildren: () => import('./items-edit/items-edit.module').then(m => m.ItemsEditPageModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'listas-edit/:idLista',
        loadChildren: () => import('./listas-edit/listas-edit.module').then(m => m.ListasEditPageModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
