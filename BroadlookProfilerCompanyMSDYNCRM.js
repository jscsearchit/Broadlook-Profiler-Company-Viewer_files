if (typeof (Broadlook) == "undefined") { Broadlook = { __namespace: true }; }
Broadlook.ProfilerCompany = Broadlook.ProfilerCompany || { __namespace: true };

(function () 
{

    // redefined properties
    this.gridMinRows = 5; 
    this.gridMaxRows = 50; 


    this.init = function () {
        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;
               
        //alert("Profile Company Init");
        self.init0();
        //alert("Profile Company Init Base Complete");
        self.companyId = lib.getCompanyId();
        if (lib.entityTypeName === "blt_profilercompany") {
            lib.$("#companyurl").hide();
            lib.$("#companyname").hide();
        }

        lib.getLicense("CRM Profiler", lib.applyLicense);
        //alert("Profile Company Init Pre Load Data");

        self.loadData();
        //alert("Profile Company Init Complete");
    }




    this.profileCompany = function () {

        parent.callOnDemandWF_ProfileAccount(null, null);

        /*var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        lib.cleanMessages();
                
        if(lib.demo || !lib.getXrmPage) {
            lib.showError('Cannot execute a workflow outside of CRM');
            return;
        }

        var xrmPage = lib.getXrmPage();

        try {

            var workflowId = null;
            var entityTypeCode = null;
            var entityId = null;

            if (self.companyId) { // company was created already
                workflowId = Broadlook.Metadata.Workflows.ProfileProfilerCompany;
                entityTypeCode = Broadlook.Metadata.Entities.ProfilerCompany.EntityTypeCode;
                entityId = self.companyId;
            }
            else if (lib.entityId && lib.entityTypeName)  { 
                        
                if(lib.entityTypeName == 'account') { // account form  - no company yet created
                    workflowId = Broadlook.Metadata.Workflows.ProfileAccount;
                    entityTypeCode = Broadlook.Metadata.Entities.Account.EntityTypeCode;
                }
                else if(lib.entityTypeName == 'lead') { // lead form - no company yet created
                    workflowId = Broadlook.Metadata.Workflows.ProfileLead;
                    entityTypeCode = Broadlook.Metadata.Entities.Lead.EntityTypeCode;
                }
                entityId = lib.entityId;
            }

            if(workflowId) {
                var callback = function(dialogResult) { if(dialogResult) self.setWaitingMode(); }
                lib.callOnDemandWF(workflowId, entityId, entityTypeCode, callback);
            } else {
                lib.showError('Workflow is not set up for this entity');
                return;
            }

        }
        catch (error) { 
            lib.showError(error.message);
        }*/
               
                
    }


            
    this.loadData = function (usecache) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        if(!lib.demo)
            if (lib.z(self.companyId)) {
                self.resizeGrid();
                self.setNewMode();
                return;
            }
                
        self.beginDataLoad('Loading...');

        // reset filter
        lib.$("#filter-select").val('all');

        self.contacts = [];
        self.contacts0 = [];

        if (lib.demo) {
            self.loadDemoCompany();
            return;
            }

        lib.retrieveRecord("blt_profilercompany", self.companyId, self.loadCompany); 

    }


    this.loadCompany = function (record) {

        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;

        if (lib.z(record) || record === false) {
            self.endDataLoad();
            return;
        }

        var company = {
            id:                         record.blt_profilercompanyId,
            //completedon:                record.blt_completedon,
            website:                    record.blt_Url,
            companyname:                record.blt_name,
            phone:                      record.blt_telephone,
            parentaccountid:            null,
            parentaccountname:          '',
            error:                      record.blt_Error,
            address_line1:              record.blt_address_line1,
            address_line2:              record.blt_address_line2,
            address_city:               record.blt_address_city,
            address_stateorprovince:    record.blt_address_stateorprovince,
            address_postalcode:         record.blt_address_postalcode,
            industry:                   record.blt_Industry,
            revenue:                    record.blt_Revenue,
            employees:                  record.blt_Employees,
            extra:                      record.extra, // venues
            result_xml:                 record.blt_result_xml,
            progress_xml:               record.blt_progress_xml,
            statuscode:                 record.statuscode.Value,
            status:                     lib.getStatusName(record.statuscode.Value, "blt_profilercompany"),
            siccode:                    record.blt_SIC,
            keyhash:                    ''
        };

        if(lib.nz(record.blt_Options)){
            company.keyhash = record.blt_Options.split(';')[0];
        }

        try {
            if(record.blt_completedon instanceof Date)
                company.completedon = record.blt_completedon;                
            else
                company.completedon = new Date(parseInt(record.blt_completedon.substr(6)));
        }
        catch(err) {
        
        }

        if (lib.nz(record.blt_parentaccountid) && lib.nz(record.blt_parentaccountid.Id)) {
            company.parentaccountid =   record.blt_parentaccountid.Id;
            company.parentaccountname = record.blt_parentaccountid.Name;
        }

        // loads company from CRM record and attempts to load leads from Result XML field
        var leadsLoaded = self.loadCompanyAndLeads(company);

        
        // old way: load Profiler Lead entities
        if(leadsLoaded) 
            self.leadStorageType = 'blob';
        else {

            self.leadStorageType = 'entities';

            var leadUri = '';

            if (lib.nz(record.blt_blt_profilercompany_blt_profilerlead)) {
                leadUri = record.blt_blt_profilercompany_blt_profilerlead.__deferred.uri;
                leadUri = lib.appendLoadLeadsUri(leadUri);
                lib.retrieveRecordsWithPath(leadUri, self.loadLeads);
            }
        }
    }


    this.loadLeads = function (records) {

        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;

        if (typeof (records) === "undefined" || records === null || !records) {
            self.endDataLoad();
            return;
        }

        if (!self.resized) {
            self.resizeGrid();
            self.resized = true;
        }

        var jj = records.results.length;
        while(jj--)
            self.loadLead(records.results[jj], jj);
       

        var nextUri = records.__next;

        if (typeof (nextUri) != 'undefined') {
            lib.$("#loading").show();
            lib.retrieveRecordsWithPath(nextUri, self.loadLeads);
        }
        else {
            self.endDataLoad();
        }

        self.resizeGrid();
    }

    
    this.loadLead = function (record, id) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        if (typeof (record) === "undefined" || record === null) return;

        var mydata =

            {
                //id: record.blt_profilerleadId,
                guid: record.blt_profilerleadId,
                sources: record.blt_sourcecodes,
                status: lib.getStatusName(record.statuscode.Value, "blt_profilerlead"),
                score: record.blt_Score,
                name: record.blt_fullname,
                firstname: record.blt_FirstName,
                middlename: record.blt_MiddleName,
                lastname: record.blt_LastName,
                title: record.blt_jobtitle,
                email: record.blt_Email,
                autofilledemail: record.blt_AutofilledEmail,
                phone: record.blt_telephone1,
                autofilledphone: record.blt_AutofilledPhone,
                phone2: record.blt_telephone2,
                city: record.blt_address1_city,
                state: record.blt_address1_stateorprovince,
                contextcompany: record.blt_companyname,
                bio: record.blt_Bio,
                context: escape(record.blt_context),
                invdate: record.ModifiedOn,
                crmleadid: record.blt_crmleadid.Id,
                crmleadname: record.blt_crmleadid.Name,
                crmaccountid: record.blt_crmaccountid.Id,
                crmaccountname: record.blt_crmaccountid.Name,
                crmcontactid: record.blt_crmcontactid.Id,
                crmcontactname: record.blt_crmcontactid.Name,
                connections: ""
            };
               

        mydata = self.addLeadRecord(mydata, record.blt_profilerleadId);

        self.contacts.push(mydata);
        self.contacts0.push(mydata);
        
        //self.cachedRecords.push(record);
        //lib.$("#grid").jqGrid('addRowData', mydata.guid, mydata);
    }
    

    this.loadDemoCompany = function () {
        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        lib.$.get(
            "BroadlookProfilerDemoData.htm", //?ts="+(new Date).getTime(), 
            function(data) {

                var record = new Object;
                record.blt_profilercompanyId = '1';
                record.blt_completedon = new Date;
                record.blt_Url= 'http://www.broadlook.com/';
                record.blt_name = 'Broadlook';
                record.blt_telephone = '262-754-8080';
                record.blt_Error = '';
                record.blt_address_line1 = '21140 Capitol Dr';
                record.blt_address_line2 = 'Ste 7';
                record.blt_address_city = 'Pewaukee'
                record.blt_address_stateorprovince= 'WI';
                record.blt_address_postalcode = '53072';
                record.blt_Industry = 'Software';
                record.blt_Revenue = '10M';
                record.blt_Employees = '20-50';
                record.extra = null; // venues
                record.blt_result_xml = data;
                record.blt_progress_xml = "&lt;PROGRESS&gt;&lt;SEARCH&gt;&lt;SPEED&gt;17.6kb/s&lt;/SPEED&gt;&lt;TASKS_QUEUED&gt;1&lt;/TASKS_QUEUED&gt;&lt;TASKS_EXTRACTED&gt;0&lt;/TASKS_EXTRACTED&gt;&lt;SIZE&gt;289k&lt;/SIZE&gt;&lt;/PROGRESS&gt;";
                record.statuscode = new Object;
                record.statuscode.Value = 
                //1; // new
                //858880002; // loading
                858880003; // completed
                record.blt_options = '6A6CF9C1A1457AE2C5848A5C2E399B9B';
     
                record.blt_parentaccountid = new Object;
                record.blt_parentaccountid.Id = '2';
                record.blt_parentaccountid.Name = 'Broadlook Technologies, Inc';
     
                // loads company from CRM record and attempts to load leads from XML field
                self.loadCompany(record);
            }
        );
    }



