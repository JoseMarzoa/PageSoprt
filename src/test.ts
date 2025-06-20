/**
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/testing';

/**
 * First, initialize the Angular testing environment.
 */
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
); 