import { HTTP_PROVIDERS } from '@angular/http';
import { GoogleBooksService } from './google-books';
import {RudolfCubesService} from "./rudolf-cubes";
import {TreeExecution} from "./tree-execution";

export default [
  HTTP_PROVIDERS,
  GoogleBooksService,
  RudolfCubesService,
  TreeExecution
];
