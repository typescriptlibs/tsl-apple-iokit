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


import test from '@typescriptlibs/tst';

import * as IOKit from 'tsl-apple-iokit';


/* *
 *
 *  Tests
 *
 * */


test( 'Test Discovery.newUSBDevice', async ( assert: test.Assert ): Promise<void> => {

    console.log( 'Attach a USB device to continue...' );

    try {

        const result = await IOKit.Discovery.newUSBDevices( 1000, 15000 );

        console.log( result );

        assert.ok( result, 'Test of newUSBDevice should result in an array of new Entries.' );

    }
    catch ( error ) {

        if (
            error instanceof Error &&
            error.message === 'Timeout'
        ) {
            console.log( 'Timeout' );
            return;
        }

        console.error( `${error}` );

        assert.ok( false, 'Test of newUSBDevice should not fail unexpected.' );

    }

} );
