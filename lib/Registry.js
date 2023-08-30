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
import * as ChildProcess from 'node:child_process';
/* *
 *
 *  Functions
 *
 * */
function ioregArgs(options) {
    const args = [
        '-a', // XML
    ];
    if (options.allProperties) {
        args.push('-l');
    }
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
    return args;
}
function pipe(pipes, options = {}) {
    if (options.shell !== false) {
        options = {
            ...options,
            shell: true
        };
    }
    return new Promise((resolve, reject) => {
        const stderr = [];
        const stdout = [];
        let spawned;
        for (const pipe of pipes) {
            const previousPipe = spawned;
            spawned = ChildProcess.spawn(pipe.command, pipe.args, options);
            if (previousPipe) {
                const nextPipe = spawned;
                previousPipe.stdout.on('data', (chunk) => {
                    nextPipe.stdin.write(chunk);
                });
                previousPipe.on('close', () => {
                    nextPipe.stdin.end();
                });
                spawned.stderr.on('data', (chunk) => {
                    stderr.push(chunk);
                });
            }
        }
        if (!spawned) {
            resolve('');
            return;
        }
        spawned.stdout.on('data', (chunk) => {
            stdout.push(chunk);
        });
        spawned.on('close', (code, signal) => {
            if (code) {
                try {
                    const error = new Error();
                    error.code = code;
                    error.stderr = Buffer.concat(stderr).toString('utf8');
                    error.stdout = Buffer.concat(stdout).toString('utf8');
                    if (signal) {
                        error.signal = signal;
                    }
                    throw error;
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                resolve(Buffer.concat(stdout).toString('utf8'));
            }
        });
    });
}
function plutilArgs(options) {
    const args = [];
    if (options.extractPath) {
        args.push('-extract', `"${options.extractPath}"`, 'json');
    }
    else {
        args.push('-convert', 'json');
    }
    args.push('-o', '-', // stdout
    '-r', // readable
    '-' // stdin
    );
    return args;
}
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
    /* *
     *
     *  Functions
     *
     * */
    async function load(options) {
        const pipeCommands = [];
        // IOReg
        pipeCommands.push({
            command: 'ioreg',
            args: ioregArgs(options)
        });
        // PLUtil
        pipeCommands.push({
            command: 'plutil',
            args: plutilArgs(options)
        });
        // Load
        const result = JSON.parse(await pipe(pipeCommands));
        if (typeof result === 'object') {
            return result;
        }
        throw new Error('Unexpected format');
    }
    Registry.load = load;
    async function loadSubtrees(options) {
        const pipeCommands = [];
        // IOReg
        pipeCommands.push({
            command: 'ioreg',
            args: ioregArgs(options).concat(['-r']) // subtrees
        });
        // PLUtil
        pipeCommands.push({
            command: 'plutil',
            args: plutilArgs(options)
        });
        // Load
        const result = JSON.parse(await pipe(pipeCommands));
        if (result instanceof Array) {
            return result;
        }
        throw new Error('Unexpected format');
    }
    Registry.loadSubtrees = loadSubtrees;
})(Registry || (Registry = {}));
/* *
 *
 *  Default Export
 *
 * */
export default Registry;