//            this.editCompany = function () {

//                var lib = Broadlook.Library;

//                lib.$("#editdlg").dialog({
//                    title: 'Edit Company',
//                    width: 600,
//                    height: 300,
//                    modal: true,
//                    buttons: {
//                        "Save & Profile": function () {
//                            lib.$(this).dialog("close");
//                        },
//                        Cancel: function () {
//                            lib.$(this).dialog("close");
//                        }
//                    }

//                }).width(570).height(270); //give it a bit of padding

//            }


    var ___x = 1;

}).apply(Broadlook.ProfilerCompany);












Broadlook.Library = Broadlook.Library || { __namespace: true };

(function () 
{

    this.enrichParams = null;
    this.ODataPath = null;
    this.serverUrl = null;
    this.currentUserId = null;
    this.entityId = null;
    this.entityTypeName = null;
    this.entityTypeCode = null;


    this.init = function (app) {

        var lib = Broadlook.Library;
        
        lib.init0(); // shared initializer

        try {

            var context = GetGlobalContext();

            lib.serverUrl = context.getServerUrl();
            if (lib.serverUrl[lib.serverUrl.length - 1] != '/') lib.serverUrl += '/';

            lib.ODataPath = lib.serverUrl + "XRMServices/2011/OrganizationData.svc";
            lib.currentUserId = context.getUserId();

            var queryparams = context.getQueryStringParameters();

            lib.entityId = queryparams["id"];
            lib.entityTypeName = queryparams["typename"];
            lib.entityTypeCode = queryparams["etc"];
            if (lib.z(lib.entityTypeCode))
                lib.entityTypeCode = queryparams["typecode"];
            if (lib.z(lib.entityTypeCode))
                lib.entityTypeCode = queryparams["type"];


            if (lib.z(lib.entityTypeName))
                lib.entityTypeName = parent.window.Xrm.Page.data.entity.getEntityName();

            if (lib.z(lib.entityId))
                lib.entityId = parent.window.Xrm.Page.data.entity.getId();

            if (lib.z(lib.entityTypeCode)) {
                queryparams = parent.window.Xrm.Page.context.getQueryStringParameters();
                lib.entityTypeCode = queryparams["etc"];
                if (lib.z(lib.entityTypeCode))
                    lib.entityTypeCode = queryparams["typecode"];
                if (lib.z(lib.entityTypeCode))
                    lib.entityTypeCode = queryparams["type"];
            }

        }
        catch (error) {
            lib.demo = true;
            lib.serverUrl = 'https://broadlook1.crm.dynamics.com/';
            lib.ODataPath = lib.serverUrl + "XRMServices/2011/OrganizationData.svc";
            lib.currentUserId = "ID3";

        }

        if (!lib.demo)
            Broadlook.Metadata.init(app);
    }

  
    


    /******************************************************************************************

    Dialogs

    ******************************************************************************************/
    

    this.enrichAccountExecute = function (profilercompanyrecord) {

        var lib = Broadlook.Library;
        lib.cleanMessages();

        lib.enrichParams = new Object;
        lib.enrichParams.profilercompany = profilercompanyrecord;

        var accountid = lib.getDefaultAccountId();
        if (accountid == null) {
            lib.showError("No linked account.");
            return;
        }

        lib.retrieveRecord("Account", accountid, lib.enrichAccountCallback);


    }

    this.enrichAccountCallback = function (crmrecord) {

        var lib = Broadlook.Library;

        if (!crmrecord) {
            lib.showError("The account does not exist in CRM anymore or you have no access.");
            return;
        }

        // prepare data

        var crmidfield = 'AccountId';
        var rows = [];

        var first = lib.$("#merge-first-template", "#merge-dlg");
        rows.push("<tr>" + first.html() + "</tr>");

        var second = lib.$("#merge-second-template", "#merge-dlg");
        rows.push("<tr>" + second.html() + "</tr>");

        var s = '';
        var n = new Object;
        n.value = 0;
        n.group = 0;


        var profilerrecord = lib.enrichParams.profilercompany;

        rows.push(lib.addAccountRows(crmrecord, profilerrecord, 0).join(''));

        lib.$("#merge-table").html('');
        lib.$('<table></table>').append(rows.join('')).appendTo("#merge-table");


        lib.$('#merge-all-radio1, #merge-all-radio2', "#merge-table").click(function (event) {

            var group = event.target.id.slice(-1);

            if (group == 1) {
                lib.$("input[type='radio'][id*='radio1'][id*='person']", "#merge-table").click();
            }
            else {
                lib.$("input[type='radio'][id*='radio2'][id*='person']", "#merge-table").click();
            }

        });

        lib.$("input[type='radio'][id*='radio'][id*='person']", "#merge-table").click(function (event) {

            var id = lib.$(event.target).attr('id');
            var group = id.slice(id.indexOf('-group') + 6);
            var side = id.slice(id.indexOf('-radio') + 6, id.indexOf('-group'));

            var rows = lib.$("tr[id*='group" + group + "']", "#merge-table");

            lib.$("input[type='radio'][id*='radio" + side + "']", rows).click();

        });


        // display dialog
        var nextbtnlabel = "Execute";

        lib.$("#merge-dlg").dialog({
            title: 'Enrich account data',
            width: 600,
            height: 200,
            modal: true,
            buttons: {

                "Execute": function () {
                    // update fields

                    var rows = lib.$("TR", "#merge-table")
                    var merges = [];
                    var merge = null;

                    for (var i = 0; i < rows.length; i++) {

                        var row = rows[i];
                        var headerrowindicator = lib.$("#merge-row-id", row).val(); // -name

                        if (lib.nz(headerrowindicator)) {
                            //header row
                            if (merge != null) merges.push(merge);
                            merge = new Object;
                            merge.id = headerrowindicator;
                            merge.changes = [];

                        }
                        else {
                            //data row
                            var selection = lib.$("#merge-row-radio2:checked", row).val();
                            if (selection === "1") {
                                var fieldname = lib.$("#merge-row-fieldname", row).val();
                                var newvalue = lib.$("#merge-row-label2", row).text();
                                var change = new Object;
                                change.fieldname = fieldname;
                                change.value = newvalue;
                                if (merge != null) merge.changes.push(change);
                            }
                        }

                    }

                    if (merge != null) merges.push(merge);


                    if (lib.nz(merges)) {
                        for (i = 0; i < merges.length; i++) {
                            lib.updateRecord("Account", merges[i].id, merges[i].changes, null);
                        }
                    }

                    // refresh account form if we are there
                    if(lib.entityTypeName == 'account'){
                        alert('Click OK to reload the page.');
                        setTimeout("window.parent.location.reload(true);", 2000); // 7 seconds is ideal
                    }
                        

                    lib.$(this).dialog("close");
                },
                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }).width(570).height(170);

    }




    this.addAccountRows = function (crmrecord, profilerrecord, n) {

        var lib = Broadlook.Library;

        var rows = [];
        var prefix = 'blt_';
        var name = profilerrecord['companyname']; //blt_name
        var crmid = crmrecord['AccountId'];

        var headertemplate = lib.$("#merge-header-template", "#merge-dlg");

        var header = headertemplate.clone();
        lib.$('#merge-header-profilerrecord', header).html(name);
        lib.$('#merge-header-crmrecord', header).html(lib.formatConnectionLink(crmid, crmrecord['Name'], "account", true));

        lib.$("#merge-person-radio1", header).attr('name', "merge-person-radio-group" + n.group);
        lib.$("#merge-person-radio2", header).attr('name', "merge-person-radio-group" + n.group);
        lib.$("#merge-person-radio1", header).attr('id', "merge-person-radio1-group" + n.group);
        lib.$("#merge-person-radio2", header).attr('id', "merge-person-radio2-group" + n.group);


        lib.$('#merge-row-id', header).val(crmid);

        rows.push("<tr>" + header.html() + "</tr>");

        var rowtemplate = lib.$("#merge-row-template", "#merge-dlg");
        var haschanges = false;
        var row;

        var _addRow = function (row, crmrecord, profilerrecord, label, crmproperty, profilerproperty, n) {

            var lib = Broadlook.Library;

            var crmvalue = crmrecord[crmproperty];
            var profilervalue = lib.stripTags(profilerrecord[profilerproperty]);

            if (typeof (crmvalue) == 'undefined') crmvalue = '';

            if (lib.z(profilervalue)) return false;
            if (crmvalue == profilervalue) return false;

            n.value++;

            lib.$('#merge-row-fieldlabel', row).text(label);
            lib.$('#merge-row-fieldname', row).val(crmproperty);

            lib.$('#merge-row-label1', row).text(crmvalue);
            lib.$('#merge-row-label2', row).text(profilervalue);

            lib.$('#merge-row-radio1', row).attr("name", "merge-row-" + n.value + "-radio-" + profilerproperty);
            lib.$('#merge-row-radio2', row).attr("name", "merge-row-" + n.value + "-radio-" + profilerproperty);

            return true;

        }


        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'Account Name', 'Name', 'companyname', n)) { //prefix + 'name'
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'Website', 'WebSiteURL', 'website', n)) { // prefix + 'Url'
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'Main Phone', 'Telephone1', 'phone', n)) { // prefix + 'telephone'
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }


        // SIC 
        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'SIC Code', 'SIC', 'siccode', n)) { //prefix + 'SIC'
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }


        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'Street 1', 'Address1_Line1', 'address_line1', n)) {//prefix + 'address_line1'
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'Street 2', 'Address1_Line2', 'address_line2', n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'City', 'Address1_City', 'address_city', n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'State/Province', 'Address1_StateOrProvince', 'address_stateorprovince', n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (_addRow(row, crmrecord, profilerrecord, 'ZIP/Postal Code', 'Address1_PostalCode',  'address_postalcode', n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        // industry (as text)
        //        row = rowtemplate.clone();
        //        if (lib.addRow(row, crmrecord, profilerrecord, 'Industry', 'crm_text_field_here',  'industry', n)) {
        //            haschanges = true;
        //            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        //        }

        // revenue (as text)
        //        row = rowtemplate.clone();
        //        if (lib.addRow(row, crmrecord, profilerrecord, 'Revenue', 'crm_text_field_here', 'revenue', n)) {
        //            haschanges = true;
        //            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        //        }

        // # of employees (as text)
        //        row = rowtemplate.clone();
        //        if (lib.addRow(row, crmrecord, profilerrecord, 'Number of Employees', 'crm_text_field_here', 'employees', n)) {
        //            haschanges = true;
        //            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        //        }

        // DUNS (obsolete) 
        //        row = rowtemplate.clone();
        //        if (lib.addRow(row, crmrecord, profilerrecord, 'D-U-N-S Number', 'crm_text_field_here', 'duns', n)) {
        //            haschanges = true;
        //            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        //        }


        if (!haschanges) {
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'><td colspan='5'>No changes</td></tr>");
        }

        return rows;
    }




    /*
    this.addRows = function (crmrecord, gridrecord, n, target) {

        var lib = Broadlook.Library;

        var rows = [];
        var prefix = '';
        var name = gridrecord['name']; //PR
        if (!name) {
            name = gridrecord['blt_fullname']; //CC
            prefix = 'blt_';
        }

        var crmid;

        if (target == 'lead') crmid = crmrecord['LeadId']; else crmid = crmrecord['ContactId'];

        var headertemplate = lib.$("#merge-header-template", "#merge-dlg");

        var header = headertemplate.clone();
        lib.$('#merge-header-profilerrecord', header).html(name);
        lib.$('#merge-header-crmrecord', header).html(lib.formatConnectionLink(crmid, crmrecord['FullName'], target, true));

        lib.$("#merge-person-radio1", header).attr('name', "merge-person-radio-group" + n.group);
        lib.$("#merge-person-radio2", header).attr('name', "merge-person-radio-group" + n.group);
        lib.$("#merge-person-radio1", header).attr('id', "merge-person-radio1-group" + n.group);
        lib.$("#merge-person-radio2", header).attr('id', "merge-person-radio2-group" + n.group);


        lib.$('#merge-row-id', header).val(crmid);

        rows.push("<tr>" + header.html() + "</tr>");

        var rowtemplate = lib.$("#merge-row-template", "#merge-dlg");
        var haschanges = false;
        var row;



        row = rowtemplate.clone();
        if (lib.addRow(row, crmrecord, gridrecord, 'First Name', 'FirstName', prefix + 'firstname', n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (lib.addRow(row, crmrecord, gridrecord, 'Middle Name', 'MiddleName', prefix + 'middlename', n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        if (lib.addRow(row, crmrecord, gridrecord, 'Last Name', 'LastName', prefix + 'lastname', n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        if (target == 'lead') {
            row = rowtemplate.clone();
            var fn = 'contextcompany';
            if (prefix != '') fn = 'blt_companyname';
            if (lib.addRow(row, crmrecord, gridrecord, 'Company Name', 'CompanyName', fn, n)) {
                rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
                haschanges = true;
            }
        }

        row = rowtemplate.clone();
        fn = 'title'; if (prefix != '') fn = 'blt_jobtitle';
        if (lib.addRow(row, crmrecord, gridrecord, 'Job Title', 'JobTitle', fn, n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        fn = 'phone'; if (prefix != '') fn = 'blt_telephone1';
        if (lib.addRow(row, crmrecord, gridrecord, 'Phone', 'Telephone1', fn, n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        fn = 'phone2'; if (prefix != '') fn = 'blt_telephone2';
        if (lib.addRow(row, crmrecord, gridrecord, 'Phone 2', 'Telephone2', fn, n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        row = rowtemplate.clone();
        fn = 'email'; if (prefix != '') fn = 'EmailAddress';
        if (lib.addRow(row, crmrecord, gridrecord, 'Email', 'EMailAddress1', fn, n)) {
            haschanges = true;
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'>" + row.html() + "</tr>");
        }

        if (!haschanges) {
            rows.push("<tr id='merge-row-" + n.value + "-group" + n.group + "'><td colspan='5' style='text-align: center'>No changes</td></tr>");
        }

        return rows;
    }
    */

    

    this.convertToNewCrmLead = function (convertParams) {

        var lib = Broadlook.Library;

        if (lib.z(convertParams.gridrows) || convertParams.gridrows.length == 0) {
            lib.showError("Nothing to convert");
            return;
        }

        // Direct update 
        if(convertParams.gridrows) {

            for (var i = 0; i < convertParams.gridrows.length; i++) {
                var gridrow = convertParams.gridrows[i];
                var id = lib.getGridValue( gridrow, convertParams.app, 'guid');

                if(convertParams.convert2newids.indexOf(id) < 0) continue;

                lib.createLead(gridrow, convertParams.company, lib.convertToNewCrmEntityCallback, convertParams)
            }
        }
        else 
            lib.showError("Error [Reference code: S057]");

    }


    this.convertToNewCrmContact = function (convertParams, callback) { 
        
        var lib = Broadlook.Library;

        var ids = convertParams.convert2newids;
        var source = convertParams.source;
        var acc = convertParams.selectedAccountId;
        var gridrow, id;

        if (lib.z(ids)) {
            lib.showError("Nothing to convert");
            return;
        }

        if (acc == 'none') { 
        
            // create contact w/o account
            if(convertParams.gridrows) {
                for (var i = 0; i < convertParams.gridrows.length; i++) {
                    gridrow = convertParams.gridrows[i];
                    id = lib.getGridValue( gridrow, convertParams.app, 'guid');

                    if(convertParams.convert2newids.indexOf(id) < 0) continue;
                    lib.createContact(gridrow, convertParams.company, null, lib.convertToNewCrmEntityCallback, convertParams);
                }
            }
            else lib.showError("Error [Reference code: S058]");

        }
        else if (acc == 'new') { 
        
            // create new account (blank)
            lib.createAccountRecord(Broadlook.ProfilerCompany.company, function (accountid) {

            if (!accountid) return;

                if(convertParams.gridrows) {
                    for (var i = 0; i < convertParams.gridrows.length; i++) {
                        gridrow = convertParams.gridrows[i];
                        id = lib.getGridValue( gridrow, convertParams.app, 'guid');

                        if(convertParams.convert2newids.indexOf(id) < 0) continue;
                        lib.createContact(gridrow, convertParams.company, accountid, lib.convertToNewCrmEntityCallback, convertParams)

                        // assign if needed
                        //lib.assignProfilerLeads(convertParams.assignIds.join(';'), convertParams.assignToUser);
                    }
                }
                else lib.showError("Error [Reference code: S058]");
            });

        }
        else {

            if(convertParams.gridrows) 
                for (var j = 0; j < convertParams.gridrows.length; j++) {
                    gridrow = convertParams.gridrows[j];
                    id = lib.getGridValue( gridrow, convertParams.app, 'guid');

                    if(convertParams.convert2newids.indexOf(id) < 0) continue;
                    lib.createContact(gridrow, convertParams.company, acc, lib.convertToNewCrmEntityCallback, convertParams)
                }
            else lib.showError("Error [Reference code: S058]");

        }
    }


    this.convertToNewCrmEntityCallback = function(newRecord, packedparams) {
    
        var lib = Broadlook.Library;

        // unpack parameters
        var gridRow = packedparams.gridrow;
        var convertParams = packedparams.callbackparam;

        if(!newRecord) {
            lib.addFinishResult(convertParams, "Failed to create", null, "record"); // Produces: "Failed to create lead record"
            return;
        }
        var id = newRecord.LeadId || newRecord.ContactId;


        // assign to new owner
        if(convertParams.assignToUser) {
            var entityTypeName = newRecord.LeadId ? "lead": "contact";
            lib.AssignRequest(convertParams.assignToUser, id, entityTypeName);
        }

        // update connections
        lib.connectXMLLeadToCRMEntity(newRecord, gridRow);

        // report progress
        
        lib.addFinishResult(convertParams, 'Created', id, newRecord.Subject || newRecord.FullName);
    
    }



    

    this.connectXMLLeadToCRMEntity = function(newCrmRecord, gridRow) {
        

        var lib = Broadlook.Library;
        var viewer = Broadlook.ProfilerCompany;
        

        if(newCrmRecord) {

            if(newCrmRecord.__metadata.type == "Microsoft.Crm.Sdk.Data.Services.Contact") {
            
                // re-score
                var score = Number(gridRow.score);
                if(score < 1000) score = score + 1000;

                var changes = [];
                changes.push({ fieldname: 'score', value: score});
                changes.push({ fieldname: 'crmcontactid', value: newCrmRecord.ContactId});
                changes.push({ fieldname: 'crmcontactname', value: newCrmRecord.FullName});

                // save 
                viewer.saveChangesInXMLLead(Broadlook.ProfilerCompany.company, gridRow, changes);

                lib.updateRecord("blt_profilercompany", Broadlook.ProfilerCompany.companyId, 
                    [ { fieldname: "blt_result_xml", value: Broadlook.ProfilerCompany.company.result_xml } ], 
                    function() { 
                        lib.$('#grid').trigger( 'reloadGrid' ); 
                    } );

                
            } else if(newCrmRecord.__metadata.type == "Microsoft.Crm.Sdk.Data.Services.Lead") {
            
                    // re-score
                var score = Number(gridRow.score);
                if(score < 1000) score = score + 1000;

                var changes = [];
                changes.push({ fieldname: 'score', value: score});
                changes.push({ fieldname: 'crmleadid', value: newCrmRecord.LeadId});
                changes.push({ fieldname: 'crmleadname', value: newCrmRecord.FullName});

                // save 
                viewer.saveChangesInXMLLead(Broadlook.ProfilerCompany.company, gridRow, changes);

                lib.updateRecord("blt_profilercompany", Broadlook.ProfilerCompany.companyId, 
                    [ { fieldname: "blt_result_xml", value: Broadlook.ProfilerCompany.company.result_xml } ],  
                    function() { 
                        lib.$('#grid').trigger( 'reloadGrid' ); 
                    });
                
            }

            
        
        }
        else {
        
            lib.showError('Failed to create new record');
        }
    
    }




   






    this.getDefaultAccountId = function () {
        var lib = Broadlook.Library;
        if (lib.demo) return "ID2";

        if (lib.entityTypeName == Broadlook.Metadata.Entities.ProfilerCompany.Name) 
            return Broadlook.ProfilerCompany.crmaccountId;
        else if (lib.entityTypeName == "account") {
            var xrmPage = lib.getXrmPage();
            if (xrmPage && xrmPage.data)
                return xrmPage.data.entity.getId();
        }

        return null;
    }




    this.getDefaultAccountName = function () {

        var lib = Broadlook.Library;

        if (lib.demo) return "Demo";

        var xrmPage = lib.getXrmPage();

        if (lib.entityTypeName == Broadlook.Metadata.Entities.ProfilerCompany.Name) {

            if (lib.nz(Broadlook.ProfilerCompany.crmaccountName))
                return Broadlook.ProfilerCompany.crmaccountName;
            else if (xrmPage && xrmPage.data)
                return xrmPage.data.entity.attributes.get('blt_name').getValue();
        }
        else if (lib.entityTypeName == "account") {
            if (xrmPage && xrmPage.data)
                return xrmPage.data.entity.attributes.get('name').getValue();
        }
        else if (lib.entityTypeName == "lead") {
            if (xrmPage && xrmPage.data)
                return xrmPage.data.entity.attributes.get('companyname').getValue();
        }
        else if (convertParams.companynames && convertParams.companynames.length > 0)
            return convertParams.companynames[0];


        return '';

    }




    



    /******************************************************************************************

    Profiler Lead

    ******************************************************************************************/


    // unfinished and untested
    this.createProfilerLead = function (firstName, middleName, lastName, jobTitle, email, phone1, phone2, parentCompanyId, callback) {

        var lib = Broadlook.Library;

        var record = new Object();
        record.blt_FirstName = firstName;
        record.blt_MiddleName = middleName;
        record.blt_LastName = lastName;
        record.blt_jobtitle = jobTitle;
        record.blt_Email = email;
        record.blt_telephone1 = phone1;
        record.blt_telephone2 = phone2;
        

        if (lib.nz(parentCompanyId)) {
            record.blt_companyid = new Object;
            record.blt_companyid.Id = parentCompanyId;
            record.blt_companyid.LogicalName = 'blt_profilercompany';
        }

        lib.createRecord(record, 'blt_profilerlead', callback);
    }





    this.connectProfilerLeadsToCrmAccount = function (Ids, accountid, callback) {

        if (typeof (Ids) == "undefined") {
            Broadlook.Library.showError("Missing parameter - Ids");
            if (typeof (callback) != 'undefined' && callback != null)
                callback(false);
            return;
        }

        if (typeof (accountid) == "undefined") {
            Broadlook.Library.showError("Missing parameter - accountid");
            if (typeof (callback) != 'undefined' && callback != null)
                callback(false);
            return;
        }

        var ids0 = Ids.split(';');
        var ids = [];
        for (var j = 0; j < ids0.length; j++) {
            var id0 = ids0[j];
            if (!Broadlook.Library.nz(id0)) continue;
            id0 = id0.replace('{', '').replace('}', '');
            ids.push(id0);
        }


        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];

            var req = new XMLHttpRequest();

            var changes = new Object();
            changes.blt_crmaccountid = new Object;
            changes.blt_crmaccountid.Id = accountid;
            changes.blt_crmaccountid.LogicalName = 'account';

            var path = Broadlook.Library.ODataPath + "/blt_profilerleadSet(guid'" + id + "')";
            req.open("POST", path, true);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("X-HTTP-Method", "MERGE");
            req.onreadystatechange = function () {
                Broadlook.Library.updateReqCallBack(this, callback, i >= (ids.length - 1));
            };
            req.send(JSON.stringify(changes));

        }
    }





    this.assignProfilerLeads = function (Ids, userid, callback) {

        var lib = Broadlook.Library;

        if (Broadlook.Library.demo) {
            if (typeof (callback) != 'undefined' && callback != null)
                callback(true);
            return;
        }

        if (typeof (Ids) == "undefined") {
            Broadlook.Library.showError("Missing parameter - Ids");
            if (typeof (callback) != 'undefined' && callback != null)
                callback(false);
            return;
        }

        if (typeof (userid) == "undefined") {
            Broadlook.Library.showError("Missing parameter - userid");
            if (typeof (callback) != 'undefined' && callback != null)
                callback(false);
            return;
        }

        var ids0 = Ids.split(';');
        var ids = [];
        for (var j = 0; j < ids0.length; j++) {
            var id0 = ids0[j];
            if (!Broadlook.Library.nz(id0)) continue;
            id0 = id0.replace('{', '').replace('}', '');
            ids.push(id0);
        }

        var target = "TargetOwnedblt_profilerlead";

        for (var i = 0; i < ids.length; i++) {
            var recordid = ids[i];

            lib.AssignRequest(userid, recordid, target);
                       
            if (i >= (ids.length - 1)) // last iteration
                if (typeof (callback) != 'undefined' && callback != null)
                    callback(res);
        }
    }





    this.deactivateProfilerLeads = function (Ids, callback) {

        if (typeof (Ids) == "undefined") {
            Broadlook.Library.showError("Missing paramter - Ids");
            callback(false);
            return;
        }


        var ids0 = Ids.split(';');
        var ids = [];
        for (var j = 0; j < ids0.length; j++) {
            var id0 = ids0[j];
            if (!Broadlook.Library.nz(id0)) continue;
            id0 = id0.replace('{', '').replace('}', '');
            ids.push(id0);
        }


        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];

            var requestMain = ""
            requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            requestMain += "  <s:Body>";
            requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            requestMain += "      <request i:type=\"b:SetStateRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
            requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            requestMain += "          <a:KeyValuePairOfstringanyType>";
            requestMain += "            <c:key>EntityMoniker</c:key>";
            requestMain += "            <c:value i:type=\"a:EntityReference\">";
            requestMain += "              <a:Id>" + id + "</a:Id>";
            requestMain += "              <a:LogicalName>" + Broadlook.Metadata.Entities.ProfilerLead.Name + "</a:LogicalName>";
            requestMain += "              <a:Name i:nil=\"true\" />";
            requestMain += "            </c:value>";
            requestMain += "          </a:KeyValuePairOfstringanyType>";
            requestMain += "          <a:KeyValuePairOfstringanyType>";
            requestMain += "            <c:key>State</c:key>";
            requestMain += "            <c:value i:type=\"a:OptionSetValue\">";
            requestMain += "              <a:Value>1</a:Value>";
            requestMain += "            </c:value>";
            requestMain += "          </a:KeyValuePairOfstringanyType>";
            requestMain += "          <a:KeyValuePairOfstringanyType>";
            requestMain += "            <c:key>Status</c:key>";
            requestMain += "            <c:value i:type=\"a:OptionSetValue\">";
            requestMain += "              <a:Value>2</a:Value>";
            requestMain += "            </c:value>";
            requestMain += "          </a:KeyValuePairOfstringanyType>";
            requestMain += "        </a:Parameters>";
            requestMain += "        <a:RequestId i:nil=\"true\" />";
            requestMain += "        <a:RequestName>SetState</a:RequestName>";
            requestMain += "      </request>";
            requestMain += "    </Execute>";
            requestMain += "  </s:Body>";
            requestMain += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", Broadlook.Library.serverUrl + "XRMServices/2011/Organization.svc/web", true) // + "/web"
            // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            var successCallback = null;
            var errorCallback = null;
            req.onreadystatechange = function () { Broadlook.Library.SetStateResponse(req, callback, i >= (ids.length - 1)); };
            req.send(requestMain);

        }
    }


    /******************************************************************************************

    Profiler Company

    ******************************************************************************************/


    this.createProfilerCompanyRecord = function (Name, Url, PlanId, callback) {

        var lib = Broadlook.Library;
        
        var record = new Object();

        record.blt_name = Name;
        record.blt_Url = Url;

        if (lib.nz(PlanId)) {
            record.blt_planid = new Object;
            record.blt_planid.Id = PlanId;
            record.blt_planid.LogicalName = 'blt_profilerplan';
        }

        lib.createRecord(record, 'blt_profilercompany', callback);
    }


    


    


    this.getStatusName = function (value, entity) {
        var s = "Unknown";
        if (entity == "blt_profilercompany") {
            if (value == 1) s = "New";
            else if (value == 2) s = "Inactive";
            else if (value == 858880000) s = "Requested";
            else if (value == 858880001) s = "Profiling";
            else if (value == 858880002) s = "Loading";
            else if (value == 858880003) s = "Completed";
            else if (value == 858880004) s = "Error";
        }
        else if (entity == "blt_profilerlead") {
            if (value == 1) s = "New";
            else if (value == 2) s = "Inactive";
            else if (value == 858880000) s = "Current";
            else if (value == 858880001) s = "Unverified";
        }
        return s;
    }


    this.getCompanyId = function () {

        var lib = Broadlook.Library;

        if(lib.demo || !lib.getXrmPage) return null;

        var xrmPage = lib.getXrmPage();

        try {
            if (lib.entityTypeName === "blt_profilercompany")
                return lib.entityId;
            else { // account or lead form in the dynamics crm
                    var lookupvalue = xrmPage.data.entity.attributes.get('blt_profilercompanyid').getValue();
                    if (lookupvalue != null) return lookupvalue[0].id;
            }
        }
        catch (error) { }
        return null;
    }


    this.getCompanyName = function () {

        var lib = Broadlook.Library;
        if(lib.demo || !lib.getXrmPage) return null;

        var xrmPage = lib.getXrmPage();
        try {
            if (lib.entityTypeName === "blt_profilercompany") 
                return xrmPage.data.entity.attributes.get('blt_name').getValue();
            else { // account or lead form
                var lookupvalue = xrmPage.data.entity.attributes.get('blt_profilercompanyid').getValue();
                if (lookupvalue != null) return lookupvalue[0].name;
            }
        }
        catch (error) { }
        return null;
    }


    this.getWebsite = function () {

        var lib = Broadlook.Library;
        if(lib.demo || !lib.getXrmPage) return 'broadlook.com';

        var xrmPage = lib.getXrmPage();
        try {
            if (lib.entityTypeName === "blt_profilercompany") 
                return xrmPage.data.entity.attributes.get('blt_url').getValue();
            else { // account or lead form
                 return xrmPage.data.entity.attributes.get('websiteurl').getValue();
            }
        }
        catch (error) { }
        return null;
    }


    this.appendLoadLeadsUri = function (uri) {

        var fields = [];

        fields.push('blt_profilerleadId');

        fields.push('blt_Score');
        fields.push('blt_sourcecodes');

        fields.push('blt_FirstName');
        fields.push('blt_MiddleName');
        fields.push('blt_LastName');
        fields.push('blt_fullname');

        fields.push('blt_jobtitle');
        fields.push('blt_companyname');

        fields.push('blt_Email');
        fields.push('blt_telephone1');
        fields.push('blt_telephone2');
        fields.push('blt_AutofilledEmail');
        fields.push('blt_AutofilledPhone');

        fields.push('blt_address1_city');
        fields.push('blt_address1_stateorprovince');

        fields.push('blt_crmaccountid');
        fields.push('blt_crmcontactid');
        fields.push('blt_crmleadid');

        fields.push('statuscode');

        fields.push('blt_context');
        fields.push('blt_Bio');

        if (uri.indexOf('?') == -1)
            uri += "?";

        if (uri.indexOf('$filter=') == -1)
            uri += "&$filter=statecode/Value eq 0";
        else
            if (uri.indexOf('statecode/Value eq 0') == -1)
                uri = uri.replace("$filter=", "$filter=statecode/Value eq 0 and ");

        if (uri.indexOf('$orderby=') == -1)
            uri += "&$orderby=blt_Score desc";


        if (uri.indexOf('$select=') == -1)
            uri += "&$select=" + fields.join(',');

        return uri;
    }

  


    var ___x = 1;

}).apply(Broadlook.Library);







