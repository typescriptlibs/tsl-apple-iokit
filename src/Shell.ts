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


export namespace Shell {


    /* *
     *
     *  Declarations
     *
     * */


    export interface ExitError extends Error {
        code: number;
        signal?: NodeJS.Signals;
        stderr: string;
        stdout: string;
    }


    export interface PipedCommand {
        command: string;
        args: ReadonlyArray<string>;
    }


    /* *
     *
     *  Functions
     *
     * */


    export function pipe (
        pipes: Array<PipedCommand>,
        options: ChildProcess.SpawnOptionsWithoutStdio = {}
    ): Promise<string> {

        if ( options.shell !== false ) {
            options = {
                ...options,
                shell: true
            }
        }

        return new Promise( ( resolve, reject ): void => {
            const stderr: Array<Buffer> = [];
            const stdout: Array<Buffer> = [];

            let spawned: ( ChildProcess.ChildProcessWithoutNullStreams | undefined );

            for ( const pipe of pipes ) {
                const previousPipe = spawned;

                spawned = ChildProcess.spawn( pipe.command, pipe.args, options );

                if ( previousPipe ) {
                    const nextPipe = spawned;

                    previousPipe.stdout.on( 'data', ( chunk ): void => {
                        nextPipe.stdin.write( chunk )
                    } );
                    previousPipe.on( 'close', (): void => {
                        nextPipe.stdin.end();
                    } );

                    spawned.stderr.on( 'data', ( chunk ): void => {
                        stderr.push( chunk );
                    } );
                }
            }

            if ( !spawned ) {
                resolve( '' );
                return;
            }

            spawned.stdout.on( 'data', ( chunk ): void => {
                stdout.push( chunk );
            } );

            spawned.on( 'close', ( code, signal ): void => {
                if ( code ) {
                    try {
                        const error = new Error() as ExitError;

                        error.code = code;
                        error.stderr = Buffer.concat( stderr ).toString( 'utf8' );
                        error.stdout = Buffer.concat( stdout ).toString( 'utf8' );

                        if ( signal ) {
                            error.signal = signal;
                        }

                        throw error
                    }
                    catch ( error ) {
                        reject( error );
                    }
                }
                else {
                    resolve( Buffer.concat( stdout ).toString( 'utf8' ) );
                }
            } );

        } );
    }


    export function spawn (
        command: string,
        args: ReadonlyArray<string> = [],
        options: ChildProcess.SpawnOptionsWithoutStdio = {}
    ): Promise<string> {

        if ( options.shell !== false ) {
            options = {
                ...options,
                shell: true
            }
        }

        return new Promise( ( resolve, reject ): void => {
            const spawned = ChildProcess.spawn( command, args, options );
            const stderr: Array<Buffer> = [];
            const stdout: Array<Buffer> = [];

            spawned.stdout.on( 'data', ( chunk ): void => {
                stdout.push( chunk );
            } );

            spawned.stderr.on( 'data', ( chunk ): void => {
                stderr.push( chunk );
            } );

            spawned.on( 'close', ( code, signal ): void => {
                if ( code ) {
                    try {
                        const error = new Error() as ExitError;

                        error.code = code;
                        error.stderr = Buffer.concat( stderr ).toString( 'utf8' );
                        error.stdout = Buffer.concat( stdout ).toString( 'utf8' );

                        if ( signal ) {
                            error.signal = signal;
                        }

                        throw error
                    }
                    catch ( error ) {
                        reject( error );
                    }
                }
                else {
                    resolve( Buffer.concat( stdout ).toString( 'utf8' ) );
                }
            } );

        } );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Shell;
