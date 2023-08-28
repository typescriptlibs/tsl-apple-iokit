/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Apple I/O Kit TypeScript Library

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License.
  You may not use this file except in compliance with the License.
  You can get a copy of the License at https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
/* *
 *
 *  Imports
 *
 * */
import Plane from './Plane.js';
import Registry from './Registry.js';
/* *
 *
 *  Namespace
 *
 * */
export var Discovery;
(function (Discovery) {
    /* *
     *
     *  Functions
     *
     * */
    function diff(key, a, b) {
        const aValues = a.map((a) => a[key]);
        const bValues = b.map((b) => b[key]);
        const diff = [];
        for (let i = 0, iEnd = bValues.length; i < iEnd; ++i) {
            if (!aValues.includes(bValues[i])) {
                diff.push(structuredClone(b[i]));
            }
        }
        return diff;
    }
    Discovery.diff = diff;
    function newUSBDevices(interval = 1000, timeout = 60000) {
        return new Promise((resolve, reject) => {
            let pastDevices = [];
            let timer = NaN;
            let timeoutTimer = NaN;
            const check = async () => {
                try {
                    const nowDevices = await Registry.load({
                        allProperties: true,
                        plane: Plane.USB,
                        propertyKey: 'sessionID',
                        subtrees: true,
                    });
                    if (timer) {
                        const newDevices = diff('sessionID', pastDevices, nowDevices);
                        if (newDevices.length) {
                            clearTimeout(timeoutTimer);
                            resolve(newDevices);
                            return;
                        }
                    }
                    if (pastDevices.length !== nowDevices.length) {
                        pastDevices = nowDevices;
                    }
                    timer = setTimeout(check, interval);
                }
                catch (error) {
                    clearTimeout(timeoutTimer);
                    reject(error);
                }
            };
            if (timeout) {
                timeoutTimer = setTimeout(() => {
                    clearTimeout(timer);
                    reject(new Error('Timeout'));
                }, Math.max(interval, timeout));
            }
            check();
        });
    }
    Discovery.newUSBDevices = newUSBDevices;
})(Discovery || (Discovery = {}));
/* *
 *
 *  Default Export
 *
 * */
export default Discovery;
