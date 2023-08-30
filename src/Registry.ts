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

import Plane from './Plane.js';


/* *
 *
 *  Declarations
 *
 * */


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


/* *
 *
 *  Functions
 *
 * */


function ioregArgs (
    options: Registry.LoadOptions
): Array<string> {
    const args: Array<string> = [
        '-a', // XML
    ];

    if ( options.allProperties ) {
        args.push( '-l' );
    }

    if ( options.objectClass ) {
        args.push( '-c', `"${options.objectClass}"` );
    }

    if ( options.depth ) {
        args.push( '-d', `${options.depth}` );
    }

    if ( options.propertyKey ) {
        args.push( '-k', `"${options.propertyKey}"` );
    }

    if ( options.objectName ) {
        args.push( '-n', `"${options.objectName}"` );
    }

    if ( options.plane ) {
        args.push( '-p', `"${options.plane}"` );
    }

    args.push( '-w', '0' ); // unlimited line length

    return args;
}

function pipe (
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


function plutilArgs (
    options: Registry.LoadOptions
): Array<string> {
    const args: Array<string> = [];

    if ( options.extractPath ) {
        args.push( '-extract', `"${options.extractPath}"`, 'json' );
    }
    else {
        args.push( '-convert', 'json' );
    }

    args.push(
        '-o', '-', // stdout
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


export namespace Registry {


    /* *
     *
     *  Declaration
     *
     * */


    export interface Entry extends Record<string, unknown> {
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


    export interface LoadOptions {
        allProperties?: boolean;
        depth?: number;
        extractPath?: string;
        objectClass?: string;
        objectName?: string;
        propertyKey?: string;
        plane?: ( Plane | string );
    }


    export interface Root extends Record<string, unknown> {
        IOObjectClass: string;
        IOObjectRetainCount: number;
        IORegistryEntryChildren?: Array<Entry>;
        IORegistryEntryID: number;
        IORegistryEntryName: string;
    }


    /* *
     *
     *  Functions
     *
     * */


    export async function load (
        options: LoadOptions
    ): Promise<Root> {
        const pipeCommands: Array<PipedCommand> = [];

        // IOReg

        pipeCommands.push( {
            command: 'ioreg',
            args: ioregArgs( options )
        } );

        // PLUtil

        pipeCommands.push( {
            command: 'plutil',
            args: plutilArgs( options )
        } );

        // Load

        const result = JSON.parse( await pipe( pipeCommands ) );

        if ( typeof result === 'object' ) {
            return result as Root;
        }

        throw new Error( 'Unexpected format' );
    }


    export async function loadSubtrees (
        options: LoadOptions
    ): Promise<Array<Entry>> {
        const pipeCommands: Array<PipedCommand> = [];

        // IOReg

        pipeCommands.push( {
            command: 'ioreg',
            args: ioregArgs( options ).concat( ['-r'] ) // subtrees
        } );

        // PLUtil

        pipeCommands.push( {
            command: 'plutil',
            args: plutilArgs( options )
        } );

        // Load

        const result = JSON.parse( await pipe( pipeCommands ) );

        if ( result instanceof Array ) {
            return result as Array<Entry>;
        }

        throw new Error( 'Unexpected format' );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Registry;
