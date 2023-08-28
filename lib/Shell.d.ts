/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Apple I/O Kit TypeScript Library

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License.
  You may not use this file except in compliance with the License.
  You can get a copy of the License at https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import * as ChildProcess from 'node:child_process';
export declare namespace Shell {
    interface ExitError extends Error {
        code: number;
        signal?: NodeJS.Signals;
        stderr: string;
        stdout: string;
    }
    interface PipedCommand {
        command: string;
        args: ReadonlyArray<string>;
    }
    function pipe(pipes: Array<PipedCommand>, options?: ChildProcess.SpawnOptionsWithoutStdio): Promise<string>;
    function spawn(command: string, args?: ReadonlyArray<string>, options?: ChildProcess.SpawnOptionsWithoutStdio): Promise<string>;
}
export default Shell;
