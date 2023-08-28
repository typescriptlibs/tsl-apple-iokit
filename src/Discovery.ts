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


export namespace Discovery {


    /* *
     *
     *  Functions
     *
     * */


    export function diff (
        key: string,
        a: Array<Registry.Entry>,
        b: Array<Registry.Entry>
    ): Array<Registry.Entry> {
        const aValues = a.map( ( a ): unknown => a[key] );
        const bValues = b.map( ( b ): unknown => b[key] );
        const diff: Array<Registry.Entry> = [];

        for ( let i = 0, iEnd = bValues.length; i < iEnd; ++i ) {
            if ( !aValues.includes( bValues[i] ) ) {
                diff.push( structuredClone( b[i] ) );
            }
        }

        return diff;
    }


    export function newUSBDevices (
        interval: number = 1000,
        timeout: number = 60000
    ): Promise<Array<Registry.Entry>> {
        return new Promise( ( resolve, reject ): void => {
            let pastDevices: Array<Registry.Entry> = [];
            let timer: ( NodeJS.Timeout | number ) = NaN;
            let timeoutTimer: ( NodeJS.Timeout | number ) = NaN;

            const check = async (): Promise<void> => {
                try {
                    const nowDevices = await Registry.load( {
                        allProperties: true,
                        plane: Plane.USB,
                        propertyKey: 'sessionID',
                        subtrees: true,
                    } );

                    if ( timer ) {
                        const newDevices = diff( 'sessionID', pastDevices, nowDevices );

                        if ( newDevices.length ) {
                            clearTimeout( timeoutTimer );
                            resolve( newDevices );
                            return;
                        }
                    }

                    if ( pastDevices.length !== nowDevices.length ) {
                        pastDevices = nowDevices;
                    }

                    timer = setTimeout( check, interval );
                }
                catch ( error ) {
                    clearTimeout( timeoutTimer );
                    reject( error );
                }
            };

            if ( timeout ) {
                timeoutTimer = setTimeout(
                    (): void => {
                        clearTimeout( timer );
                        reject( new Error( 'Timeout' ) );
                    },
                    Math.max( interval, timeout )
                );
            }

            check();

        } );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Discovery;
