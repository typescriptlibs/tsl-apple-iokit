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
 *  Namespace
 *
 * */
export var Shell;
(function (Shell) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Functions
     *
     * */
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
    Shell.pipe = pipe;
    function spawn(command, args = [], options = {}) {
        if (options.shell !== false) {
            options = {
                ...options,
                shell: true
            };
        }
        return new Promise((resolve, reject) => {
            const spawned = ChildProcess.spawn(command, args, options);
            const stderr = [];
            const stdout = [];
            spawned.stdout.on('data', (chunk) => {
                stdout.push(chunk);
            });
            spawned.stderr.on('data', (chunk) => {
                stderr.push(chunk);
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
    Shell.spawn = spawn;
})(Shell || (Shell = {}));
/* *
 *
 *  Default Export
 *
 * */
export default Shell;
