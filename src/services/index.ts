import { HTTP_PROVIDERS } from '@angular/http';
import { GoogleBooksService } from './google-books';
import {GoogleCubesService} from "./google-cubes";

export default [
  HTTP_PROVIDERS,
  GoogleBooksService,
  GoogleCubesService
];
