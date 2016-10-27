import './polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import '@angular/material/core/theming/prebuilt/deeppurple-amber.css';
import { environment } from './environments/environment';
platformBrowserDynamic().bootstrapModule(AppModule);
