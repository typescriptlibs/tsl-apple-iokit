/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Apple I/O Kit TypeScript Library

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License.
  You may not use this file except in compliance with the License.
  You can get a copy of the License at https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import Plane from './Plane.js';
export declare namespace Registry {
    interface Entry extends Record<string, unknown> {
        IOObjectClass: string;
        IOObjectRetainCount: number;
        IORegistryEntryChildren?: Array<Entry>;
        IORegistryEntryID: number;
        IORegistryEntryLocation: string;
        IORegistryEntryName: string;
        IOServiceBusyState: number;
        IOServiceBusyTime: number;
        IOServiceState: number;
    }
    interface LoadOptions {
        allProperties?: boolean;
        depth?: number;
        extractPath?: string;
        objectClass?: string;
        objectName?: string;
        propertyKey?: string;
        plane?: (Plane | string);
    }
    interface Root extends Record<string, unknown> {
        IOObjectClass: string;
        IOObjectRetainCount: number;
        IORegistryEntryChildren?: Array<Entry>;
        IORegistryEntryID: number;
        IORegistryEntryName: string;
    }
    function load(options: LoadOptions): Promise<Root>;
    function loadSubtrees(options: LoadOptions): Promise<Array<Entry>>;
}
export default Registry;
