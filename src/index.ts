import './polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import '@angular/material/core/theming/prebuilt/purple-green.css';
import { environment } from './environments/environment';
platformBrowserDynamic().bootstrapModule(AppModule);
