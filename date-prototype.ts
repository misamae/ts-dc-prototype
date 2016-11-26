/**
 * Created by meisam on 26/11/2016.
 */

import * as $ from 'jquery';

export class DatePrototype {

    constructor() {
        console.log('started?');
        let el = $('#simpleDate');
        let isoElement = $('#isoDate');
        let localElement = $('#localeDate');
        let irDate = $('#irDate');
        let enGBDate = $('#enGBDate');


        let date = new Date(1478594887000);
        el.html(date.toDateString());
        isoElement.html(date.toISOString());
        localElement.html(date.toLocaleDateString());
        enGBDate.html(date.toLocaleDateString('en-GB'));
        irDate.html(date.toLocaleDateString('fa-IR'));

        //Type: language
        // Subtag: ira
        // Description: Iranian languages
        // Added: 2005-10-16
        // Scope: collection
        // %%
        //<territoryCodes type="IR" numeric="364" alpha3="IRN"/>
        //<currencyCodes type="IRR" numeric="364"/>
        // irDate.html(date.toLocaleDateString('persian'));
        console.log(new Intl.DateTimeFormat('fa-IR').resolvedOptions());
    }

}

let app = new DatePrototype();