Broadlook.Metadata = Broadlook.Metadata || {};

(function () {

    this.__initialized = false;
    this.__namespace = true;

    this.Workflows = {

        ConvertProfilerLeadToNewCrmLead: '{3D1E0721-5911-4A12-813A-7BC5BD62D1E5}',
        ConvertProfilerLeadToNewCrmContact: '{7A317D6C-1E22-41F8-993D-C7A7AB98443E}',
        ConvertProfilerLeadToNewCrmContactAndNewCrmAccount: '{49584b61-2fe8-45b7-953d-e800a8e827e5}',

        ConvertCaptureContactToNewCrmLead: '{35932436-B9BA-4A37-9BA1-7E707A380762}',
        ConvertCaptureContactToNewCrmContact: '{4ec12fea-4458-49c5-9426-1a9236641a05}',
        ConvertCaptureContactToNewCrmContactAndNewCrmAccount: '{77c2628b-7655-40a6-a27e-1552dceb1833}',

        ProfileProfilerCompany: '{23CAC504-6848-44E1-9D11-75188F41E1E6}', //'{46C22CC4-3B66-45BE-9A4E-70B21855C06D}', 
        ProfileAccount: '{2A15C6AD-D5E4-449C-A4C8-6D8DB7D34BF6}', //'{23CAC504-6848-44E1-9D11-75188F41E1E6}',
        ProfileLead: '{FE76F3AB-127F-4B44-A128-D55907FCEF00}', //'{23CAC504-6848-44E1-9D11-75188F41E1E6}',

        UpdateCrmContact: '{02d35286-e9f6-4e3f-b7a9-64453ecfda2a}',

        __namespace: true
    };

    /*this.Entities = {

        Account: {
            EntityTypeCode: '1',
            Name: "account"
        },
        Contact: {
            EntityTypeCode: '2',
            Name: "contact"
        },
        Lead: {
            EntityTypeCode: '2',
            Name: "lead"
        },


        ProfilerLead: {
            EntityTypeCode: '10006',
            Name: "blt_profilerlead"

        },

        ProfilerCompany: {
            EntityTypeCode: '10003',
            Name: "blt_profilercompany"

        },

        ProfilerPlan: {
            EntityTypeCode: '',
            Name: "blt_profilerplan"

        },

        CaptureRequest: {
            EntityTypeCode: '10010',
            Name: "blt_capturerequest"

        },

        CaptureContact: {
            EntityTypeCode: '10012',
            Name: "blt_capturecontact",
            StatusCodes: {
                New: {
                    Value: 1,
                    Name: "New"
                },
                Exported: {
                    Value: 858880000,
                    Name: "Exported"
                }
            }
        },


        Resume: {
            EntityTypeCode: '10000',
            Name: "blt_resume",
            StatusCodes: {
                New: {
                    Value: 1,
                    Name: "New"
                },
                Exported: {
                    Value: 858880000,
                    Name: "Exported"
                }
            },
            SourceTypes: {
                Manual: {
                    Value: 858880000,
                    Name: "Manual"
                },
                Text: {
                    Value: 858880001,
                    Name: "Text"
                },
                File: {
                    Value: 858880002,
                    Name: "File"
                },
                Email: {
                    Value: 858880003,
                    Name: "Email Attachement"
                }
            }

        },
        
        __namespace: true
    };

    */
 

    this.init = function (app) {

        if (this.__initialized) return;

        Broadlook.Metadata.Entities.ProfilerLead.EntityTypeCode = Broadlook.Metadata.getEntityTypeCodeFromLogicalName(Broadlook.Metadata.Entities.ProfilerLead.Name);
        Broadlook.Metadata.Entities.ProfilerCompany.EntityTypeCode = Broadlook.Metadata.getEntityTypeCodeFromLogicalName(Broadlook.Metadata.Entities.ProfilerCompany.Name);
        Broadlook.Metadata.Entities.ProfilerPlan.EntityTypeCode = Broadlook.Metadata.getEntityTypeCodeFromLogicalName(Broadlook.Metadata.Entities.ProfilerPlan.Name);

        this.__initialized = true;
    };

}).apply(Broadlook.Metadata);
