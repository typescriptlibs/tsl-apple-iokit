/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Apple I/O Kit TypeScript Library

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License.
  You may not use this file except in compliance with the License.
  You can get a copy of the License at https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import Plane from './Plane.js';
import Registry from './Registry.js';
export declare namespace Discovery {
    function diff(key: string, a: Array<Registry.Entry>, b: Array<Registry.Entry>): Array<Registry.Entry>;
    function newEntry(objectClass?: string, propertyKey?: string, plane?: Plane, interval?: number, timeout?: number, knownEntries?: Array<Registry.Entry>): Promise<Array<Registry.Entry>>;
    function newUSBDevices(interval?: number, timeout?: number, knownEntries?: Array<Registry.Entry>): Promise<Array<Registry.Entry>>;
}
export default Discovery;
