if (typeof (Broadlook) == "undefined") { Broadlook = { __namespace: true }; }
Broadlook.Library = Broadlook.Library || { __namespace: true };

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (needle) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};


(function () {

    this.$ = null;
    this.__namespace = true;
    this.BuildVersion = "2013.10.09";
    this.demo = false;
    this.startTime = null;

    this.init = function () { // native library should override this initializer
        Broadlook.Library.init0();
    }

    this.init0 = function () {
        var lib = Broadlook.Library;
        lib.$ = jQuery.noConflict();
        lib.startTime = new Date();
    }

    this.makeExpirationText = function (expireson, emptyPast30Days, includeDate) {

        var lib = Broadlook.Library;
        var text = "Unknown expiration date";
        if (!expireson) return text;

        var days = lib.days_between(expireson, new Date(), true);

        if (days < 0)
            text = "Expired " + Math.abs(days) + " days ago"
        else if (days == 0)
            text = "Expires today"
        else if (days < 30)
            text = "Expires in " + days + " days"
        else {
            if (emptyPast30Days)
                text = "";
            else
                text = "Expires in " + Math.round(days / 30) + " months";
        }

        if (text != '')
            if (includeDate)
                text += ' (' + expireson.toDateString() + ')';

        return text;

    }

    this.applyLicense = function (license) {
        //alert("Demo: " + license.demo + "\nExpires: " + license.expiration + "\nKeys: " + license.keys.length);

        var lib = Broadlook.Library;

        lib.license = license;


        var css_font = "font-weight: bold !important; font-size: 1.2em !important; font-family: Lucida Grande, Lucida Sans, Arial, sans-serif !important";
        var css_bar = "display: block !important; padding: 12px; z-index: 1000; background-color: #FFF19D; border: 1px solid #D7D889;";


        if (lib.license.expiration) {

            //var days = lib.days_between(lib.license.expiration, new Date(), true);

            //var text = "";
            //if (days < 0)
            //    text = "Expired " + Math.abs(days) + " days ago."
            //else
            //    if (days < 30)
            //        text = "Expires in " + days + " days."

            var text = lib.makeExpirationText(lib.license.expiration, true);

            if (text != "") {
                var $expbar = jQuery('<div id="expbar" style="' + css_bar + css_font + ' " class="ui-widget ui-state-highlight">' +

                    text + '. <a href="https://www.broadlook.com/company/contact/" target="_blank" style="' + css_font + '">Please contact Broadlook Technologies to renew your subscription.</a>' +

                    '<div style="float: right;" class="notification-dismiss"><a href="#" onclick="Broadlook.Library.dismissNotificationBar(document.getElementById(\'expbar\'))" ' +
                    'style="background-image: url(Images/delete.png); background-repeat: no-repeat; min-width: 20px; min-height: 20px; text-decoration: none; display: inline-block; " ' +
                    'alt="Dismiss"></a></div> ' +

                    '</div>');

                lib.$("BODY").prepend($expbar);

                lib.$(window).trigger('resize');
            }
        }

        if (lib.license.demo) {

            var $demobar = jQuery('<div id="demobar" style=" ' + css_bar + css_font + '" class="ui-widget ui-state-highlight">' +

                    'This application is in DEMO mode. <a href="https://www.broadlook.com/company/contact/" target="_blank" style="' + css_font + '">Please contact Broadlook Technologies to obtain more information.</a>' +

                    '<div style="float: right;" class="notification-dismiss"><a href="#" onclick="Broadlook.Library.dismissNotificationBar(document.getElementById(\'demobar\'))" ' +
                    'style="background-image: url(Images/delete.png); background-repeat: no-repeat; min-width: 20px; min-height: 20px; text-decoration: none; display: inline-block; " ' +
                    'alt="Dismiss"></a></div> ' +

                '</div>');

            lib.$("BODY").prepend($demobar);

            lib.$(window).trigger('resize');
        }
    }

    this.checkNewVersionInternal = function (crm) {
        var url = "https://download.broadlook.com/crmsuite/version.php?crm=" + escape(crm) + "&callback=Broadlook.Library.checkNewVersionCallback";
        var script = document.createElement('script');
        script.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    this.checkNewVersionCallback = function (build, link) {
        var lib = Broadlook.Library;

        try {
            var latest = new Object;
            latest.build = 0;
            latest.link = '';

            if (build > 0) {
                var latest = new Object;
                latest.build = build;
                latest.link = link;
            }

            lib.checkExistingVersion(latest);
        }
        catch (an_exception) {
            lib.showError(an_exception);
        }
    }

    this.checkExistingVersionCallback = function (current, latest) {

        var lib = Broadlook.Library;

        try {
            if (!current) return;

            if (current.version) {

                var logo = lib.$("#logo");
                if (logo) {
                    var ver = "Broadlook Tools v" + current.version;
                    logo.attr("alt", ver);
                    logo.attr("title", ver);
                }

                var version = lib.$("#broadlookversion");
                if (version) {
                    version.text(current.version);
                }

            }

            if (!latest) return;

            if (current.build > 0 && latest.build > current.build) {

                var css_font = "font-weight: bold !important; font-size: 1.2em !important; font-family: Lucida Grande, Lucida Sans, Arial, sans-serif !important";
                var css_bar = "display: block !important; padding: 12px; z-index: 1000; background-color: #FFF19D; border: 1px solid #D7D889;";

                var $upgradebar = jQuery('<div id="upgradebar" style="' + css_bar + css_font + '" ' + 'class="ui-widget ui-state-highlight" ' + '>' +

                    'This aplication is out of date, please upgrade to the latest version. ' +
                    '<a target="_blank" style="' + css_font + '" href="' + latest.link + '">Download.</a> ' +

                    '<div style="float: right;" class="notification-dismiss"><a href="#" onclick="Broadlook.Library.dismissNotificationBar(document.getElementById(\'upgradebar\'))" ' +
                    'style="background-image: url(Images/delete.png); background-repeat: no-repeat; min-width: 20px; min-height: 20px; text-decoration: none; display: inline-block; " ' +
                    'alt="Dismiss"></a></div> ' +

                    '</div>');

                lib.$("BODY").prepend($upgradebar);

                lib.$(window).trigger('resize');
            }
        }
        catch (an_exception) {
            lib.showError(an_exception);
        }
    }

    this.dismissNotificationBar = function (bar) {
        var lib = Broadlook.Library;
        if (!bar) return;
        lib.$(bar).remove();
        lib.$(window).trigger('resize')
    }

    this.composeFullName = function (first, middle, last) {

        var lib = Broadlook.Library;

        if (lib.z(first)) first = ""; else first = first + " ";
        if (lib.z(middle)) middle = ""; else middle = middle + " ";
        if (lib.z(last)) last = "";

        return lib.$.trim(first + middle + last);
    }

    this.setCookie = function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    this.getCookie = function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

    this.stripTags = function (string) {
        var tagMatcher = new RegExp('<[^<>]+>', 'g');
        if (string == null) string = '';
        return string.replace(tagMatcher, '');
    }


    this.days_between = function (date1, date2, keepsign) {

        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms;

        if (keepsign)
            difference_ms = date1_ms - date2_ms;
        else
            difference_ms = Math.abs(date1_ms - date2_ms);

        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY);

    }


    this.createXmlHttpRequest = function () {

        var xmlHttpRequest;
        //if (window.XDomainRequest) { // code for IE8 Cross Domain Support
        //    xmlHttpRequest = new window.XDomainRequest();
        //}
        if (window.XMLHttpRequest) {   // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlHttpRequest = new XMLHttpRequest();
        }
        else { // code for IE6, IE5
            try { // 'modern' IE
                xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) { // legacy IE 
                try {
                    xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) { // Jurassic park browser
                    xmlHttpRequest = false;
                }
            }
        }
        return xmlHttpRequest;
    }

    /******************************************************************************************

    Conversion Wizard

    ******************************************************************************************/

    // used only when lookups are utilized
    this.convertParams = {
        ending: "",
        source: "",
        target: "",
        newids: []
    }



    this.getGridCol = function (appCode, propertyName) {
        var result = null;

        //if(!propertyName || ['first', 'middle', 'last', 'company', 'title', 'phone', 'phone2', 'mobile', 'fax', 'pager', 'email', 
        //'address1', 'address2', 'city', 'state', 'zip', 'country'].indexOf(propertyName) < 0)
        //    throw new Error("Unknown property: "+ propertyName); 

        if (!appCode || ['CC', 'PR'].indexOf(appCode) < 0)
            throw new Error("Unknown application code: " + appCode);


        if (appCode == 'CC') { //cc 2.x

            if (['first', 'middle', 'last', 'company', 'title', 'phone', 'phone2', 'mobile', 'fax', 'pager', 'email',
                'address1', 'address2', 'city', 'state', 'zip', 'country',
                'linkedin', 'facebook', 'twitter', 'skype', 'googleplus',
                'socl', 'blog', 'youtube', 'xing', 'quora',
                'slideshare', 'reddit', 'stumbleupon', 'digg', 'pinterest'
            ].indexOf(propertyName) >= 0) result = propertyName;

        }
        else if (appCode == 'PR') { //pr 2.x
            if (propertyName == 'first') result = 'firstname';
            else if (propertyName == 'middle') result = 'middlename'
            else if (propertyName == 'last') result = 'lastname';
            else if (propertyName == 'company') result = 'contextcompany';
            else if (propertyName == 'title') result = 'title';
            else if (propertyName == 'phone') result = 'phone';
            else if (propertyName == 'phone2') result = 'phone2';
            else if (propertyName == 'email') result = 'email';
            else if (propertyName == 'city') result = 'city';
            else if (propertyName == 'state') result = 'state';
        }
        /*else if(appCode == 'PR') { //pr 1.x
            if(propertyName == 'first') result = 'blt_firstname';
            else if(propertyName == 'middle') result = 'blt_middlename'
            else if(propertyName == 'last') result = 'blt_lastname';
            else if(propertyName == 'company') result = 'blt_companyname'; // contextcompany
            else if(propertyName == 'title') result = 'blt_jobtitle';
            else if(propertyName == 'phone') result = 'blt_telephone1';
            else if(propertyName == 'phone2') result = 'blt_telephone2';
            else if(propertyName == 'email') result = 'EMailAddress1';
        }*/


        if (!result)
            throw new Error("Unknown property: " + propertyName);

        return result;
    }

    this.getGridValue = function (gridRecord, appCode, propertyName) {

        var result = null;

        if (!appCode || ['CC', 'PR'].indexOf(appCode) < 0)
            throw new Error("Unknown application code: " + appCode);

        if (!gridRecord)
            throw new Error("No data record supplied");

        if (!propertyName || ['guid', 'name', 'company'].indexOf(propertyName) < 0)
            throw new Error("Unknown property: " + propertyName);



        /*if (source == 'blt_capturecontact') { //cc 1.x
            if(propertyName == 'guid') result = gridRecord['blt_capturecontactId'];
            else if(propertyName == 'name') result = gridRecord['blt_fullname'];
            else if(propertyName == 'company') result = gridRecord['blt_companyname'];
        }
        else */


        if (appCode == 'CC') { // cc 2.x
            if (propertyName == 'guid') result = gridRecord['id'];
            else if (propertyName == 'name') result = gridRecord['name'];
            else if (propertyName == 'company') result = gridRecord['company'];
        }
        else if (appCode == 'PR') { // profiler 2.x
            if (propertyName == 'guid') result = gridRecord['guid'];
            else if (propertyName == 'name') result = gridRecord['name'];
            else if (propertyName == 'company') result = gridRecord['contextcompany'];
        }

        return result;

    }

    this.convertLeads = function (target, source, sourceids, sourcerecords) {

        var lib = Broadlook.Library;

        lib.cleanMessages();

        var convertParams = new Object;
        var rownums = sourceids; // || [];
        var records = sourcerecords; // || [];

        if (source == "cc") {

            convertParams.app = "CC";

            if (!rownums)
                rownums = grid.getSelectedRows();

            if (!records) {
                records = [];
                jQuery.each(rownums, function (index, value) {
                    var rec = grid.getData()[value];
                    records.push(rec);
                });
            }

        }
        else {

            convertParams.app = "PR";

            if (!rownums) {
                var s = String(jQuery("#grid").jqGrid('getGridParam', 'selarrrow'));
                rownums = s.split(',');
            }

            if (!records) {
                records = [];
                for (var n = 0; n < rownums.length; n++) {
                    var rownum = rownums[n];
                    var rec = lib.$("#grid").jqGrid('getRowData', rownum);
                    records.push(rec);
                }
            }
        }

        if (rownums.length == 0) {
            lib.showError("No records selected");
            return;
        }

        if (target != 'contact' && target != 'lead') {
            lib.showError("Not supported conversion target");
            return;
        }

        if (source != 'blt_capturecontact' && source != 'blt_profilerlead' && source != 'cc') {
            lib.showError("Not supported conversion source");
            return;
        }



        convertParams.source = source;
        convertParams.target = target;
        //convertParams.ending = ""; if (rownums.length > 1) convertParams.ending = "s";
        convertParams.ending = (rownums.length > 1) ? "s" : "";
        convertParams.connlist = [];
        convertParams.connids = [];
        convertParams.connrownums = [];
        convertParams.savedids = [];
        convertParams.newlist = [];
        convertParams.newids = [];
        convertParams.companynames = [];
        convertParams.gridrows = [];
        convertParams.sourcerecords = sourcerecords; // only cc uses it so far
        convertParams.sourceids = sourceids;


        if (source == 'blt_profilerlead')
            convertParams.company = Broadlook.ProfilerCompany.company;

        convertParams.companynames.push('');

        for (var i = 0; i < rownums.length; i++) {
            rownum = rownums[i];
            rec = records[i]; //lib.$("#grid").jqGrid('getRowData', rownum);


            convertParams.gridrows.push(rec);

            var guid = lib.getGridValue(rec, convertParams.app, 'guid');
            var name = lib.getGridValue(rec, convertParams.app, 'name');
            var companyname = lib.getGridValue(rec, convertParams.app, 'company');

            var connid;
            var connname;

            /*if (source == 'blt_capturecontact') {
                guid = rec['blt_capturecontactId'];
                name = rec['blt_fullname'];
                companyname = rec['blt_companyname'];
            }
            else if (source == 'cc') {
                guid = rec['id'];
                name = rec['name'];
                companyname = rec['company'];
            }
            else{
                guid = rec['guid'];
                name = rec['name'];
                companyname =  rec['contextcompany'];
            }*/

            if (target == 'lead') {
                connid = rec['crmleadid'];
                connname = rec['crmleadname'];
            } else {
                connid = rec['crmcontactid'];
                connname = rec['crmcontactname'];
            }

            if (lib.nz(companyname))
                convertParams.companynames.push(companyname);

            if (lib.z(name))
                name = '(no name)';

            if (lib.nz(connid)) {

                var connlink = lib.formatConnectionLink(connid, connname, target, true);

                convertParams.connlist.push("<li>" + name + " is already connected to " + connlink + "</li>");
                convertParams.connids.push(connid);
                convertParams.connrownums.push(rownum);
                convertParams.savedids.push(guid);
            }
            else {
                convertParams.newlist.push("<li>" + name + "</li>");
                convertParams.newids.push(guid);
            }

        }

        lib.$('.ending', '#converttargetdlg').text(convertParams.ending);
        lib.$("#convert-list-existing").html("<ul>" + convertParams.connlist.join('') + "</ul>");
        lib.$("#convert-list-new").html("<ul>" + convertParams.newlist.join('') + "</ul>");

        var h = lib.$("#convert-header-existing").html();
        h = h.replace(/contact/gi, convertParams.target);
        h = h.replace(/lead/gi, convertParams.target);
        lib.$("#convert-header-existing").html(h);

        h = lib.$("#convert-header-new").html();
        h = h.replace(/contact/gi, convertParams.target);
        h = h.replace(/lead/gi, convertParams.target);
        lib.$("#convert-header-new").html(h);

        if (convertParams.newids.length > 0)
            lib.$("#convert-header-new").show();
        else
            lib.$("#convert-header-new").hide();


        var updateexistingvalue = '0';
        if (convertParams.updateexisting === true || (convertParams.updateexisting !== false && convertParams.connids.length > 0)) updateexistingvalue = '1';

        lib.$('#convert-checkbox-existing', '#converttargetdlg').val(updateexistingvalue);

        if (convertParams.connids.length > 0)
            lib.$("#convert-header-existing").show();
        else
            lib.$("#convert-header-existing").hide();


        convertParams.steps = [];

        lib.goForward(lib.convertDialog, convertParams);

        //lib.convertDialog(convertParams);
    }

    this.goForward = function (nextStep, convertParams) {
        convertParams.steps.push(nextStep);
        nextStep(convertParams);
    }

    this.goBack = function (convertParams) {

        var lastStep = convertParams.steps.pop(); // current
        lastStep = convertParams.steps.pop(); // prev
        this.goForward(lastStep, convertParams);
    }

    this.convertDialog = function (convertParams) {

        var lib = Broadlook.Library;

        lib.setDialogSize(convertParams);

        lib.$("#converttargetdlg").dialog({
            title: 'Convert to ' + convertParams.target + convertParams.ending,
            width: convertParams.dialog.width,
            height: convertParams.dialog.height,
            position: [convertParams.dialog.left, convertParams.dialog.top],
            modal: true,
            buttons: {

                "Next": function () {

                    convertParams.updateexisting = convertParams.connids.length > 0 && lib.$('[#convert-checkbox-existing]:checked', '#converttargetdlg').val() == "1";
                    //convertParams.lastStep = Broadlook.Library.convertDialog;

                    var nextStep;
                    if (convertParams.updateexisting) nextStep = lib.mergeDialog;
                    else {
                        if (convertParams.target == "contact") nextStep = lib.accountDialog;
                        else nextStep = lib.ownerDialog;
                    }

                    lib.$(this).dialog("close");
                    lib.goForward(nextStep, convertParams);
                },

                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }); //.width(570).height(170);

    }

    this.accountDialog = function (convertParams) {

        var lib = Broadlook.Library;

        var options;
        var selectlist = lib.$('#account-list');
        lib.$("option", selectlist).remove();

        if (selectlist.prop)
            options = selectlist.prop('options');
        else
            options = selectlist.attr('options');

        if (options)
            lib.$.each(convertParams.companynames, function (_, name) {
                options[options.length] = new Option(name, name);
            });


        if (lib.z(convertParams.searchedAccountName))
            convertParams.searchedAccountName = lib.getDefaultAccountName();

        if (lib.z(convertParams.searchedAccountName) && options) {
            if (convertParams.companynames.length > 1) {
                convertParams.searchedAccountName = convertParams.companynames[1];
                selectlist.val(convertParams.searchedAccountName);
            }
        }

        lib.addAccountDefaults(convertParams.selectedAccountId);

        lib.$("#AccountNameTextBox", "#lookupaccount").val(convertParams.searchedAccountName);


        if (lib.z(convertParams.accountRecords)) {
            lib.convertParams = convertParams;
            if (lib.nz(convertParams.searchedAccountName))
                lib.lookupAccount();
        }
        else
            lib.accountCallback(convertParams.accountRecords);

        lib.setDialogSize(convertParams);

        lib.$("#lookupaccount").dialog({
            title: 'Select a parent account for the new contacts',
            width: convertParams.dialog.width,
            height: convertParams.dialog.height,
            position: [convertParams.dialog.left, convertParams.dialog.top],
            modal: true,
            buttons: {
                "Back": function () {
                    lib.$(this).dialog("close");
                    lib.goBack(convertParams);
                },
                "Next": function () {

                    lib.cleanMessages();

                    var accountid = lib.$("input[name:account]:checked", "#lookupres").val();

                    if (!lib.nz(accountid)) {
                        alert('Please make a selection');
                        return;
                    }

                    convertParams.searchedAccountName = lib.$("#AccountNameTextBox", "#lookupaccount").val();

                    convertParams.selectedAccountId = accountid;
                    convertParams.selectedAccountName = lib.$("input[name:account]:checked", "#lookupres").next().text();


                    lib.$(this).dialog("close");
                    lib.goForward(lib.ownerDialog, convertParams);
                },
                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }); //.width(570).height(170);

    }


    this.lookupAccount = function (searchstring) {
        var lib = Broadlook.Library;

        if (!searchstring)
            searchstring = lib.$("#AccountNameTextBox").val();

        lib.$("#lookupres").html("Loading Account records...");

        if (lib.demo) {
            var demorecords = [];
            demorecords.push({ Id: "DEMO-ID1", Name: searchstring + " #1 [demo]", City: "Boston", State: "MA" });
            demorecords.push({ Id: "DEMO-ID1", Name: searchstring + " #2 [demo]", City: "Chicago", State: "IL" });
            lib.accountCallback(demorecords);
            return;
        }

        lib.retrieveAccountRecords(searchstring, function (nativeRecords) {
            var virtualRecords = lib.virtualizeAccountRecords(nativeRecords);
            lib.accountCallback(virtualRecords);
        });

    }

    this.accountCallback = function (virtualRecords, selectedValue) {

        var lib = Broadlook.Library;

        if (!virtualRecords) virtualRecords = [];

        var convertParams = lib.convertParams;
        convertParams.accountRecords = virtualRecords;

        var s0 = [];
        s0.push("<div>");

        var s = [];
        s.push('<hr>');
        s.push("<div>");


        var defvalue = selectedValue;

        if (virtualRecords.length == 0) {
            lib.addAccountRow(s, "No matching accounts found", "");
        }
        else {

            if (!selectedValue)
                if (lib.getDefaultAccountId) defvalue = lib.getDefaultAccountId();

            var i = 0;
            var len = virtualRecords.length;
            while (i < len) {

                var name = virtualRecords[i].Name;
                var id = virtualRecords[i].Id;

                var city = virtualRecords[i].City;
                var st = virtualRecords[i].State;

                var location = (lib.nz(city) ? city : '') + (lib.nz(st) ? (lib.nz(city) ? ', ' : '') + st : '');

                name = lib.nz(location) ? name + ' (' + location + ')' : name;


                var radio = lib.formatRadio("account", id, name, defvalue);
                var link = lib.formatTextLink(id, "View", "account");

                if (id == defvalue) lib.addAccountRow(s0, radio, link);
                else lib.addAccountRow(s, radio, link);

                i++;
            }


        }

        s0.push("</div>");
        s.push("</div>");

        lib.addAccountDefaults(convertParams.selectedAccountId);

        lib.$("#lookupres").html(s0.join('') + lib.$("#lookupres").html() + s.join(''));

        // make selection
        if (virtualRecords.length == 0) {
            // select "Create new account" option
            lib.$("#account_new").attr("checked", "checked");
        }
        else {
            // select first if nothing was selected
            if (!defvalue)
                lib.$("#account_" + virtualRecords[0].Id).attr("checked", "checked");
        }


    }


    this.ownerDialog = function (convertParams) { // target, source, ids,

        var lib = Broadlook.Library;

        if (lib.z(convertParams.ownerRecords)) {
            lib.convertParams = convertParams;

            convertParams.ownerRecords = [];

            var retrieveUsersCallback = function (nativeResponse) {

                var callback = function (nativeResponse2) {

                    var virtualRecords = lib.virtualizeOwnerRecords(nativeResponse2);

                    if (virtualRecords.length > 0) {
                        lib.convertParams.ownerRecords = lib.convertParams.ownerRecords.concat(virtualRecords);
                        lib.retrieveNextPage(nativeResponse2, callback);
                    }
                    else
                        lib.ownerCallback(lib.convertParams.ownerRecords);
                };

                callback(nativeResponse);
            };

            if (!lib.demo)
                lib.retrieveUsers(retrieveUsersCallback);
            else
                retrieveUsersCallback(null);
        }

        var ids = [];

        if (!convertParams.updateexisting)
            convertParams.convert2newids = convertParams.newids.concat(convertParams.savedids);
        else
            convertParams.convert2newids = convertParams.newids;

        lib.setDialogSize(convertParams);

        lib.$("#lookupowner").dialog({
            title: 'Select an owner for new records',
            width: convertParams.dialog.width,
            height: convertParams.dialog.height,
            position: [convertParams.dialog.left, convertParams.dialog.top],
            modal: true,
            buttons: {
                "Back": function () {
                    lib.$(this).dialog("close");
                    lib.goBack(convertParams);
                },
                "Next": function () {

                    var userId = lib.$("input[name:systemuser]:checked", "#lookupowner-res").val();
                    if (lib.z(userId)) //return;
                        convertParams.assignToUser = null;
                    else
                        convertParams.assignToUser = userId;

                    lib.$(this).dialog("close");
                    lib.goForward(lib.executeDialog, convertParams);
                },
                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }); //.width(570).height(170);


    }


    this.ownerCallback = function (virtualRecords) {
        // Unified	

        var lib = Broadlook.Library;

        //if (typeof (virtualRecords) === "undefined" || nativeRecords === null) return;

        var s0 = [];
        s0.push("<div>");

        var s = [];
        s.push("<div>");

        var defvalue = lib.currentUserId.replace('{', '').replace('}', '').toLowerCase();

        if (virtualRecords.length == 0) {
            lib.addAccountRow(s, "No users found", "");
        }
        else {

            var i = virtualRecords.length;
            while (i--) {

                var transformedRecord = virtualRecords[i]; // lib.transformOwnerRecord(nativeRecords[i]);

                var link = lib.formatTextLink(transformedRecord.Id, "View", "systemuser");
                var radio = lib.formatRadio("systemuser", transformedRecord.Id, transformedRecord.Name, defvalue);

                if (transformedRecord.Id == defvalue) lib.addAccountRow(s0, radio, link);
                else lib.addAccountRow(s, radio, link);
            }
        }


        s0.push("</div>");
        s.push("</div>");

        if (s0.length > 2) s0.push('<hr>');

        lib.$("#lookupowner-res").html(s0.join('') + s.join(''));

    }


    this.MultiMergeModule = {

        containerId: "#merge-table",
        sourceRecord: null, // optional; contact capture data
        records: [],
        target: null,
        showCallback: null,
        result: [],
        edits: [],

        //convertParams: null,

        foo: function () {
            alert('Foo');
        },

        show: function () {



            //if (!params) throw "Empty parameter: params";
            //if (!params.sourceRecord) throw "Empty parameter: params.sourceRecord";
            //if (!params.ids) throw "Empty parameter: params.ids";
            //
            //

            //alert(params.records.length);

            var lib = Broadlook.Library;
            var $ = lib.$;
            var self = lib.MultiMergeModule;


            var target = self.target;
            var records = self.records;
            var containerId = self.containerId;
            var sourceRecord = self.sourceRecord; // optional

            if (!records) throw "Empty parameter: records";
            if (!containerId) throw "Empty parameter: containerId";
            if (!target) throw "Empty parameter: target";


            var $container = $(containerId);
            $container.html('');

            var $link = jQuery("<a href='#'>Reload</a>");
            $link.click(self.show);
            $link.appendTo($container);

            var $link = jQuery("<a href='#'>Auto</a>");
            $link.click(self.auto);
            $link.appendTo($container);

            var $link = jQuery("<a href='#'>Highlight</a>");
            $link.click(self.highlight);
            $link.appendTo($container);


            var $table = jQuery("<table class='multi-merge'></table>").appendTo($container);
            var $headerrow = jQuery("<tr></tr>").appendTo($table);

            var $cell0 = jQuery("<th></th>").appendTo($headerrow);
            var $value0 = jQuery("<span>" + "Field" + "</span>").appendTo($cell0);

            var $cell1 = jQuery("<th></th>").appendTo($headerrow);
            var $value1 = jQuery("<span>" + "Result" + "</span>").appendTo($cell1);


            if (sourceRecord) {
                var $cell1 = jQuery("<th></th>").appendTo($headerrow);
                jQuery("<span>" + "Contact Capture Data" + "</span>").appendTo($cell1);

                $link = jQuery("<a href='#' id='remove-cc'>Remove</a>");
                $link.click(function () {
                    Broadlook.Library.MultiMergeModule.remove(this);
                    Broadlook.Library.MultiMergeModule.show();

                });
                $link.appendTo($cell1);

                $link = jQuery("<a href='#' id='select-cc'>Select</a>");
                $link.click(function () {
                    Broadlook.Library.MultiMergeModule.selectAllValues(this);
                    Broadlook.Library.MultiMergeModule.show();

                });
                $link.appendTo($cell1);
            }


            var showValue = function (v) {

                var fmt = function (v) {

                    if (typeof (v) == "undefined")
                        return null;

                    if (typeof (v) == "string") {

                        if (v != null && v.substring(0, 6) == "/Date(")
                            return lib.convertToDate(v);

                        return v;
                    }

                    if (typeof (v) == "boolean") {

                        if (v) return "Yes"; else return "No";

                    }

                    if (typeof (v) == "object") {
                        var t = v.type;

                        if (typeof (t) == "undefined") {
                            t = v.__metadata;
                            if (typeof (t) != "undefined") {
                                t = t.type;

                                if (t == "Microsoft.Crm.Sdk.Data.Services.EntityReference")
                                    return v.Name;
                                else if (t == "Microsoft.Crm.Sdk.Data.Services.Money")
                                    return v.Value;
                                else if (t == "Microsoft.Crm.Sdk.Data.Services.OptionSetValue")
                                    return v.Value;


                            }

                        }
                        else {
                            if (t == "Microsoft.Crm.Sdk.Data.Services.Lead")
                                return v.uri;
                        }

                    }

                    return v;
                }

                var val = fmt(v);
                if (val == null)
                    return "";
                else return val;


            }

            var fields = [];
            var $rows = [];


            // collect all available fields

            for (var i = 0; i < records.length; i++) {
                var record = records[i];

                for (var field in record) {
                    //var nativePropertyName = self.translateVirtualPropertyName(field, target);
                    //if (!virtualPropertyName) virtualPropertyName = "_" + field
                    if ($.inArray(field, fields) >= 0) continue;
                    fields.push(field);
                }

            }

            // draw all rows and the columns #1 (Field names), #2 (Result), #3 (Contact Capture Data)

            for (j = 0; j < fields.length; j++) {

                var field = fields[j];

                var $row = jQuery("<tr></tr>").appendTo($table);
                $rows.push($row);

                // field column

                var $cell = jQuery("<th></th>").appendTo($row);
                jQuery("<span>" + field + "</span>").appendTo($cell);

                // result column

                $cell = jQuery("<th id='cell-" + field + "'></th>").appendTo($row);

                var value = self.result[field];
                if (value == "undefined") value = "";

                if (self.edits[field]) {

                    jQuery('<input name="name" size="15" type="text" value="' + value + '" />').appendTo($cell);

                    $link = jQuery("<a href='#' id='save-" + field + "'>Save</a>");
                    $link.click(function () {
                        Broadlook.Library.MultiMergeModule.save(this);
                        Broadlook.Library.MultiMergeModule.show();
                    });
                    $link.appendTo($cell);

                    $link = jQuery("<a href='#' id='cancel-" + field + "'>Cancel</a>");
                    $link.click(function () {
                        Broadlook.Library.MultiMergeModule.cancel(this);
                        Broadlook.Library.MultiMergeModule.show();

                    });
                    $link.appendTo($cell);

                    $link = jQuery("<a href='#' id='clear-" + field + "'>Clear</a>");
                    $link.click(function () {
                        Broadlook.Library.MultiMergeModule.clear(this);
                        Broadlook.Library.MultiMergeModule.show();

                    });
                    $link.appendTo($cell);

                }
                else {
                    var $res = jQuery("<span class='result value' id='result-" + field + "'>" + showValue(value) + "</span>").appendTo($cell);

                    $res.click(function () {
                        Broadlook.Library.MultiMergeModule.edit(this);
                        Broadlook.Library.MultiMergeModule.show();
                    });

                    $link = jQuery("<a href='#' id='edit-" + field + "'>Edit</a>");
                    $link.click(function () {
                        Broadlook.Library.MultiMergeModule.edit(this);
                        Broadlook.Library.MultiMergeModule.show();

                    });
                    $link.appendTo($cell);

                }
                if (sourceRecord) {
                    // broadlook column

                    var value = '';
                    var sourceField = self.translateCrmToVirtualPropertyName(field);
                    if (lib.nz(sourceRecord[sourceField])) value = sourceRecord[sourceField];

                    $cell = jQuery("<td></td>").appendTo($row);
                    jQuery("<span>" + value + "</span>").appendTo($cell);
                }

            }

            var foo = function () { alert(1); }



            // draw a table

            for (var i = 0; i < records.length; i++) {

                var record = records[i];

                // header cell (name)

                var $cell = jQuery("<th></th>").appendTo($headerrow);
                jQuery("<span>" + record.FullName + "</span>").appendTo($cell);

                var index = i;
                var $link = jQuery("<a href='#' id='remove-" + index + "'>Remove</a>");
                $link.click(function () {
                    Broadlook.Library.MultiMergeModule.remove(this);
                    Broadlook.Library.MultiMergeModule.show();

                });
                $link.appendTo($cell);

                $link = jQuery("<a href='#' id='select-" + index + "'>Select</a>");
                $link.click(function () {
                    Broadlook.Library.MultiMergeModule.selectAllValues(this);
                    Broadlook.Library.MultiMergeModule.show();

                });
                $link.appendTo($cell);


                // value cell

                for (j = 0; j < fields.length; j++) {
                    var field = fields[j];

                    var value = '';
                    if (lib.nz(record[field])) value = record[field];

                    var $row = $rows[j];

                    var $cell = jQuery("<td></td>").appendTo($row);
                    jQuery("<span>" + showValue(value) + "</span>").appendTo($cell);

                    $cell.click += foo;



                }
            }

            if (typeof (self.showCallback) != 'undefined')
                self.showCallback();


        },

        auto: function () {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;

            alert('auto');
        },

        highlight: function () {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;

            alert('hightlight');
        },

        remove: function (link) {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;

            var index = link.id.split('-')[1];

            if (index == 'cc')
                self.sourceRecord = null;
            else
                self.records.splice(index, 1);
        },

        selectAllValues: function (link) {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;

            var index = link.id.split('-')[1];

            var source;
            if (index == 'cc')
                source = self.sourceRecord;
            else
                source = self.records[index];

            for (var prop in source) {
                var val = source[prop];
                if (index == 'cc')
                    prop = self.translateVirtualPropertyName(prop, self.target);

                if (prop && prop != 'ContactId' && prop != 'LeadId')
                    if (lib.nz(val))
                        self.result[prop] = val;
            }

        },

        edit: function (link) {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;
            var $ = lib.$;


            var field = link.id.split('-')[1];

            //var value = self.result[field];

            //alert(value);

            //var $cell = $("#cell-" + field);

            //$cell.html();

            self.edits[field] = true;



        },

        cancel: function (link) {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;
            var $ = lib.$;

            var field = link.id.split('-')[1];
            self.edits[field] = false;
        },

        save: function (link) {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;
            var $ = lib.$;

            var field = link.id.split('-')[1];
            self.edits[field] = false;

            var $input = $("input", "#cell-" + field);
            var value = $input.val();

            self.result[field] = value;

        },

        clear: function (link) {
            var lib = Broadlook.Library;
            var self = lib.MultiMergeModule;
            var $ = lib.$;

            var field = link.id.split('-')[1];
            self.edits[field] = false;
            self.result[field] = '';
        },

        translateVirtualPropertyName: function (name, target) {

            var nativeName = null;

            if (target == 'lead') {
                if (name == 'id') nativeName = 'LeadId';
                else if (name == 'name') nativeName = 'FullName';
                else if (name == 'first') nativeName = 'FirstName';
                else if (name == 'middle') nativeName = 'MiddleName';
                else if (name == 'last') nativeName = 'LastName';
                else if (name == 'salutation') nativeName = 'Salutation';
                else if (name == 'suffix') nativeName = 'Suffix';
                else if (name == 'title') nativeName = 'JobTitle';
                else if (name == 'company') nativeName = 'CompanyName';
                else if (name == 'department') nativeName = 'Department';

                    //else if (name == 'venues') nativeName = 'blt_venues';
                    //else if (name == 'venuesHtml') nativeName = 'venues';
                else if (name == 'facebook') nativeName = 'blt_facebook';
                else if (name == 'twitter') nativeName = 'blt_twitter';
                else if (name == 'linkedin') nativeName = 'blt_linkedin';
                else if (name == 'googleplus') nativeName = 'blt_googleplus';
                else if (name == 'skype') nativeName = 'blt_skype';

                else if (name == 'socl') nativeName = 'blt_socl';
                else if (name == 'blog') nativeName = 'blt_blog';
                else if (name == 'youtube') nativeName = 'blt_youtube';
                else if (name == 'xing') nativeName = 'blt_xing';
                else if (name == 'quora') nativeName = 'blt_quora';

                else if (name == 'slideshare') nativeName = 'blt_slideshare';
                else if (name == 'reddit') nativeName = 'blt_reddit';
                else if (name == 'stumbleupon') nativeName = 'blt_stumbleupon';
                else if (name == 'digg') nativeName = 'blt_digg';
                else if (name == 'pinterest') nativeName = 'blt_pinterest';

                    //else if (name == 'crmleadid') nativeName = 'crmleadid';
                    //else if (name == 'crmleadname') nativeName = 'crmleadname';
                    //else if (name == 'crmcontactid') nativeName = 'crmcontactid';
                    //else if (name == 'crmcontactname') nativeName = 'crmcontactname';
                    //else if (name == 'crmaccountid') nativeName = 'crmaccountid';
                    //else if (name == 'crmaccountname') nativeName = 'crmaccountname';

                else if (name == 'email') nativeName = 'EmailAddress';
                else if (name == 'website') nativeName = 'WebsiteUrl';

                else if (name == 'phone') nativeName = 'Telephone1';
                else if (name == 'phone2') nativeName = 'Telephone2';
                else if (name == 'mobile') nativeName = 'MobilePhone';
                else if (name == 'fax') nativeName = 'Fax';
                else if (name == 'pager') nativeName = 'Pager';

                else if (name == 'address1') nativeName = 'Address1Line1';
                else if (name == 'address2') nativeName = 'Address1Line2';
                else if (name == 'city') nativeName = 'Address1City';
                else if (name == 'state') nativeName = 'Address1StateOrProvince';
                else if (name == 'zip') nativeName = 'Address1PostalCode';
                else if (name == 'country') nativeName = 'Address1Country';
            } else if (target == 'contact') {
                if (name == 'id') nativeName = 'ContactId';
                else if (name == 'name') nativeName = 'FullName';
                else if (name == 'first') nativeName = 'FirstName';
                else if (name == 'middle') nativeName = 'MiddleName';
                else if (name == 'last') nativeName = 'LastName';
                else if (name == 'salutation') nativeName = 'Salutation';
                else if (name == 'suffix') nativeName = 'Suffix';
                else if (name == 'title') nativeName = 'JobTitle';
                else if (name == 'company') nativeName = 'CompanyName';
                else if (name == 'department') nativeName = 'Department';

                    //else if (name == 'venues') nativeName = 'blt_venues';
                    //else if (name == 'venuesHtml') nativeName = 'venues';
                else if (name == 'facebook') nativeName = 'blt_facebook';
                else if (name == 'twitter') nativeName = 'blt_twitter';
                else if (name == 'linkedin') nativeName = 'blt_linkedin';
                else if (name == 'googleplus') nativeName = 'blt_googleplus';
                else if (name == 'skype') nativeName = 'blt_skype';

                else if (name == 'socl') nativeName = 'blt_socl';
                else if (name == 'blog') nativeName = 'blt_blog';
                else if (name == 'youtube') nativeName = 'blt_youtube';
                else if (name == 'xing') nativeName = 'blt_xing';
                else if (name == 'quora') nativeName = 'blt_quora';

                else if (name == 'slideshare') nativeName = 'blt_slideshare';
                else if (name == 'reddit') nativeName = 'blt_reddit';
                else if (name == 'stumbleupon') nativeName = 'blt_stumbleupon';
                else if (name == 'digg') nativeName = 'blt_digg';
                else if (name == 'pinterest') nativeName = 'blt_pinterest';

                    //else if (name == 'crmleadid') nativeName = 'crmleadid';
                    //else if (name == 'crmleadname') nativeName = 'crmleadname';
                    //else if (name == 'crmcontactid') nativeName = 'crmcontactid';
                    //else if (name == 'crmcontactname') nativeName = 'crmcontactname';
                    //else if (name == 'crmaccountid') nativeName = 'crmaccountid';
                    //else if (name == 'crmaccountname') nativeName = 'crmaccountname';

                else if (name == 'email') nativeName = 'EmailAddress';
                else if (name == 'website') nativeName = 'WebsiteUrl';

                else if (name == 'phone') nativeName = 'Telephone1';
                else if (name == 'phone2') nativeName = 'Telephone2';
                else if (name == 'mobile') nativeName = 'MobilePhone';
                else if (name == 'fax') nativeName = 'Fax';
                else if (name == 'pager') nativeName = 'Pager';

                else if (name == 'address1') nativeName = 'Address1Line1';
                else if (name == 'address2') nativeName = 'Address1Line2';
                else if (name == 'city') nativeName = 'Address1City';
                else if (name == 'state') nativeName = 'Address1StateOrProvince';
                else if (name == 'zip') nativeName = 'Address1PostalCode';
                else if (name == 'country') nativeName = 'Address1Country';
            }

            return nativeName;
        },

        translateCrmToVirtualPropertyName: function (name) {

            var virtualName = null;


            if (name == 'LeadId') virtualName = 'id';
            else if (name == 'ContactId') virtualName = 'id';
            else if (name == 'FullName') virtualName = 'name';
            else if (name == 'FirstName') virtualName = 'first';
            else if (name == 'MiddleName') virtualName = 'middle';
            else if (name == 'LastName') virtualName = 'last';
            else if (name == 'Salutation') virtualName = 'salutation';
            else if (name == 'Suffix') virtualName = 'suffix';
            else if (name == 'JobTitle') virtualName = 'title';
            else if (name == 'CompanyName') virtualName = 'company';
            else if (name == 'Department') virtualName = 'department';

                //else if (name == 'blt_venues') virtualName = 'venues';
                //else if (name == 'venues') virtualName = 'venuesHtml';
            else if (name == 'blt_facebook') virtualName = 'facebook';
            else if (name == 'blt_twitter') virtualName = 'twitter';
            else if (name == 'blt_linkedin') virtualName = 'linkedin';
            else if (name == 'blt_googleplus') virtualName = 'googleplus';
            else if (name == 'blt_skype') virtualName = 'skype';

            else if (name == 'blt_socl') virtualName = 'socl';
            else if (name == 'blt_blog') virtualName = 'blog';
            else if (name == 'blt_youtube') virtualName = 'youtube';
            else if (name == 'blt_xing') virtualName = 'xing';
            else if (name == 'blt_quora') virtualName = 'quora';

            else if (name == 'blt_slideshare') virtualName = 'slideshare';
            else if (name == 'blt_reddit') virtualName = 'reddit';
            else if (name == 'blt_stumbleupon') virtualName = 'stumbleupon';
            else if (name == 'blt_digg') virtualName = 'digg';
            else if (name == 'blt_pinterest') virtualName = 'pinterest';

                //else if (name == 'connections') virtualName = 'connections'; // virtual-only fields
                //else if (name == 'crmleadid') virtualName = 'crmleadid';
                //else if (name == 'crmleadname') virtualName = 'crmleadname';
                //else if (name == 'crmcontactid') virtualName = 'crmcontactid';
                //else if (name == 'crmcontactname') virtualName = 'crmcontactname';
                //else if (name == 'crmaccountid') virtualName = 'crmaccountid';
                //else if (name == 'crmaccountname') virtualName = 'crmaccountname';


            else if (name == 'EmailAddress') virtualName = 'email';
            else if (name == 'WebsiteUrl') virtualName = 'website';

            else if (name == 'Telephone1') virtualName = 'phone';
            else if (name == 'Telephone2') virtualName = 'phone2';
            else if (name == 'MobilePhone') virtualName = 'mobile';
            else if (name == 'Fax') virtualName = 'fax';
            else if (name == 'Pager') virtualName = 'pager';

            else if (name == 'Address1Line1') virtualName = 'address1';
            else if (name == 'Address1Line2') virtualName = 'address2';
            else if (name == 'Address1City') virtualName = 'city';
            else if (name == 'Address1Stateorprovince') virtualName = 'state';
            else if (name == 'Address1PostalCode') virtualName = 'zip';
            else if (name == 'Address1Country') virtualName = 'country';

            return virtualName;
        },

        translateCrmContactPropertyName: function (name) {

            var virtualName = null;

            if (name == 'ContactId') virtualName = 'id';
            else if (name == 'FullName') virtualName = 'name';
            else if (name == 'FirstName') virtualName = 'first';
            else if (name == 'MiddleName') virtualName = 'middle';
            else if (name == 'LastName') virtualName = 'last';
            else if (name == 'Salutation') virtualName = 'salutation';
            else if (name == 'Suffix') virtualName = 'suffix';
            else if (name == 'JobTitle') virtualName = 'title';
            else if (name == 'CompanyName') virtualName = 'company';
            else if (name == 'Department') virtualName = 'department';

                //else if (name == 'blt_venues') virtualName = 'venues';
                //else if (name == 'venues') virtualName = 'venuesHtml';
            else if (name == 'blt_facebook') virtualName = 'facebook';
            else if (name == 'blt_twitter') virtualName = 'twitter';
            else if (name == 'blt_linkedin') virtualName = 'linkedin';
            else if (name == 'blt_googleplus') virtualName = 'googleplus';
            else if (name == 'blt_skype') virtualName = 'skype';

            else if (name == 'blt_socl') virtualName = 'socl';
            else if (name == 'blt_blog') virtualName = 'blog';
            else if (name == 'blt_youtube') virtualName = 'youtube';
            else if (name == 'blt_xing') virtualName = 'xing';
            else if (name == 'blt_quora') virtualName = 'quora';

            else if (name == 'blt_slideshare') virtualName = 'slideshare';
            else if (name == 'blt_reddit') virtualName = 'reddit';
            else if (name == 'blt_stumbleupon') virtualName = 'stumbleupon';
            else if (name == 'blt_digg') virtualName = 'digg';
            else if (name == 'blt_pinterest') virtualName = 'pinterest';

                //else if (name == 'connections') virtualName = 'connections'; // virtual-only fields
                //else if (name == 'crmleadid') virtualName = 'crmleadid';
                //else if (name == 'crmleadname') virtualName = 'crmleadname';
                //else if (name == 'crmcontactid') virtualName = 'crmcontactid';
                //else if (name == 'crmcontactname') virtualName = 'crmcontactname';
                //else if (name == 'crmaccountid') virtualName = 'crmaccountid';
                //else if (name == 'crmaccountname') virtualName = 'crmaccountname';


            else if (name == 'EmailAddress') virtualName = 'email';
            else if (name == 'WebsiteUrl') virtualName = 'website';

            else if (name == 'Telephone1') virtualName = 'phone';
            else if (name == 'Telephone2') virtualName = 'phone2';
            else if (name == 'MobilePhone') virtualName = 'mobile';
            else if (name == 'Fax') virtualName = 'fax';
            else if (name == 'Pager') virtualName = 'pager';

            else if (name == 'Address1Line1') virtualName = 'address1';
            else if (name == 'Address1Line2') virtualName = 'address2';
            else if (name == 'Address1City') virtualName = 'city';
            else if (name == 'Address1Stateorprovince') virtualName = 'state';
            else if (name == 'Address1PostalCode') virtualName = 'zip';
            else if (name == 'Address1Country') virtualName = 'country';

            return virtualName;
        }



    }


    this.mergeMultipleDialog = function (convertParams) {
        // 
        // - first column has field names (labels)
        // - optional Broadlook record ("Contact Capture Data")
        // - one CRM record is one column
        //

        var lib = Broadlook.Library;

        try {

            // validate

            if (!convertParams) throw "Empty parameter: convertParams";
            if (!convertParams.multiMerge) throw "Empty parameter: convertParams.multiMerge";
            if (!convertParams.multiMerge.ids) throw "Empty parameter: convertParams.multiMerge.ids";
            if (!convertParams.multiMerge.target) throw "Empty parameter: convertParams.multiMerge.target";
            if (!Broadlook.ContactCapture) throw "Missing object: Broadlook.ContactCapture";
            if (!lib.MultiMergeModule) throw "Missing object: Broadlook.Library.MultiMergeModule";

            if (!convertParams.dialog) throw "Empty parameter: convertParams.dialog";


            //lib.MultiMergeModule.convertParams = convertParams;

            // set size

            lib.setDialogSize(convertParams);


            var showDialogPage = function () {

                //var convertParams = this.convertParams;

                var nextbtnlabel = "Execute";
                //if (convertParams.newids.length > 0) nextbtnlabel = "Next";



                lib.$("#merge-dlg").dialog({
                    title: 'Merge multiple records',
                    width: convertParams.dialog.width,
                    height: convertParams.dialog.height,
                    position: [convertParams.dialog.left, convertParams.dialog.top],
                    modal: true,
                    buttons: {
                        Back: function () {

                            //lib.convertDialog(convertParams);
                            lib.$(this).dialog("close");
                            lib.goBack(convertParams);

                        },
                        "Next": function () {
                            // update fields

                            var rows = lib.$("TR", "#merge-table");
                            var merges = [];
                            var merge = null;

                            for (var i = 0; i < rows.length; i++) {

                                var row = rows[i];
                                var headerrowindicator = lib.$("#merge-row-id", row).val(); // -name

                                if (lib.nz(headerrowindicator)) {
                                    //header row
                                    if (merge && merge.changes && merge.changes.length > 0) merges.push(merge);
                                    merge = new Object;
                                    merge.id = headerrowindicator;
                                    merge.name = lib.$("#merge-header-crmrecord A SPAN", row).text();
                                    merge.changes = [];

                                }
                                else {
                                    //data row
                                    //var selection = lib.$("#merge-row-radio2:checked", row).val();
                                    var selection = lib.$("input[type='radio'][id*='-radio2-']:checked", row).val();
                                    if (selection === "1") {
                                        var fieldname = lib.$("#merge-row-fieldname", row).val();
                                        var newvalue = lib.$("#merge-row-value2", row).val(); // do not get text from label as it may be screwed up by browser (i.e. Skype add-on)
                                        var change = new Object;
                                        change.fieldname = fieldname;
                                        change.value = newvalue;
                                        if (merge != null) merge.changes.push(change);
                                    }
                                }

                            }

                            if (merge != null && merge.changes.length > 0) merges.push(merge);

                            if (merges.length == 0 && (!convertParams.newids || convertParams.newids.length == 0)) {
                                alert('No changes detected');
                                return;
                            }

                            convertParams.merges = merges;

                            var nextStep;

                            if (convertParams.newids.length > 0) {
                                if (convertParams.target == "contact") nextStep = lib.accountDialog;
                                else nextStep = lib.ownerDialog;
                            }
                            else
                                nextStep = lib.executeDialog;

                            lib.goForward(nextStep, convertParams);

                            lib.$(this).dialog("close");
                        },
                        Cancel: function () {
                            lib.$(this).dialog("close");
                        }
                    }

                }); //.width(570).height(170);
            }

            // get full records and show dialog

            lib.retrieveRecords(
                convertParams.multiMerge.target,
                convertParams.multiMerge.ids,
                function (records) {

                    convertParams.multiMerge.records = records.results;

                    // initialize values
                    lib.MultiMergeModule.sourceRecord = convertParams.multiMerge.sourceRecord;
                    lib.MultiMergeModule.target = convertParams.multiMerge.target;
                    lib.MultiMergeModule.records = convertParams.multiMerge.records;
                    lib.MultiMergeModule.showCallback = showDialogPage;


                    lib.MultiMergeModule.show();
                }
                );




        } catch (e) {

            lib.showError("Error thrown in Broadlook.Library.mergeMultipleDialog function: " + e.message);

        }

    }

    this.mergeDialog = function (convertParams) {

        var lib = Broadlook.Library;

        if (lib.z(convertParams.mergeRecords)) {
            lib.$("#merge-table").html('Retrieving data...');
            lib.convertParams = convertParams;
            var setname = "Lead";
            if (convertParams.target == 'contact') setname = "Contact";
            lib.retrieveRecords(setname, convertParams.connids.join(';'), lib.mergeCallback);
        }

        var nextbtnlabel = "Execute";
        if (convertParams.newids.length > 0) nextbtnlabel = "Next";

        lib.setDialogSize(convertParams);

        lib.$("#merge-dlg").dialog({
            title: 'Update CRM Data',
            width: convertParams.dialog.width,
            height: convertParams.dialog.height,
            position: [convertParams.dialog.left, convertParams.dialog.top],
            modal: true,
            buttons: {
                Back: function () {

                    //lib.convertDialog(convertParams);
                    lib.$(this).dialog("close");
                    lib.goBack(convertParams);

                },
                "Next": function () {
                    // update fields

                    var rows = lib.$("TR", "#merge-table");
                    var merges = [];
                    var merge = null;

                    for (var i = 0; i < rows.length; i++) {

                        var row = rows[i];
                        var headerrowindicator = lib.$("#merge-row-id", row).val(); // -name

                        if (lib.nz(headerrowindicator)) {
                            //header row
                            if (merge && merge.changes && merge.changes.length > 0) merges.push(merge);
                            merge = new Object;
                            merge.id = headerrowindicator;
                            merge.name = lib.$("#merge-header-crmrecord A SPAN", row).text();
                            merge.changes = [];

                        }
                        else {
                            //data row
                            //var selection = lib.$("#merge-row-radio2:checked", row).val();
                            var selection = lib.$("input[type='radio'][id*='-radio2-']:checked", row).val();
                            if (selection === "1") {
                                var fieldname = lib.$("#merge-row-fieldname", row).val();
                                var newvalue = lib.$("#merge-row-value2", row).val(); // do not get text from label as it may be screwed up by browser (i.e. Skype add-on)
                                var change = new Object;
                                change.fieldname = fieldname;
                                change.value = newvalue;
                                if (merge != null) merge.changes.push(change);
                            }
                        }

                    }

                    if (merge != null && merge.changes.length > 0) merges.push(merge);

                    if (merges.length == 0 && (!convertParams.newids || convertParams.newids.length == 0)) {
                        alert('No changes detected');
                        return;
                    }

                    convertParams.merges = merges;

                    var nextStep;

                    if (convertParams.newids.length > 0) {
                        if (convertParams.target == "contact") nextStep = lib.accountDialog;
                        else nextStep = lib.ownerDialog;
                    }
                    else
                        nextStep = lib.executeDialog;

                    lib.goForward(nextStep, convertParams);

                    lib.$(this).dialog("close");
                },
                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }); //.width(570).height(170);
    }



    this.mergeCallback = function (crmrecords) {

        var lib = Broadlook.Library;

        if (!crmrecords || !crmrecords.results) return; // ?

        var convertParams = lib.convertParams;

        convertParams.mergeRecords = crmrecords;

        lib.$("#converttargetdlg").dialog("close");


        var arr_connids = convertParams.connids;
        var arr_connrownums = convertParams.connrownums;

        var crmidfield = 'ContactId';
        if (convertParams.target == 'lead') crmidfield = 'LeadId';

        var rows = [];

        var first = lib.$("#merge-first-template", "#merge-dlg");
        rows.push("<tr>" + first.html() + "</tr>");

        var second = lib.$("#merge-second-template", "#merge-dlg");
        rows.push("<tr>" + second.html() + "</tr>");

        var s = '';
        var n = new Object;
        n.value = 0;
        n.group = 0;



        for (var i = 0; i < arr_connrownums.length; i++) {

            var gridrecord;

            if (convertParams.source == "cc")
                gridrecord = convertParams.sourcerecords[i];
            else {
                var rownum = arr_connrownums[i];
                gridrecord = jQuery("#grid").jqGrid('getRowData', rownum);
            }

            var crmrecord = null;
            for (var j = 0; j < crmrecords.results.length; j++)
                if (lib.demo || (lib.nz(crmrecords.results[j][crmidfield]) && crmrecords.results[j][crmidfield] == arr_connids[i])) {
                    crmrecord = crmrecords.results[j];
                    break;
                }

            if (crmrecord == null) {
                convertParams.newids += arr_connids[i] + ";";
                continue;
            }

            n.group = i;

            var addedRows = lib.addRows(crmrecord, gridrecord, n, convertParams.target, arr_connrownums.length == 1);
            rows.push(addedRows.join(''));

        }

        lib.$("#merge-table").html('Select fields to update.');
        lib.$('<table style="width: 100%"><colgroup><col width="20%" /><col width="2%" /><col width="38%" /><col width="2%" /><col width="38%" /></colgroup></table>').append(rows.join('')).appendTo("#merge-table");


        lib.$('#merge-all-radio1, #merge-all-radio2', "#merge-table").click(function (event) {

            var group = event.target.id.slice(-1);

            //            if (group == 1) lib.$("input[type='radio'][id*='radio1'][id*='person']", "#merge-table").click();
            //            else lib.$("input[type='radio'][id*='radio2'][id*='person']", "#merge-table").click();

            if (group == 1) lib.$("input[type='radio'][id*='-radio1-']", "#merge-table").click();
            else lib.$("input[type='radio'][id*='-radio2-']", "#merge-table").click();

        });

        lib.$("input[type='radio'][id*='radio'][id*='person']", "#merge-table").click(function (event) {

            var id = lib.$(event.target).attr('id');
            var group = id.slice(id.indexOf('-group') + 6);
            var side = id.slice(id.indexOf('-radio') + 6, id.indexOf('-group'));

            var rows = lib.$("tr[id*='group" + group + "']", "#merge-table");

            lib.$("input[type='radio'][id*='radio" + side + "']", rows).click();

        });

    }


    this.addRows = function (crmrecord, gridrecord, n, target, hideRowHeader) {

        var lib = Broadlook.Library;


        var rows = [];

        var app = (gridrecord['score']) ? "PR" : "CC";
        //var prefix = '';


        //var name = gridrecord['name']; //CC
        var name = lib.getGridValue(gridrecord, app, 'name');

        var crmid;

        if (target == 'lead') crmid = crmrecord['LeadId']; else crmid = crmrecord['ContactId'];

        var headertemplate = lib.$("#merge-header-template", "#merge-dlg");

        var header = headertemplate.clone();
        lib.$('#merge-header-profilerrecord', header).html(name);
        lib.$('#merge-header-crmrecord', header).html(lib.formatConnectionLink(crmid, crmrecord['FullName'], target, true, true));

        lib.$("#merge-person-radio1", header).attr('name', "merge-person-radio-group" + n.group);
        lib.$("#merge-person-radio2", header).attr('name', "merge-person-radio-group" + n.group);
        lib.$("#merge-person-radio1", header).attr('id', "merge-person-radio1-group" + n.group);
        lib.$("#merge-person-radio2", header).attr('id', "merge-person-radio2-group" + n.group).attr("checked", "checked");



        //var crmdate = new Date( new Number(crmrecord['ModifiedOn'].substring(6, 19)) );
        var crmdate = crmrecord['ModifiedOn'];
        var bldate = new Date();

        if (app == "PR" && Broadlook.ProfilerCompany.company)
            bldate = Broadlook.ProfilerCompany.company.completedon;
        else if (app == "CC")
            bldate = gridrecord['modifiedon'];


        lib.$("#merge-crm-updated", header).html(lib.formatDateDiffText(crmdate));
        lib.$("#merge-broadlook-updated", header).html(lib.formatDateDiffText(bldate));

        //lib.$.datepicker.formatDate('yy-mm-dd', bldate)


        lib.$('#merge-row-id', header).val(crmid);

        if (hideRowHeader) {
            lib.$("#merge-person-radio1-group0", header).hide();
            lib.$("#merge-person-radio2-group0", header).hide();

        }

        rows.push("<tr>" + header.html() + "</tr>");

        var rowtemplate = lib.$("#merge-row-template", "#merge-dlg");
        var haschanges = false;
        //var row, crmproperty, broadlookproperty, label;

        var _addRow = function (label, crmproperty, broadlookpropertyname) {

            var row = rowtemplate.clone();
            var broadlookproperty = null;
            try {
                broadlookproperty = lib.getGridCol(app, broadlookpropertyname);
            }
            catch (err) {
                broadlookproperty = null;
            }
            if (lib.z(broadlookproperty)) return;

            var added = lib.addRow2(row, crmrecord[crmproperty], gridrecord[broadlookproperty], label, crmproperty, broadlookproperty, n);
            if (added) {
                haschanges = true;
                rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
            }

        }

        _addRow('First Name', 'FirstName', 'first');
        _addRow('Middle Name', 'MiddleName', 'middle');
        _addRow('Last Name', 'LastName', 'last');
        if (target == 'lead') _addRow('Company Name', 'CompanyName', 'company');
        _addRow('Job Title', 'JobTitle', 'title');
        _addRow('Phone', 'Telephone1', 'phone');
        _addRow('Phone 2', 'Telephone2', 'phone2');
        _addRow('Mobile Phone', 'MobilePhone', 'mobile');
        _addRow('Fax', 'Fax', 'fax');
        _addRow('Pager', 'Pager', 'pager');
        _addRow('Email', 'EMailAddress1', 'email');
        _addRow('Address 1', 'Address1_Line1', 'address1');
        _addRow('Address 2', 'Address1_Line2', 'address2');
        _addRow('City', 'Address1_City', 'city');
        _addRow('State', 'Address1_StateOrProvince', 'state');
        _addRow('ZIP', 'Address1_PostalCode', 'zip');
        _addRow('Country', 'Address1_Country', 'country');

        if (app == 'CC') {
            _addRow('LinkedIn', 'blt_linkedin', 'linkedin');
            _addRow('Twitter', 'blt_twitter', 'twitter');
            _addRow('Facebook', 'blt_facebook', 'facebook');
            //_addRow('Skype', 'skype', 'skype');
            _addRow('Google+', 'blt_googleplus', 'googleplus');

            _addRow('So.cl', 'blt_socl', 'socl');
            _addRow('Blog', 'blt_blog', 'blog');
            _addRow('YoutTube', 'blt_youtube', 'youtube');
            _addRow('Xing', 'blt_xing', 'xing');
            _addRow('Quora', 'blt_quora', 'quora');

            _addRow('SlideShare', 'blt_slideshare', 'slideshare');
            _addRow('Reddit', 'blt_reddit', 'reddit');
            _addRow('StumbleUpon', 'blt_stumbleupon', 'stumbleupon');
            _addRow('Digg', 'blt_digg', 'digg');
            _addRow('Pinterest', 'blt_pinterest', 'pinterest');


        }


        if (!haschanges) {
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'><td colspan='5' style='text-align: center;'>No changes</td></tr>");
        }

        return rows;
    }

    this.convertToDate = function (input) {

        if (typeof input == 'undefined' || input == null || input === false) return null;



        if (!input.getMonth) { // not a date

            var date = null;

            if (typeof input == "number")
                date = new Date(input);
            else if (typeof input == "object" && parseInt(input.toString(), 10) > 0)
                date = new Date(parseInt(input.toString()));
            else if (typeof input == "string" && input.substring(0, 6) == '/Date(')
                date = new Date(parseInt(input.substring(6), 10))

            return date;
        }

        return input;

    }

    this.formatDateDiffText = function (input) {

        var lib = Broadlook.Library;
        var datetext = '';

        try {

            var date = lib.convertToDate(input);

            if (typeof date == 'undefined' || date == null || date === false) return '';

            if (!date.getMonth) { // not a date

                if (typeof date == "number")
                    date = new Date(date);
                else if (typeof date == "object" && parseInt(date.toString(), 10) > 0)
                    date = new Date(parseInt(date.toString()));
                else if (typeof date == "string" && date.substring(0, 6) == '/Date(')
                    date = new Date(parseInt(date.substring(6), 10))
                    //new Date( new Number( date.substring(6, 19)) )
                else
                    return '';
            }

            var now = new Date();

            var days = lib.days_between(now, date);

            if (days == 0)
                datetext = 'Today';
            else if (days == 1)
                datetext = 'Yesterday';
            else
                datetext = days + ' days ago';

        } catch (e) {
            lib.showError(e.Message);
        }

        return datetext;
    }


    this.addRow3 = function () {


    }

    this.mergeExecute = function (convertParams) {

        var lib = Broadlook.Library;

        var merges = convertParams.merges;

        if (lib.z(merges)) return;

        /*for (i = 0; i < merges.length; i++) {
            
            var id = merges[i].id;
            var name = merges[i].name;
            var changes =  merges[i].changes;

            if (convertParams.target == 'lead')
                lib.updateRecord("Lead", id, changes, 
                    function() { lib.addFinishResult(convertParams, 'Updated', id, name); }
                );
            else if (convertParams.target == 'contact')
                lib.updateRecord("Contact", id, changes, 
                    function() { lib.addFinishResult(convertParams, 'Updated', id, name);}
                );

        }/*/

        var idx = merges.length;
        while (idx--)
            (function (idx) {
                var id = merges[idx].id;
                var name = merges[idx].name;
                var changes = merges[idx].changes;

                var callback = function () { lib.addFinishResult(convertParams, 'Updated', id, name); };

                if (convertParams.target == 'lead')
                    lib.updateRecord("Lead", id, changes, callback);
                else if (convertParams.target == 'contact')
                    lib.updateRecord("Contact", id, changes, callback);

            })(idx);



    }



    this.executeDialog = function (convertParams) {

        var lib = Broadlook.Library;

        lib.$("#dialog-progress").hide();

        var ss = [];
        ss.push('Confirm all changes to CRM data.<ul>');

        if (convertParams.convert2newids) {

            var accountActionLabel = '';

            if (convertParams.target == 'contact') {
                if (convertParams.selectedAccountId == 'none') accountActionLabel = ' (without account)';
                else if (convertParams.selectedAccountId == 'new') accountActionLabel = ' and create new account';
                else accountActionLabel = ' and add to account ' + convertParams.selectedAccountName + '';
            }

            for (var i = 0; i < convertParams.gridrows.length; i++) {
                var gridrow = convertParams.gridrows[i];
                var id = lib.getGridValue(gridrow, convertParams.app, 'guid');

                if (convertParams.convert2newids.indexOf(id) < 0) continue;

                var name = lib.getGridValue(gridrow, convertParams.app, 'name');
                //lib.nz(gridrow.name) ? gridrow.name : gridrow['blt_fullname'];

                ss.push('<li>Convert ' + name + ' to new ' + convertParams.target + accountActionLabel + '</li>');
            }
        }

        if (convertParams.merges) {


            for (i = 0; i < convertParams.merges.length; i++) {

                ss.push('<li>Update ' + convertParams.target + ' ' + convertParams.merges[i].name + '<ul>');

                for (j = 0; j < convertParams.merges[i].changes.length; j++) {
                    //if(j > 0) ss.push(', ');
                    ss.push('<li>' + lib.getFieldLabel(convertParams.target, convertParams.merges[i].changes[j].fieldname) + ':  ' + convertParams.merges[i].changes[j].value + '</li>');
                }

                ss.push('</ul></li>');

            }

        }

        ss.push('</ul>');
        lib.$("#executeconvertdlg-prompt", "#executeconvertdlg").html(ss.join(''));

        lib.setDialogSize(convertParams);

        lib.$("#executeconvertdlg").dialog({
            title: 'Confirmation',
            width: convertParams.dialog.width,
            height: convertParams.dialog.height,
            position: [convertParams.dialog.left, convertParams.dialog.top],
            modal: true,
            buttons: {
                "Back": function () {
                    lib.$(this).dialog("close");
                    lib.goBack(convertParams);
                },
                "Execute": function () {

                    convertParams.actionTotal = 0;
                    convertParams.actionDone = 0;

                    if (convertParams.convert2newids) convertParams.actionTotal += convertParams.convert2newids.length;
                    if (convertParams.merges) convertParams.actionTotal += convertParams.merges.length;

                    lib.$(this).dialog("close");
                    lib.finishDialog(convertParams);

                    //assign?
                    if (convertParams.convert2newids) {

                        if (convertParams.assignToUser)
                            if (convertParams.source == Broadlook.Metadata.Entities.CaptureContact.Name)
                                lib.assignCaptureContacts(convertParams.convert2newids.join(';'), convertParams.assignToUser);


                        if (convertParams.target == "lead") lib.convertToNewCrmLead(convertParams);
                        else if (convertParams.target == "contact") lib.convertToNewCrmContact(convertParams);

                    }

                    if (convertParams.merges)
                        lib.mergeExecute(convertParams);
                },
                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }); //.width(570).height(170);


    }

    this.addFinishResult = function (convertParams, operation, entityId, label, actionsCompleted) {

        //return;
        if (!actionsCompleted) actionsCompleted = 1;

        convertParams.actionDone += actionsCompleted;

        var lib = Broadlook.Library;

        label = label || '';
        var link = lib.formatTextLink(entityId, label, convertParams.target);
        if (lib.z(link)) link = label;

        var ss = [];
        ss.push(lib.$("#executeconvertdlg-prompt", "#executeconvertdlg").html());
        // + convertParams.actionDone + ' - '
        ss.push('<div style="margin-left: 5em;">' + operation + ' ' + convertParams.target + ' ' + link + '</div>');

        if (convertParams.actionTotal <= convertParams.actionDone) {

            lib.$("#dialog-progress").hide();

            ss.push('Completed.');

            lib.$("#executeconvertdlg").dialog(
                {
                    buttons: {
                        "Close":
                            function () {
                                lib.$(this).dialog("close");

                                if (Broadlook.ProfilerCompany && Broadlook.ProfilerCompany.company && Broadlook.ProfilerCompany.company.result_xml)
                                    Broadlook.ProfilerCompany.loadLeadsFromBLXML(Broadlook.ProfilerCompany.company.result_xml);
                                else if (Broadlook.ContactCapture)
                                    Broadlook.ContactCapture.loadGrid();

                            }
                    }

                }
            );
        }

        lib.$("#executeconvertdlg-prompt", "#executeconvertdlg").html(ss.join(''));

    }

    this.finishDialog = function (convertParams) {

        var lib = Broadlook.Library;

        var ss = [];
        ss.push('Total steps: ' + convertParams.actionTotal + '<br />');
        ss.push('Progress:');
        lib.$("#dialog-progress").show();
        lib.$("#executeconvertdlg-prompt", "#executeconvertdlg").html(ss.join(''));

        lib.setDialogSize(convertParams);

        lib.$("#executeconvertdlg").dialog({
            title: 'Progress',
            width: convertParams.dialog.width,
            height: convertParams.dialog.height,
            position: [convertParams.dialog.left, convertParams.dialog.top],
            modal: true,
            buttons: {
                /*"Close": function () {
                    lib.$(this).dialog("close");
                    Broadlook.ProfilerCompany.loadLeadsFromBLXML(Broadlook.ProfilerCompany.company.result_xml);
                }*/
            }

        }); //.width(570).height(170);


    }


    /******************************************************************************************

    Generic (platform-independent) code

    ******************************************************************************************/

    // checks that the object is not null and not empty
    this.nz = function (o) {
        if (typeof (o) == 'undefined' || o == null || String(o) == '') return false;
        return true;
    }

    // checks that the object is null or empty
    this.z = function (o) {
        return !Broadlook.Library.nz(o);
    }

    this.validateUrl = function (url) {

        var v = new RegExp();
        v.compile("[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
        return v.test(url);

    }

    this.cleanMessages = function () {
        var lib = Broadlook.Library;
        lib.$("#status").html('');
    }


    //Function to display information on the HTML page.
    this.showMessage = function (message, classname, icon) {

        var lib = Broadlook.Library;

        if (message == null) message = '';
        var dvMessage = document.createElement("div");
        dvMessage.innerHTML = ("" + message).replace(/</g, '&lt;');
        if (lib.z(icon)) icon = '<span style="margin-right: 0.3em; float: left;" class="ui-icon ui-icon-info"></span>';
        if (lib.z(classname)) classname = "ui-state-info ui-corner-all";
        if (lib.nz(icon)) lib.$(dvMessage).append(icon);

        var placeholder = document.getElementById("status");
        if (placeholder) {
            placeholder.appendChild(dvMessage);
            if (!lib.$("#status").hasClass("ui-widget")) lib.$("#status").addClass("ui-widget");
            if (lib.nz(classname)) lib.$(dvMessage).addClass(classname);
        }
    }

    this.showError = function (message) {

        try { console.log('ERROR: ' + message); } catch (e) { }

        Broadlook.Library.showMessage(message, "ui-state-error ui-corner-all", '<span style="margin-right: 0.3em; float: left;" class="ui-icon ui-icon-alert"></span>');

    }

    //Function to handle any http errors
    this.errorHandler = function (XmlHttpRequest) {

        try { console.log('ErrorHandler'); console.log(XmlHttpRequest); } catch (e) { }

        var msg = '';

        try {
            msg = JSON.parse(XmlHttpRequest.responseText).error.message.value;
        } catch (err) {
            try { console.log('ErrorHandler-JSON Error'); console.log(err); } catch (e) { }

            if (XmlHttpRequest.responseText)
                msg = XmlHttpRequest.responseText;
            else if (XmlHttpRequest.message)
                msg = XmlHttpRequest.message;
            else
                msg = XmlHttpRequest + "";
        }

        if (XmlHttpRequest.status)
            Broadlook.Library.showError(XmlHttpRequest.status + ": " + XmlHttpRequest.statusText + ": " + msg);
        else
            Broadlook.Library.showError(msg);

        return msg;

    }

    this.formatRadio = function (groupname, value, text, defaultvalue) {
        if (defaultvalue == null) defaultvalue = '';

        var selected = '';
        if (value.toLowerCase() === defaultvalue.toLowerCase()) selected = ' checked ';

        var id = groupname + "_" + value;
        id = id.replace(' ', '_');

        return "<input type='radio' id='" + id + "' name='" + groupname + "' value='" + value + "' " + selected + " /><label for='" + id + "'>" + text + "</label>";
    }

    this.formatTextLink = function (id, name, entity) {

        if (typeof (id) == 'undefined' || id == null) return '';

        var n = name;
        if (n == null || n.length == 0) n = '...';

        var link = '';

        if (typeof (entity) == 'undefined' || entity == null)
            link = id;
        else
            link = Broadlook.Library.createLink(entity, id);

        return "<a target='_blank' href='" + link + "'>" + n + "</a>";
    }

    this.formatConnectionLink = function (id, name, entity, showlabel, hideimage) {

        if (typeof (id) == 'undefined' || id == null) return '';

        var n = name;
        if (n == null || n.length == 0) n = '...';

        var link = Broadlook.Library.createLink(entity, id);

        var label = '';
        if (showlabel)
            label = n;

        var res = [];

        res.push("<a target='_blank' href='" + link + "'>");

        if (!hideimage) {
            res.push("<img src='Images/crm" + entity + ".gif' alt='" + n + "' title='" + n + "' class='connection-image'>");
            if (label != '')
                res.push(" ");
        }

        if (label != '')
            res.push("<span>" + label + "</span>");

        res.push("</a>");

        return res.join('');
    }

    this.addAccountRow = function (s, radio, link) {
        s.push("<div><span class='lookup-res-name'>");
        s.push(radio);
        s.push("</span>&nbsp;&nbsp;<span class='lookup-res-link'>");
        s.push(link);
        s.push("</span></div>");
    }

    this.addAccountDefaults = function (defvalue) {

        var lib = Broadlook.Library;

        var s0 = [];
        s0.push("<div>");

        var radio1 = lib.formatRadio("account", "new", "Create new account", defvalue);
        lib.addAccountRow(s0, radio1, "");

        var radio2 = lib.formatRadio("account", "none", "Create contacts without account", defvalue);
        lib.addAccountRow(s0, radio2, "");

        s0.push("</div>");

        lib.$("#lookupres").html(s0.join(''));
    }

    /******************************************************************************************

    Common 

    ******************************************************************************************/

    this.daysInFebruary = function (year) {
        // February has 29 days in any year evenly divisible by four, 
        // EXCEPT for centurial years which are not also divisible by 400. 
        return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
    }

    this.pause = function (ms) {
        ms += new Date().getTime();
        while (new Date() < ms) { }
    }


    this.pause2 = function (ms, callback) {

        var seconds = ms / 1000,
            second = 0,
            interval;

        interval = setInterval(function () {

            if (second >= seconds) {

                clearInterval(interval);

                if (callback != null)
                    callback();
            }

            second++;
        }, 1000);
    }

    this.addChange = function (list, original, current, fieldname) {

        var a = current[fieldname];
        var b = original[fieldname];

        if (!a) a = '';
        if (!b) b = '';

        if (a != b)
            list.push({ fieldname: fieldname, value: a });

    }

    this.addRow = function (row, crmrecord, profilerrecord, label, crmproperty, profilerproperty, n) {

        var lib = Broadlook.Library;

        var crmvalue = crmrecord[crmproperty];
        var profilervalue = lib.stripTags(profilerrecord[profilerproperty]);

        if (typeof (crmvalue) == 'undefined' || crmvalue == null) crmvalue = '';

        if (lib.z(profilervalue)) return false;
        if (crmvalue == profilervalue) return false;

        n.value++;

        lib.$('#merge-row-fieldlabel', row).text(label);
        lib.$('#merge-row-fieldname', row).val(crmproperty);

        lib.$('#merge-row-label1', row).text(crmvalue);
        lib.$('#merge-row-label2', row).text(profilervalue);

        lib.$('#merge-row-radio1', row).attr("name", "merge-row-" + n.value + "-radio-" + profilerproperty);
        lib.$('#merge-row-radio2', row).attr("name", "merge-row-" + n.value + "-radio-" + profilerproperty);

        lib.$('#merge-row-radio1', row).attr("id", "merge-row-" + n.value + "-radio1-" + profilerproperty);
        lib.$('#merge-row-radio2', row).attr("id", "merge-row-" + n.value + "-radio2-" + profilerproperty).attr("checked", "checked");;

        lib.$('#merge-row-label1', row).attr("for", "merge-row-" + n.value + "-radio1-" + profilerproperty);
        lib.$('#merge-row-label2', row).attr("for", "merge-row-" + n.value + "-radio2-" + profilerproperty);

        return true;

    }

    this.addRow2 = function (row, crmvalue, broadlookvalue, label, crmproperty, broadlookproperty, n) {

        var lib = Broadlook.Library;

        //var crmvalue = crmrecord[crmproperty];
        //var profilervalue = lib.stripTags(profilerrecord[profilerproperty]);

        if (typeof (crmvalue) == 'undefined' || crmvalue == null) crmvalue = '';

        if (lib.z(broadlookvalue)) return false;
        if (crmvalue == broadlookvalue) return false;

        n.value++;

        lib.$('#merge-row-fieldlabel', row).text(label);
        lib.$('#merge-row-fieldname', row).val(crmproperty);
        lib.$('#merge-row-value2', row).val(broadlookvalue);

        lib.$('#merge-row-label1', row).text(crmvalue);
        lib.$('#merge-row-label2', row).text(broadlookvalue);

        lib.$('#merge-row-radio1', row).attr("name", "merge-row-" + n.value + "-radio-" + broadlookproperty);
        lib.$('#merge-row-radio2', row).attr("name", "merge-row-" + n.value + "-radio-" + broadlookproperty);

        lib.$('#merge-row-radio1', row).attr("id", "merge-row-" + n.value + "-radio1-" + broadlookproperty);
        lib.$('#merge-row-radio2', row).attr("id", "merge-row-" + n.value + "-radio2-" + broadlookproperty).attr("checked", "checked");

        lib.$('#merge-row-label1', row).attr("for", "merge-row-" + n.value + "-radio1-" + broadlookproperty);
        lib.$('#merge-row-label2', row).attr("for", "merge-row-" + n.value + "-radio2-" + broadlookproperty);

        //lib.$('#merge-row-value1', row).attr("id", "merge-row-" + n.value + "-value1");
        //lib.$('#merge-row-value2', row).attr("id", "merge-row-" + n.value + "-value2");

        return true;

    }


    this.setDialogSize = function (convertParams) {

        if (!convertParams) convertParams = {};
        if (convertParams.dialog) return; // already set

        var lib = Broadlook.Library;

        if (convertParams.source == "cc") {

            var p = lib.$("#myGrid");

            convertParams.dialog = {
                /*left: p.position().left,
                top: p.position().top,
                width: p.width() - 4,
                height: p.height() */

                left: null,
                top: null,
                width: p.width() - 4,
                height: 400
            };

            if (convertParams.dialog.width > 900) convertParams.dialog.width = 900;
        }
        else {

            convertParams.dialog = {
                left: null,
                top: null,
                width: 600,
                height: 200
            };

        }


    }
    //var ___x = 1;

}).apply(Broadlook.Library);

/*
(function ($) {
    $.widget("ui.combobox", {
        _create: function () {
            var self = this,
					select = this.element.hide(),
					selected = select.children(":selected"),
					value = selected.val() ? selected.text() : "";
            var input = this.input = $("<input>")
					.insertAfter(select)
					.val(value)
					.autocomplete({
					    delay: 0,
					    minLength: 0,
					    source: function (request, response) {
					        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
					        response(select.children("option").map(function () {
					            var text = $(this).text();
					            if (this.value && (!request.term || matcher.test(text)))
					                return {
					                    label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>"),
					                    value: text,
					                    option: this
					                };
					        }));
					    },
					    select: function (event, ui) {
					        ui.item.option.selected = true;
					        self._trigger("selected", event, {
					            item: ui.item.option
					        });
					    },
					    change: function (event, ui) {
					        if (!ui.item) {
					            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
									valid = false;
					            select.children("option").each(function () {
					                if ($(this).text().match(matcher)) {
					                    this.selected = valid = true;
					                    return false;
					                }
					            });
					            if (!valid) {
					                // remove invalid value, as it didn't match anything
					                $(this).val("");
					                select.val("");
					                input.data("autocomplete").term = "";
					                return false;
					            }
					        }
					    }
					})
					.addClass("ui-widget ui-widget-content ui-corner-left");

            input.data("autocomplete")._renderItem = function (ul, item) {
                return $("<li></li>")
						.data("item.autocomplete", item)
						.append("<a>" + item.label + "</a>")
						.appendTo(ul);
            };

            this.button = $("<button type='button'>&nbsp;</button>")
					.attr("tabIndex", -1)
					.attr("title", "Show All Items")
					.insertAfter(input)
					.button({
					    icons: {
					        primary: "ui-icon-triangle-1-s"
					    },
					    text: false
					})
					.removeClass("ui-corner-all")
					.addClass("ui-corner-right ui-button-icon")
					.click(function () {
					    // close if already visible
					    if (input.autocomplete("widget").is(":visible")) {
					        input.autocomplete("close");
					        return;
					    }

					    // work around a bug (likely same cause as #5265)
					    $(this).blur();

					    // pass empty string as value to search for, displaying all results
					    input.autocomplete("search", "");
					    input.focus();
					});
        },

        destroy: function () {
            this.input.remove();
            this.button.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
*/