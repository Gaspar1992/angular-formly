import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { FormGeneratorComponent } from './app/form-generator/form-generator.component';
import { FormViewComponent } from './app/form-view/form-view.component';

const appRoutes: Routes = [
  {
    path: 'view',
    loadComponent: () =>
      import('./app/form-view/form-view.component').then(
        (c) => c.FormViewComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./app/form-generator/form-generator.component').then(
        (c) => c.FormGeneratorComponent
      ),
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(appRoutes),
  ],
}).catch(console.error);
