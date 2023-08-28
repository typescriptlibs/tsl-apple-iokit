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
import Shell from './Shell.js';
/* *
 *
 *  Class
 *
 * */
export var Registry;
(function (Registry) {
    /* *
     *
     *  Declaration
     *
     * */
    async function load(options) {
        const flags = [
            'a', // XML
        ];
        if (options.allProperties) {
            flags.push('l');
        }
        if (options.subtrees) {
            flags.push('r');
        }
        const args = [
            `-${flags.join('')}`,
        ];
        if (options.objectClass) {
            args.push('-c', `"${options.objectClass}"`);
        }
        if (options.depth) {
            args.push('-d', `${options.depth}`);
        }
        if (options.propertyKey) {
            args.push('-k', `"${options.propertyKey}"`);
        }
        if (options.objectName) {
            args.push('-n', `"${options.objectName}"`);
        }
        if (options.plane) {
            args.push('-p', `"${options.plane}"`);
        }
        args.push('-w', '0'); // unlimited line length
        const result = JSON.parse(await Shell.pipe([{
                command: 'ioreg',
                args
            }, {
                command: 'plutil',
                args: [
                    ...(options.extractPath ?
                        ['-extract', `"${options.extractPath}"`, 'json'] :
                        ['-convert', 'json']),
                    '-o', '-',
                    '-r',
                    '-' // stdin
                ]
            }]));
        if (typeof result === 'object') {
            return result;
        }
        throw new Error('Unexpected format');
    }
    Registry.load = load;
})(Registry || (Registry = {}));
/* *
 *
 *  Default Export
 *
 * */
export default Registry;
