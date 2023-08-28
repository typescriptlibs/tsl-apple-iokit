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

import Plane from './Plane.js';


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
        subtrees?: boolean;
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
        options: LoadOptions & { subtrees: true }
    ): Promise<Array<Entry>>;
    export async function load (
        options: LoadOptions & { subtrees?: false }
    ): Promise<Root>;
    export async function load (
        options: LoadOptions
    ): Promise<( Array<Entry> | Root )> {
        const flags: Array<string> = [
            'a', // XML
        ];

        if ( options.allProperties ) {
            flags.push( 'l' );
        }

        if ( options.subtrees ) {
            flags.push( 'r' );
        }

        const args: Array<string> = [
            `-${flags.join( '' )}`,
        ];

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

        const result = JSON.parse( await Shell.pipe( [{
            command: 'ioreg',
            args
        }, {
            command: 'plutil',
            args: [
                ...(
                    options.extractPath ?
                        ['-extract', `"${options.extractPath}"`, 'json'] :
                        ['-convert', 'json']
                ), // JSON
                '-o', '-', // stdout
                '-r', // readable
                '-' // stdin
            ]
        }] ) );

        if ( typeof result === 'object' ) {
            return result as ( Array<Entry> | Root );
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
