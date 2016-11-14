// https://github.com/angular/angular/blob/master/modules/@angular/src/upgrade/upgrade_adapter.ts
// http://stackoverflow.com/questions/39148710/where-to-put-the-import-module-in-a-new-installation-of-ng-2-bootstrap
// http://stackoverflow.com/questions/39166395/how-do-i-upgrade-modules-to-angular-2-rc5-ngmodules-in-a-hybrid-application

import {UpgradeAdapter} from '@angular/upgrade';
import { NgModule } from '@angular/core';

// Create a fake @NgModule that can be later replaced with real @NgModule
@NgModule({
})
export class AppModuleFake {}

export const upgradeAdapter = new UpgradeAdapter(AppModuleFake);

export var moduleProviders = [];
export var moduleDeclarations = [];
export var moduleImports = [];
