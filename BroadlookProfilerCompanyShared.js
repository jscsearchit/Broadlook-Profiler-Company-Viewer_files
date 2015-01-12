if (typeof (Broadlook) == "undefined") { Broadlook = { __namespace: true }; }
Broadlook.ProfilerCompany = Broadlook.ProfilerCompany || { __namespace: true };

(function () {

    this.__namespace = true;
    this.BuildVersion = "2013.04.24";
    this.BetaVersion = false;
    this.gridMinRows = 5;
    this.gridMaxRows = 50;
    this.company = null;
    this.contacts = null; //filtered
    this.contacts0 = null; //all
    this.inactivecontacts = []; //deleted
    this.companyId = null;
    this.crmaccountId = null;
    this.crmaccountName = null;
    this.lastWindowHeight = 0;
    this.lastWindowWidth = 0;


    this.init = function () { // virtual
        this.init0();
    }

    this.init0 = function () {

        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;

        lib.init();

        lib.$("#subgrid-container").resizable({
            handles: 'e, w',
            maxWidth: 800,
            minWidth: 150
        });

        var resizeSubgrid = function () {
            var w = lib.$("#subgrid-container").width();
            lib.$("#subgrid").jqGrid('setGridWidth', w - 1);

            var w2 = lib.$("#details").width();
            lib.$("#bio").width(w2 - w - 10); // 5 is a padding on #bio
        };

        lib.$("#subgrid-container").resize(resizeSubgrid);

        resizeSubgrid();


        var ver = "Company Profiler v" + self.BuildVersion + " | Script Library v" + lib.BuildVersion;
        lib.$("#logo").attr("alt", ver);
        lib.$("#logo").attr("title", ver);

        lib.$("#new-profile-button").text('Profile now!');
        lib.$("#new-profile-button").click(function () {
            self.hideNewMode(self.profileCompany);
        });

        lib.$("#new-reload-button").text('Reload page');
        lib.$("#new-reload-button").click(function () {
            if (self.company)
                self.hideNewMode(self.loadData);
            else
                window.parent.location.reload(true);
        });

        self.lastWindowHeight = lib.$(window).height();
        self.lastWindowWidth = lib.$(window).width();

        lib.$(window).on('resize', self.resizeWindow);

        lib.$("#loading").addClass("ui-widget ui-widget-content ui-corner-all").hide();

        lib.$("input:radio, a, input:button", "#lookupaccount").button();
        lib.$("input:button", "#header").button();
        lib.$("#extrainfo").addClass('ui-widget-content');
        lib.$("#extrainfo").addClass('ui-corner-all');
        //lib.$("#fill-email-template").combobox();
        lib.$("#fill-email-template").change(function () {
            //alert(lib.$(this).val());
            if (lib.$(this).val() == '') {
                lib.$("#fill-email-template-text").removeClass('ui-invisibleInput');
                lib.$("#fill-email-template-Guide").removeClass('ui-invisibleInput');
                lib.$("#fill-email-template").addClass('ui-invisibleInput');
                lib.$("#fill-email-template-text").focus();
            } else {
                lib.$("#fill-email-template-text").val(lib.$(this).val());
            }
            self.PopulateSampleEmails();
        });
        lib.$("#fill-email-template-text").change(function () {
            var textVal = lib.$(this).val();
            lib.$("option", "#fill-email-template").each(function (index) {
                if (lib.$(this).val() == textVal) {
                    lib.$("#fill-email-template").val(textVal);
                    lib.$("#fill-email-template-text").addClass('ui-invisibleInput');
                    lib.$("#fill-email-template-Guide").addClass('ui-invisibleInput');
                    lib.$("#fill-email-template").removeClass('ui-invisibleInput');
                    lib.$("#fill-email-template").focus();
                    return;
                }
            });
            self.PopulateSampleEmails();
        });
        lib.$("#fill-email-template-text").blur(function () {
            if (!self.ValdiationEmailFormat(lib.$(this).val())) {
                lib.$("#fill-email-template-text").css('background-color', '#FF6666');
            } else {
                lib.$("#fill-email-template-text").css('background-color', '');
            }
        });

        lib.$("#fill-button").button({
            text: true,
            label: "Fill&nbsp;Missing&nbsp;Data",
            icons: {
                primary: "fill-icon"
            }
        }).click(function () {
            lib.cleanMessages();
            self.fillLeads();
        }).attr('title', 'Fill missing phones and emails');

        lib.$("#convert-contact-button").button({
            text: true,
            label: "Convert&nbsp;to&nbsp;Contact",
            icons: {
                primary: "contact-icon"
            }

        }).click(function () {
            lib.cleanMessages();
            lib.convertLeads('contact', 'blt_profilerlead')
        }).attr('title', 'Convert to CRM Contact');

        lib.$("#convert-lead-button").button({
            text: true,
            label: "Convert&nbsp;to&nbsp;Lead",
            icons: {
                primary: "lead-icon"
            }

        }).click(function () {
            lib.cleanMessages();
            lib.convertLeads('lead', 'blt_profilerlead')
        }).attr('title', 'Convert to CRM Lead');


        lib.$("#enrich-account-button").button({
            text: true,
            label: "Update&nbsp;Account",
            icons: {
                primary: "account-icon"
            }
        }).attr('title', 'Update the linked CRM Account with Profiler Company data');

        lib.$("#enrich-account-button").attr('disabled', 'disabled');

        lib.$("#delete-button").button({
            text: false,
            label: "Delete",
            icons: {
                primary: "delete-icon"
            }
        }).click(function () {
            lib.cleanMessages();
            self.deleteLeads();
        }).attr('title', 'Delete (deactivate) selected Profiler Lead(s)');


        lib.$("#refresh-button").button({
            text: false,
            label: "Refresh",
            icons: {
                primary: "refresh-icon"
            }

        }).click(function () {
            lib.cleanMessages();
            self.loadData();
        }).attr('title', 'Reload all Profiler data');



        lib.$("#more-button")
        .button({
            text: true,
            label: "More",
            icons: {
                primary: null,
                secondary: "more-icon"
            }

        })
        .click(self.toggleCompanyInfo)
        .attr('title', 'Display addtional Profiler Company information');


        lib.$("#filter-select")
        .change(self.filter);

        lib.$("#nocontent").hide();
        lib.$("#content").show();

        self.initGrid();

        lib.$('#grid').jqGrid('hideCol', 'cb')

        if (self.BetaVersion) {
            lib.$('#beta').show();
            //var beta = lib.$('<div style="text-align: right;"><span style="color: #666666; font-weight: bold;">Beta Version</span> <a style="color: #666666" href="mailto:bugs@broadlook.com" title="Please describe user actions, include a link to the CRM form, and attach a screenshot if possible. Thank you for participation in our beta program!">Report a bug</a></div>')
            //    .appendTo(lib.$('#age'));
        }
        else {
            lib.$('#beta').hide();
        }

        //        if(lib.demo) {
        //            lib.$("#demobar").show();
        //        }

    }
    this.ValdiationEmailFormat = function(format){
        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;

        var reg = /^(F|L|First|Last|[._%+-]|([a-zA-Z0-9._%+-])){1,10}$/;
        return reg.test(lib.$("#fill-email-template-text").val());
    }
    this.PopulateSampleEmails = function () {
        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;

        var s = String(lib.$("#grid").jqGrid('getGridParam', 'selarrrow'));
        if (s == '') return;
        var rownums = s.split(',');
        if (rownums.length == 0) return;

        var newdomain = lib.$("#fill-email-domain").val().toLowerCase().trim();
        var template = lib.$("#fill-email-template-text").val();

        template = template.replace(/["']/g, "");
        template = template.replace("'", "");

        lib.$("#fill-email-template-Sample").find("td").html('');
        var sampleEmails = '';

        var i = (rownums.length > 5 ? 5 : rownums.length);
        while (i--) {

            var rownum = rownums[i];
            var rec = lib.$("#grid").jqGrid('getRowData', rownum);

            //alert(rec.firstname);
            var newemail = self.applyTemplate(rec.firstname, rec.lastname, template) + "@" + newdomain;

            sampleEmails = newemail + (i < rownums.length ? '<br />' : '') + sampleEmails;
        }
        //alert(sampleEmails);
        lib.$(lib.$("#fill-email-template-Sample").find("td")[2]).html(sampleEmails);

    }
    this.updateControls = function (lockall) {

        var lib = Broadlook.Library;

        var s = String(lib.$("#grid").jqGrid('getGridParam', 'selarrrow'));

        if (s == '' || lockall) {

            lib.$("#convert-lead-button", "#menu").attr("disabled", "disabled");
            lib.$("#convert-contact-button", "#menu").attr("disabled", "disabled");
            lib.$("#fill-button", "#menu").attr("disabled", "disabled");
            lib.$("#delete-button", "#menu").attr("disabled", "disabled");
            lib.$("#more-button", "#menu").attr("disabled", "disabled");
            lib.$("#edit-button", "#menu").attr("disabled", "disabled");
            lib.$("#filter-select", "#menu").attr("disabled", "disabled");
            lib.$("#refresh-button", "#menu").attr("disabled", "disabled");

            // do not lock company-level controls due to no selection
            if (lockall !== true) {
                lib.$("#filter-select", "#menu").removeAttr("disabled");
                lib.$("#edit-button", "#menu").removeAttr("disabled");
                lib.$("#more-button", "#menu").removeAttr("disabled");
                lib.$("#refresh-button").removeAttr("disabled");
            }

        }
        else {
            lib.$("#convert-lead-button", "#menu").removeAttr("disabled");
            lib.$("#convert-contact-button", "#menu").removeAttr("disabled");
            lib.$("#fill-button", "#menu").removeAttr("disabled");
            lib.$("#delete-button", "#menu").removeAttr("disabled");
            lib.$("#more-button", "#menu").removeAttr("disabled");
            lib.$("#edit-button", "#menu").removeAttr("disabled");
            lib.$("#filter-select", "#menu").removeAttr("disabled");
            lib.$("#refresh-button").removeAttr("disabled");

        }

    }

    this.initGrid = function () {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        lib.$("#grid").jqGrid({
            colModel: [
                { name: 'id', index: 'id', hidden: true, key: true },
                { name: 'guid', hidden: true },

                { name: 'sources', label: "Sources", sortable: false, width: 60, classes: 'nowrap' },
                { name: 'status', label: "Data", index: 'status', width: 60 },
                { name: 'score', label: "Score", index: 'score', width: 50, align: "center", sorttype: "int" },

                { name: 'name', label: "Name", index: 'name', width: 160 },
                { name: 'title', label: "Job Title", index: 'title', width: 160 },
                { name: 'email_html', label: "Email", index: 'email', width: 160 },
                { name: 'phone_html', label: "Phone", index: 'phone', width: 120 },

                { name: 'city', label: "City", index: 'city', width: 70 },
                { name: 'state', label: "St", index: 'state', width: 20, align: "left" },
                { name: 'connections', label: "Connections", sortable: false, width: 80 },
                { name: 'contextcompany', label: "Context Company", index: 'contextcompany', width: 160 },

                { name: 'bio', sortable: false, hidden: true },
                { name: 'context', sortable: false, hidden: true },

                { name: 'firstname', hidden: true },
                { name: 'middlename', hidden: true },
                { name: 'lastname', hidden: true },

                { name: 'autofilledemail', hidden: true },
                { name: 'autofilledphone', hidden: true },

                { name: 'crmcontactid', hidden: true },
                { name: 'crmcontactname', hidden: true },

                { name: 'crmaccountid', hidden: true },
                { name: 'crmaccountname', hidden: true },

                { name: 'crmleadid', hidden: true },
                { name: 'crmleadname', hidden: true },

                { name: 'email', hidden: true },
                { name: 'phone', hidden: true },
                { name: 'phone2', hidden: true },

                { name: 'invdate', index: 'invdate', width: 90, hidden: true }

            ],
            autowidth: true,
            caption: "",
            datatype: //'clientSide',
                self.getPage,
            /*function(postdata) {
            // do something here
            alert(postdata);
            }*/
            emptyrecords: "", //"No leads were found",
            gridview: true,
            height: "200px",

            loadtext: "Loading...",
            loadui: "block",

            multiselect: true,
            /*multiselectWidth: 0,*/

            pager: '#pager',
            pgtext: "Page {0} of {1}",

            recordtext: "Records {0} - {1} of {2}",
            rowNum: 1,

            scroll: false,
            shrinkToFit: true,
            sortname: 'score',
            sortorder: "desc",

            url: "",
            viewrecords: true,
            width: 600,

            onPaging: function () {
                lib.$("#grid").jqGrid('resetSelection');
                self.showRowDetails(null);
            },

            onSelectRow: function (id) {
                if (!self.loaded) return;
                self.updateControls();
                self.showRowDetails(id);
            },
            onSelectAll: function () {
                self.updateControls();
            },
            beforeSelectRow: function (rowid, e) {


                if (!self.loaded) {
                    return false;
                }

                if (!e.ctrlKey && !e.shiftKey) {
                    lib.$("#grid").jqGrid('resetSelection');
                }
                else if (e.shiftKey) {
                    var initialRowSelect = lib.$("#grid").jqGrid('getGridParam', 'selrow');
                    lib.$("#grid").jqGrid('resetSelection');

                    var CurrentSelectIndex = lib.$("#grid").jqGrid('getInd', rowid);
                    var InitialSelectIndex = lib.$("#grid").jqGrid('getInd', initialRowSelect);
                    var startID = "";
                    var endID = "";
                    if (CurrentSelectIndex > InitialSelectIndex) {
                        startID = initialRowSelect;
                        endID = rowid;
                    }
                    else {
                        startID = rowid;
                        endID = initialRowSelect;
                    }

                    var shouldSelectRow = false;
                    lib.$.each(lib.$("#grid").getDataIDs(), function (_, id) {
                        if (!shouldSelectRow) shouldSelectRow = (id == startID);
                        if (shouldSelectRow) lib.$("#grid").jqGrid('setSelection', id, false);
                        return id != endID;
                    });


                    lib.$("#grid").jqGrid('setSelection', rowid, false);

                    if (document.selection && document.selection.empty) {
                        document.selection.empty();
                    } else if (window.getSelection) {
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                    }
                }
                return true;
            },

            gridComplete: function () {

                if (!self.loaded) return;
                lib.$("#grid").jqGrid('resetSelection');
                self.showRowDetails(null);
            }


        });

        lib.$("#grid").jqGrid('navGrid', '#pager', { edit: false, add: false, del: false, search: true, refresh: false });

        lib.$("#subgrid").jqGrid({
            colModel: [
                { name: 'id', index: 'id', hidden: true, key: true },
                { name: 'name', label: false, sortable: true, align: "left" },
                { name: 'value', hidden: true },
                { name: 'link', hidden: true }
            ],
            autowidth: true,

            caption: "",
            datatype: 'clientSide',
            emptyrecords: "",
            gridview: false,

            height: 120,
            loadtext: "Loading...",
            multiselect: false,

            rowNum: 5,
            shrinkToFit: true,
            scroll: false,
            url: "",
            viewrecords: true,
            width: 450,
            onSelectRow: function (id) {
                self.showSubRowDetails(id);
            }
        }
        );

        lib.$('.ui-jqgrid-hdiv', "#details").hide();

    }


    this.showRowDetails = function (id) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        if (id == null) {

            lib.$("#subgrid").jqGrid('clearGridData');
            lib.$("#bio").html(null);
        }


        if (id != self.lastSelectedRow) {

            lib.$("#bio").html(null);

            var data = lib.$("#grid").jqGrid('getRowData', id);

            lib.$("#subgrid").jqGrid('clearGridData');

            var b = data['bio'];

            var subid = 1;

            if (lib.nz(b)) {
                var biorec = new Object;
                biorec.name = "Extra Information";
                biorec.value = b;
                biorec.link = '';

                lib.$("#subgrid").jqGrid('addRowData', subid, biorec);
                subid++;
            }


            var c = unescape(data['context']) + "";

            // cut off venues
            if (c.indexOf('<VENUES>') != -1) c = c.substr(0, c.indexOf('<VENUES>'));


            if (lib.nz(c)) {

                var t = c + "";

                var maxrows = 25;
                var linkrecords = [];

                while (t.length > 0 && maxrows > 0) {
                    maxrows--;
                    var linkurl = '';
                    var linktext = '';
                    var p1 = 0;

                    p1 = t.indexOf("{");
                    if (p1 < 0) {
                        continue;
                    }
                    t = t.slice(p1 + 1);

                    p1 = t.indexOf("}");
                    if (p1 < 0) {
                        continue;
                    }
                    linkurl = t.slice(0, p1);
                    t = t.slice(p1 + 1);


                    linktext = t;
                    p1 = t.indexOf("{"); // next link exists
                    if (p1 > 0) {
                        linktext = t.slice(0, p1);
                        t = t.slice(p1);
                    }
                    else { // last one
                        t = "";
                    }

                    var linkrec = new Object;
                    linkrec.name = linkurl;
                    linkrec.value = linktext;
                    linkrec.link = linkurl;

                    // merge
                    var merged = false;

                    //var jjlen = linkrecords.length;
                    //var jj = linkrecords.length;

                    //while(jj--) {
                    //    var j = jjlen - jj;

                    for (var j = 0; j < linkrecords.length; j++) {

                        if (linkrecords[j].link == linkrec.link) {

                            if (lib.nz(linkrecords[j].value) && lib.$.trim(linkrecords[j].value) != "")
                                linkrecords[j].value = linkrecords[j].value + "<br><br>" + linkrec.value;
                            else
                                linkrecords[j].value = linkrec.value;

                            merged = true;
                        }
                    }

                    // or add new
                    if (!merged)
                        linkrecords.push(linkrec);

                }

                linkrecords.sort(function sortAlpha(a, b) {
                    var prefix = "zzz";
                    var aword = a.link.toLowerCase();
                    var bword = b.link.toLowerCase();

                    if (aword.indexOf("linkedin.") > -1) aword = prefix + aword;
                    if (bword.indexOf("linkedin.") > -1) bword = prefix + bword;

                    return aword > bword ? 1 : -1;
                });


                for (var k = 0; k < linkrecords.length; k++) {
                    lib.$("#subgrid").jqGrid('addRowData', subid, linkrecords[k]);
                    subid++;
                }

            }

            if (subid > 1) {
                lib.$("#subgrid").jqGrid('setSelection', 1, true);
            }


            self.lastSelectedRow = id;
        }

    }


    this.showSubRowDetails = function (id) {

        var lib = Broadlook.Library;

        var data = lib.$("#subgrid").jqGrid('getRowData', id);

        var c = unescape(data['value']) + "";

        if (lib.nz(data['link'])) {
            var l = data['link'] + "";
            if (l.substr(0, 26) != "http://edgar.broadlook.com") {
                var t2 = "<p style='text-align: left'>Visit the page: <a target='_blank' href='" + l + "' title='Open the original web page in a new browser window'>" + l + "</a></p>"
                c = t2 + "" + c;
            }
        }

        lib.$("#bio").html(c);


    }

    this.toggleCompanyInfo = function () {

        var lib = Broadlook.Library;

        lib.$('#extrainfo').toggle();

        var t = lib.$('#morelink').text();

        if (t == 'More') lib.$('#morelink').text('Less');
        else lib.$('#morelink').text('More');
    }

    this.beginDataLoad = function (label) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        self.loaded = false;
        lib.cleanMessages();

        lib.$("#grid").jqGrid('clearGridData');
        lib.$("#subgrid").jqGrid('clearGridData');
        lib.$("#bio").html(null);

        self.resizeGrid();
        self.resized = false;

        self.updateControls(true);

        lib.$("#lui_grid").show();
        lib.$("#load_grid").html(label);
        lib.$("#load_grid").show();
    }

    this.endDataLoad = function (checkfilter) {

        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;


        self.loaded = true;
        lib.$("#loading").hide();
        lib.$("#lui_grid").hide();
        lib.$("#load_grid").hide();
        self.updateControls(false);
        if (!self.resized)
            self.resized = true;

        if (checkfilter !== false) {
            var filter = lib.getCookie('broadlook_company_filter');
            if (!filter) filter = 'all'; // default
            if (lib.nz(filter)) {
                lib.$("#filter-select").val(filter);
                self.filter();
            }
        }

        self.resizeGrid();

    }

    this.filter = function () {


        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        self.beginDataLoad('Filtering...');

        var v = lib.$("#filter-select").val();

        lib.setCookie('broadlook_company_filter', v, 30);

        setTimeout("Broadlook.ProfilerCompany.applyFilter('" + v + "');", 10);
    },

    this.applyFilter = function (v) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        var filterby = "title";
        var showDeleted = false;
        var ff = [];

        if (v == 'clevel') {
            ff.push('ceo');
            ff.push('cfo');
            ff.push('cmo');
            ff.push('cxo');
            ff.push('cso');
            ff.push('cto');
            ff.push('cio');
            ff.push('owner');
            ff.push('founder');
            ff.push('president');
            ff.push('principal');
            ff.push('proprietor');
            ff.push('chief');
        }
        else if (v == 'director') {
            ff.push('director');
        }
        else if (v == 'sales') {
            ff.push('sales');
            ff.push('account');
            ff.push('western');
            ff.push('eastern');
            ff.push('northern');
            ff.push('southern');
            ff.push('northeast');
            ff.push('southeast');
            ff.push('southwest');
            ff.push('northwest');
            ff.push('midwest');
            ff.push('territory');
        }
        else if (v == 'vp') {
            ff.push('vp');
            ff.push('vice');
            ff.push('VEEP');
            ff.push('VE');
        }
        else if (v == 'board') {
            ff.push('board');
        }
        else if (v == 'manager') {
            ff.push('manager');
            ff.push('gm');
        }
        else if (v == 'new') {
            filterby = "status";
            ff.push('New');
        }
        else if (v == 'unverified') {
            filterby = "status";
            ff.push('Unverified');
        }
        else if (v == 'inactive') {
            filterby = "status";
            ff.push('Inactive');
            showDeleted = true;
        }



        self.contacts = [];

        var jl = ff.length;
        var added = 0;

        var total = self.contacts0.length;
        var i = total;
        while (i--) {

            var mydata = self.contacts0[i];


            if (ff.length == 0) {

                if (mydata['status'] != 'Inactive' || showDeleted)
                    self.contacts.push(mydata);
                added++;
            }
            else {

                var j = jl;
                while (j--) {

                    var f = ff[j];

                    var title = " " + mydata[filterby] + " ";

                    var character = f[0];
                    if (character == character.toLowerCase()) title = title.toLowerCase();

                    title = title.replace(/[^A-Za-z0-9]/g, ' ');

                    if (title.indexOf(" " + f + " ") > -1) {

                        if (mydata['status'] != 'Inactive' || showDeleted)
                            self.contacts.push(mydata);
                        added++;
                        break;
                    }
                }
            }



        }



        var s = "Displaying " + added + " out of " + total + " total rows.";
        if (total == added) s = "";
        lib.$("#filter-count").html(s);
        if (added == 0 && total != 0)
            lib.$("#filter-count").addClass('red');
        else
            lib.$("#filter-count").removeClass('red');


        self.resizeGrid();

        self.endDataLoad(false);

    }

    this.resizeWindow = function (event) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        if (self.resizeGridActive) {
            if (event) event.stopPropagation();
            return;
        }

        var h = lib.$(window).height();
        var w = lib.$(window).width();

        if (Math.abs(h - self.lastWindowHeight) > 50 || Math.abs(w - self.lastWindowWidth) > 50) {

            //save this windows size
            self.lastWindowHeight = h;
            self.lastWindowWidth = w;

            if (!self.IE10) {

                if (self.resizeGridHandle > 0)
                    clearTimeout(self.resizeGridHandle);

                self.resizeGridHandle = setTimeout("Broadlook.ProfilerCompany.resizeGrid();", 200);
            }
            else
                Broadlook.ProfilerCompany.resizeGrid();


        }
    }

    this.IE10 = false;

    this.resizeGrid = function () {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        if (self.resizeGridActive) return;
        self.resizeGridActive = true;

        lib.$(window).off('resize', self.resizeWindow);

        try {

            var w = document.documentElement.clientWidth - 2;

            // IE10 bug
            if (window.frameElement && window.frameElement.parentNode && window.frameElement.parentNode.parentNode && window.frameElement.parentNode.parentNode.clientWidth) {
                var w2 = window.frameElement.parentNode.parentNode.clientWidth - 12;
                if (w2 < w) {
                    w = w2;
                    self.IE10 = true;
                }
            }

            lib.$("#content").width(w);

            // test: try autowidth
            lib.$("#grid").jqGrid('setGridWidth', w);

            //var half = w / 2 - 2;
            /*lib.$("#details-left-col").width(10);*/
            //lib.$("#subgrid-container").width(half);
            //lib.$("#subgrid").jqGrid('setGridWidth', half);



            var hstatus = lib.$("#status").height();

            if (lib.$("#demobar:visible").height())
                hstatus += lib.$("#demobar:visible").height() + 30;

            if (lib.$("#expbar:visible").height())
                hstatus += lib.$("#expbar:visible").height() + 30;

            var hheader = lib.$("#header").height();
            var hmenu = lib.$("#menu")[0].clientHeight;

            var h = document.documentElement.clientHeight;

            // IE10 bug
            if (window.frameElement &&
                window.frameElement.parentNode &&
                window.frameElement.parentNode.parentNode &&
                window.frameElement.parentNode.parentNode.clientHeight) {

                var h2 = window.frameElement.parentNode.parentNode.clientHeight - 12;
                if (h2 < h)
                    h = h2;
            }

            var h0 = h - hstatus - hheader - hmenu;
            var hdetails = 120;

            var hpager = lib.$("#pager").height();
            var hcolhead = lib.$("div[class='ui-state-default ui-jqgrid-hdiv']", "#gview_grid").height();
            var hgridrows = h0 - hdetails - hcolhead - hpager; // -4;

            var hrow = 23;
            if (lib.$("tr:eq(1)", "#grid")[0] != null) hrow = lib.$("tr:eq(1)", "#grid")[0].clientHeight;
            if (!(hrow > 15)) hrow = 23;

            var numrows = Math.floor(hgridrows / hrow);

            var loadedrows = 0;
            if (self.contacts) loadedrows = self.contacts.length; // xml way
            else loadedrows = lib.$("#grid").jqGrid('getGridParam', 'records'); // old way - entities

            if (loadedrows < numrows) numrows = loadedrows; // shorten the grid if fewer rows loaded 
            if (numrows < self.gridMinRows) numrows = self.gridMinRows; // at least five should be visible
            lib.$("#grid").jqGrid('setGridHeight', numrows * hrow);

            if (numrows > self.gridMaxRows) numrows = self.gridMaxRows; // page size
            lib.$("#grid").setGridParam({ rowNum: numrows }).trigger("reloadGrid"); // causes window.resize in IE10?

            var hgrid = lib.$("#gbox_grid").height();
            hdetails = h0 - hgrid;

            if (hdetails < 200) {
                lib.$("#details").height(hdetails);
                lib.$("#subgrid").jqGrid('setGridHeight', hdetails);
                lib.$("#bio").height(hdetails);
            }

            var wsubgrid = lib.$("#subgrid-container").width();
            lib.$("#subgrid").jqGrid('setGridWidth', wsubgrid - 1);


            var wdetails = lib.$("#details").width();
            lib.$("#bio").width(wdetails - wsubgrid - 10); // 5 is a padding on #bio

        }
        finally {
            self.lastWindowHeight = lib.$(window).height();
            self.lastWindowWidth = lib.$(window).width();
            self.resizeGridActive = false;

            if (self.resizeGridHandle)
                clearTimeout(self.resizeGridHandle);

            if (!self.IE10)
                setTimeout("Broadlook.Library.$(window).on('resize', Broadlook.ProfilerCompany.resizeWindow);", 1000);
            else
                setInterval("Broadlook.ProfilerCompany.resizeWindow();", 2000);
        }
    }

    this.setNewMode = function () {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;


        lib.$("#new-reload-button").text('Reload page');
        lib.$("#new-reload-button").click(function () {
            self.hideNewMode(self.loadData);
        });
        
        var state = lib.getFormState();
        var website = lib.getWebsite();

        if (website && state != 'create') {
            var websiteurl = website;
            if (website.substring(0, 4) != 'http') websiteurl = 'http://' + websiteurl;
            lib.$("#new-prompt").html("Would you like to research <a id='new-website-button' target='_blank' href='" + websiteurl + "'>" + website + "</a> website for more contacts?");
            lib.$("#new-profile-button").show();
            lib.$("#new-reload-button").show();
        }
        else {
            lib.$("#new-prompt").html("Please fill in the website and save the record.");
            lib.$("#new-profile-button").hide();
            lib.$("#new-reload-button").hide();
        }

        //if (state != 'create') {
        //    lib.$("#new-reload-button").show();
        //} else {
        //    lib.$("#new-reload-button").hide();
        //}
            
        lib.$('#transparent-overlay').show().fadeTo(200, 0.5);
        lib.$('#about-wrapper').delay(200).show().fadeTo(170, 1.0);


    }

    this.setWaitingMode = function () {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;
        var $ = lib.$;

        var website = lib.getWebsite();
        var status = "Waiting for workflow to execute";
        var progress = "";

        var displayTree = function (xml) {
            var str = '';
            if ($(xml).children().length) {
                str += '<ul>';
                $(xml).children().each(function () {
                    if (this.nodeName[0] != '/') { // not a closing tag
                        var value = '';
                        if (this.nextSibling && this.nextSibling.nodeValue) {
                            value = ': ' + this.nextSibling.nodeValue;
                            var name = this.nodeName.replace(/_/g, ' ');
                            str += '<li>' + name + value + '</li>';
                        }
                    }
                });
                str += '</ul>';
            }
            return str;
        }


        if (self.company) {
            status = self.company.status;
            if (lib.nz(self.company.error))
                progress += self.company.error;
            if (lib.nz(self.company.progress_xml)) {
                var xml = self.company.progress_xml;
                xml = xml.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                progress += displayTree(xml);
            }
        }
        else {
            lib.$("#new-profile-button").hide();
            setTimeout("Broadlook.Library.$('#new-profile-button').show()", 30000);
        }

        lib.$("#new-prompt").html("Broadlook has received the request to profile <strong>" + website + "</strong> and has scheduled one of the research servers to process it." + "<div style='text-align: left;'>" + progress + "</div>") //<br /><br />Current status: <strong>"+ status+"</strong>" )
        lib.$("#new-profile-button").hide();

        lib.$('#transparent-overlay').show().fadeTo(200, 0.5);
        lib.$('#about-wrapper').delay(200).show().fadeTo(170, 1.0);
    }

    this.hideNewMode = function (callback) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        lib.$('#about-wrapper').hide().fadeTo(0, 0);
        lib.$('#transparent-overlay').fadeTo(200, 0, function () {
            lib.$(this).hide();
            if (callback) callback();
        });

    }


    this.loadCompanyAndLeads = function (company) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        self.company = company;

        if (lib.z(company)) {
            self.endDataLoad();
            return;
        }



        lib.$("#recordstatus").html('');
        if (company.status != 'Completed')
            lib.$("#recordstatus").html("<span title='" + (company.error ? company.error : "") + "'>" + company.status + "</span>");


        if (company.status != 'Completed' && company.status != 'Error' && company.status != 'New')
            self.setWaitingMode();
        else if (company.status == 'New')
            self.setNewMode();
        else {

            var age = 1;

            try {
                // The number of milliseconds in one day
                var ONE_DAY = 1000 * 60 * 60 * 24;
                var today = (new Date).getTime();
                var dt = company.completedon.getTime();
                age = Math.abs(today - dt);
                age = Math.round(age / ONE_DAY);
            }
            catch (e) {
                age = 0;
            }

            var agetext = "";
            if (age <= 1) agetext = "Data is less than one day old";
            else if (age <= 365) agetext = "Data is " + age + " days old";
            else agetext = "Data is more than one year old";

            lib.$("#age-value").html(agetext+" | ");

            lib.$("#age-value").removeClass("data-age-mid").removeClass("data-age-old");

            var profilelnk;

            if (age > 30) {
                profilelnk = "  <a href='#' id='age-profile-button'>Profile Now!</a>";
                if (age <= 90) lib.$("#age-value").addClass("data-age-mid");
                else lib.$("#age-value").addClass("data-age-old");
            } else
                profilelnk = "  <a href='#' id='age-profile-button'>Profile Again</a>";

            lib.$("#age-value").append(profilelnk);
            lib.$("#age-profile-button").click(function () { self.profileCompany(); });

        }

        var website = String(company.website);
        if (website.indexOf('://') == -1) website = 'http://' + website;

        var nametext = lib.formatTextLink(website, company.website);
        lib.$("#companyurl").html(nametext);

        var companyname = company.companyname;
        if (companyname == null) companyname = '';
        lib.$("#companyname").html(companyname);


        lib.$("#enrich-account-button").click(function () { lib.enrichAccountExecute(company) });

        if (lib.nz(company.parentaccountid)) {
            lib.$("#account").html("<span>" + lib.formatConnectionLink(company.parentaccountid, company.parentaccountname, "account", true) + "</span>");
            //lib.$("#enrich-account-button").removeAttr('disabled');
            self.crmaccountId = company.parentaccountid;
            self.crmaccountName = company.parentaccountname;
        }
        else {
            //lib.$("#enrich-account-button").attr('disabled', 'disabled');
            lib.$("#account").html('<span>None</span>');
            self.crmaccountId = null;
            self.crmaccountName = null;
        }

        lib.$("#siccode").html(company.siccode);

        lib.$("#phone").html(company.phone);

        var a1 = '';
        if (lib.nz(company.address_city)) a1 += company.address_city;
        if (lib.nz(company.address_stateorprovince)) {
            if (a1 != '') a1 += ', ';
            a1 += company.address_stateorprovince;
        }
        lib.$("#address").html(a1);

        var a2 = '';
        if (lib.nz(company.address_line1)) a2 += company.address_line1;
        if (lib.nz(company.address_line2)) a2 += ' ' + company.address_line2;
        if (lib.nz(company.address_city)) a2 += ' ' + company.address_city + ',';
        if (lib.nz(company.address_stateorprovince)) a2 += ' ' + company.address_stateorprovince;
        if (lib.nz(company.address_postalcode)) a2 += ' ' + company.address_postalcode;
        lib.$("#address2").html(a2);


        lib.$('#venue-facebook').attr('src', 'Images/facebook_inactive.png');
        lib.$('#venue-twitter').attr('src', 'Images/twitter_inactive.png');
        lib.$('#venue-linkedin').attr('src', 'Images/linkedin_inactive.png');
        lib.$('#venue-youtube').attr('src', 'Images/youtube_inactive.png');
        lib.$('#venue-googleplus').attr('src', 'Images/googleplus_inactive.png');

        if (lib.nz(company.extra)) {
            var s = company.extra;
            var venues = s.split(';');
            var i = venues.length;
            while (i--) {
                var pair = venues[i].split('=');
                if (pair.length < 2) continue;
                var venuename = pair[0];
                var venueurl = pair[1];
                if (venuename == 'facebook') lib.$('#venue-facebook').attr('src', 'Images/facebook_active.png');
                else if (venuename == 'twitter') lib.$('#venue-twitter').attr('src', 'Images/twitter_active.png');
                else if (venuename == 'linkedin') lib.$('#venue-twitter').attr('src', 'Images/linkedin_active.png');
                else if (venuename == 'youtube') lib.$('#venue-twitter').attr('src', 'Images/youtube_active.png');
                else if (venuename == 'googleplus') lib.$('#venue-twitter').attr('src', 'Images/googleplus_active.png');
            }
        }

        lib.$("#industry").html(company.industry);
        lib.$("#revenue").html(company.revenue);
        lib.$("#employees").html(company.employees);

        return self.loadLeadsFromBLXML(company.result_xml);

    }



    this.saveChangesInXMLLead = function (companyObject, rec, changes) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        try {


            var $xml = lib.$(lib.$.parseXML(self.cleanXML(companyObject.result_xml)));
            var records = $xml.find("CONTACTS").children(0);

            var n = records.length;
            while (n--) {
                var record = records[n];

                if (record.childNodes[0].text) { if (record.childNodes[0].text != rec.guid) continue; }
                else { if (record.childNodes[0].textContent != rec.guid) continue; }

                var j = changes.length;
                while (j--) {

                    var change = changes[j];

                    rec[change.fieldname] = change.value;

                    var nodeName = null;

                    if (change.fieldname == "email") nodeName = "EMAIL";
                    else if (change.fieldname == "autofilledemail") nodeName = "AUTO_EMAIL";
                    else if (change.fieldname == "phone") nodeName = "PHONE";
                    else if (change.fieldname == "autofilledphone") nodeName = "AUTO_PHONE";
                    else if (change.fieldname == "crmleadid") nodeName = "CRM_LEAD_ID";
                    else if (change.fieldname == "crmleadname") nodeName = "CRM_LEAD_NAME";
                    else if (change.fieldname == "crmcontactid") nodeName = "CRM_CONTACT_ID";
                    else if (change.fieldname == "crmcontactname") nodeName = "CRM_CONTACT_NAME";
                    else if (change.fieldname == "crmaccountid") nodeName = "CRM_ACCOUNT_ID";
                    else if (change.fieldname == "crmaccountname") nodeName = "CRM_ACCOUNT_NAME";
                    else if (change.fieldname == "score") nodeName = "SCORE";
                    else lib.showError("Cannot change XML field: " + change.fieldname);

                    if (!nodeName) continue;

                    var i = record.childNodes.length;

                    var found = false;

                    while (i--) {

                        var element = record.childNodes[i];

                        if (element.nodeName == nodeName) {
                            if (element.text) element.text = change.value || '';
                            else element.textContent = change.value || '';
                            found = true;
                            break;
                        }

                    }

                    if (!found) {
                        var element;

                        if (typeof ($xml[0].createNode) != "undefined") element = $xml[0].createNode(1, nodeName, "");
                        else element = $xml[0].createElement(nodeName);

                        if (typeof (element.text) != "undefined") element.text = change.value || '';
                        else element.textContent = change.value || '';

                        record.appendChild(element);
                    }

                }
            }

            if ($xml[0].documentElement.xml)
                companyObject.result_xml = $xml[0].documentElement.xml;
            else
                companyObject.result_xml = (new XMLSerializer()).serializeToString($xml[0].documentElement);
        }
        catch (error) {
            lib.showError(error.message);
        }

    }


    this.submitChanges = function (callback) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        try {

            // test
            var $xml = lib.$(lib.$.parseXML(self.cleanXML(self.company.result_xml)));

            lib.updateRecord("blt_profilercompany", self.companyId, [{ fieldname: "blt_result_xml", value: self.company.result_xml }], callback);

        }
        catch (error) {
            lib.showError(error.message);
        }

    }


    this.cleanXML = function (xml) {

        xml = xml.replace(/&#..;/g, ''); // remove unicode
        xml = xml.replace(/&#...;/g, ''); // remove unicode
        xml = xml.replace(/[\u0000-\u001F]/g, ''); // remove anything with ASCII code 0-31
        xml = xml.replace(/[\u007F-\uFFFF]/g, ''); // remove anything with ASCII code 127+
        xml = xml.replace(/&shy;/g, '-'); // replace soft-hyphen with dash

        return xml;
    }

    this.loadLeadsFromBLXML = function (blxml_doc) {

        if (typeof (blxml_doc) === "undefined" || blxml_doc === null) return false;

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;


        try {

            self.contacts = [];
            self.contacts0 = [];

            var $xml;

            var isBLXML = false;

            try {

                $xml = lib.$(lib.$.parseXML(self.cleanXML(blxml_doc)));

                isBLXML = blxml_doc.substring(0, 23) == "<ROOT><INFO><DATA>blxml";

                // validate that it is BLXML and it was parsed correctly 
                if (!$xml.find("TITLE").text() == "blxml")
                    throw "Invalid TITLE value";

            }
            catch (error) {

                try {
                    // bad chars in bio?
                    blxml_doc = blxml_doc.replace(/<BIO.+?BIO>/g, '');
                    blxml_doc = blxml_doc.replace(/<CONTEXT_LIST.+?CONTEXT_LIST>/g, '');
                    $xml = lib.$(lib.$.parseXML(self.cleanXML(blxml_doc)));
                }
                catch (error2) {
                    // old format data? profiler leads?
                    if (!isBLXML)
                        return false;
                    else
                        throw "BLXML Parser Error: " + error2.message.substring(0, 60) + "...";
                }

            }


            var contactsXML = $xml.find("CONTACTS").children(0);

            var i = 0;
            var ln = contactsXML.length;
            var counts = [];
            counts["Current"] = 0;
            counts["New"] = 0;
            counts["Unverified"] = 0;
            counts["Inactive"] = 0;


            while (i < ln) {
                var element = contactsXML[i];
                var mydata = self.loadLeadFromBLXML(element);
                counts[mydata.status]++;
                self.contacts.push(mydata);
                self.contacts0.push(mydata);
                i++;
            }

            var newtext = "";
            if (counts["Current"]) newtext = counts["Current"] + " current";
            if (counts["New"]) {
                if (newtext.length > 0) newtext += ", ";
                newtext += counts["New"] + " new";
            }
            if (counts["Unverified"]) {
                if (newtext.length > 0) newtext += ", ";
                newtext += counts["Unverified"] + " unverified";
            }
            if (counts["Inactive"]) {
                if (newtext.length > 0) newtext += ", ";
                newtext += counts["Inactive"] + " deleted";
            }


            if (newtext.length > 0) newtext += " contacts |";

            lib.$("#count-value").html(newtext);

            return true;

        } finally {
            self.endDataLoad();
        }
    }

    this.loadLeadFromBLXML = function (record) {


        if (typeof (record) === "undefined" || record === null) return;

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        var defvalue = null;


        var mydata =
            {
                id: 0,
                guid: 0,
                sources: defvalue,
                status: defvalue,
                score: defvalue,
                firstname: defvalue,
                lastname: defvalue,
                title: defvalue,
                email: defvalue,
                autofilledemail: defvalue,
                phone: defvalue,
                autofilledphone: defvalue,
                phone2: defvalue,
                city: defvalue,
                state: defvalue,
                contextcompany: defvalue,
                bio: defvalue,
                context: defvalue,
                invdate: defvalue,
                crmleadid: defvalue,
                crmleadname: defvalue,
                crmcontactid: defvalue,
                crmcontactname: defvalue,
                crmaccountid: defvalue,
                crmaccountname: defvalue,
                connections: ""
            };

        var i = record.childNodes.length;

        while (i--) {

            var element = record.childNodes[i];

            var text;
            if (element.textContent)
                text = element.textContent;
            else
                text = element.text;


            if (element.nodeName == "ID") mydata.guid = text;
            else if (element.nodeName == "SOURCES") mydata.sources = text;
            else if (element.nodeName == "STATUS") mydata.status = lib.getStatusName(text, "blt_profilerlead");
            else if (element.nodeName == "SCORE") mydata.score = text;
            else if (element.nodeName == "NAME_FIRST") mydata.firstname = text;
            else if (element.nodeName == "NAME_MIDDLE") mydata.middlename = text;
            else if (element.nodeName == "NAME_LAST") mydata.lastname = text;
            else if (element.nodeName == "TITLE") mydata.title = text;
                //else if(element.nodeName == "SOURCE_URL")    mydata.sourceurl = text;
            else if (element.nodeName == "EMAIL") mydata.email = text;
            else if (element.nodeName == "AUTO_EMAIL") mydata.autofilledemail = text;
            else if (element.nodeName == "PHONE") mydata.phone = text;
            else if (element.nodeName == "AUTO_PHONE") mydata.autofilledphone = text;
            else if (element.nodeName == "PHONE2") mydata.phone2 = text;
            else if (element.nodeName == "CITY") mydata.city = text;
            else if (element.nodeName == "STATE") mydata.state = text;
            else if (element.nodeName == "COMPANY_NAME") mydata.contextcompany = text;
            else if (element.nodeName == "BIO") mydata.bio = text;
            else if (element.nodeName == "CONTEXT_LIST") mydata.context = text.replace(/</g, '{').replace(/>/g, '}').replace(/&lt;/g, '{').replace(/&gt;/g, '}');
                //context: escape(record.blt_context),
                //invdate: record.ModifiedOn,
            else if (element.nodeName == "CRM_LEAD_ID") mydata.crmleadid = text;
            else if (element.nodeName == "CRM_LEAD_NAME") mydata.crmleadname = text;
            else if (element.nodeName == "CRM_CONTACT_ID") mydata.crmcontactid = text;
            else if (element.nodeName == "CRM_CONTACT_NAME") mydata.crmcontactname = text;
            else if (element.nodeName == "CRM_ACCOUNT_ID") mydata.crmaccountid = text;
            else if (element.nodeName == "CRM_ACCOUNT_NAME") mydata.crmaccountname = text;


        }

        mydata.id = mydata.guid;

        mydata.name = lib.composeFullName(mydata.firstname, mydata.middlename, mydata.lastname);

        return self.addLeadRecord(mydata, mydata.id);
    }

    this.addLeadRecord = function (mydata, id) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        var a = [];
        //if (mydata.crmaccountid !== null) a.push(lib.formatConnectionLink(mydata.crmaccountid, mydata.crmaccountname, "account", false) + " ");
        if (mydata.crmcontactid !== null) a.push(lib.formatConnectionLink(mydata.crmcontactid, mydata.crmcontactname, "contact", false) + " ");
        if (mydata.crmleadid !== null) a.push(lib.formatConnectionLink(mydata.crmleadid, mydata.crmleadname, "lead", false) + " ");
        mydata.connections = a.join('');

        a = [];
        if (mydata.sources != null) {
            if (mydata.sources.indexOf("Web") != -1) a.push("<div class='source-image source-web' title='Company website' />");
            if (mydata.sources.indexOf("CRM") != -1) a.push("<div class='source-image source-crm' title='CRM' />");
            if (mydata.sources.indexOf("Social") != -1) a.push("<div class='source-image source-social' title='Social Network' />");
            if (mydata.sources.indexOf("Management") != -1) a.push("<div class='source-image source-exec' title='Management' />");
            if (mydata.sources.indexOf("Board") != -1) a.push("<div class='source-image source-board' title='Board' />");
            if (mydata.sources.indexOf("SEC") != -1) a.push("<div class='source-image source-broadlook' title='Broadlook Databases' />");
        }
        if (mydata.bio != null && mydata.bio.length > 0) a.push("<div class='source-image source-extra' title='Extra Information' />");
        mydata.sources = a.join('');;

        if (mydata.name == null) mydata.name = "";
        if (mydata.email == null) mydata.email = '';
        if (mydata.phone == null) mydata.phone = '';
        if (mydata.phone2 == null) mydata.phone2 = '';

        /*
        if (mydata.phone2 != '') {
            if (mydata.phone == '') mydata.phone = mydata.phone2; 
            else mydata.phone = ', '+ mydata.phone2;
        }

        mydata.email_plain = mydata.email; // to sort properly
        mydata.phone_plain = mydata.phone; // to sort properly

        if (mydata.autofilledemail) mydata.email = self.formatAutofilledField(mydata.email);
        if (mydata.autofilledphone) mydata.phone = self.formatAutofilledField(mydata.phone);
        */

        //let's keep phone, phone2 and email intact
        self.formatEmailHtml(mydata);
        self.formatPhoneHtml(mydata);

        return mydata;
    }

    this.formatAutofilledField = function (value) {
        return "<span class='autofilled'>" + value + "</span>";
    }

    this.formatEmailHtml = function (mydata) {
        mydata.email_html = mydata.email;
        if (mydata.autofilledemail) mydata.email_html = Broadlook.ProfilerCompany.formatAutofilledField(mydata.email_html);
    }

    this.formatPhoneHtml = function (mydata) {
        var phone_temp = mydata.phone;
        if (mydata.phone2 != '') {
            if (phone_temp == '') phone_temp = mydata.phone2;
            else phone_temp += ', ' + mydata.phone2;
        }
        mydata.phone_html = phone_temp;
        if (mydata.autofilledphone) mydata.phone_html = Broadlook.ProfilerCompany.formatAutofilledField(mydata.phone_html);
    }


    this.getPage = function (postdata) {

        var self = Broadlook.ProfilerCompany;
        var lib = Broadlook.Library;

        /*                {
	        _search : false,
	        nd : 1346359074687,
	        rows : 50,
	        page : 1,
	        sidx : "score",
	        sord : "desc"


            _search : true,
	        nd : 1348858966589,
	        rows : 29,
	        page : 1,
	        sidx : "score",
	        sord : "desc",
	        searchField : "title",
	        searchString : "ss",
	        searchOper : "cn",
	        filters : ""
        } */

        if (!self.contacts) return;

        self.sortResults(postdata.sidx, postdata.sord == "desc" ? false : true);


        var contacts = [];

        if (postdata._search) {


            var k = self.contacts.length;

            while (k--) {

                var cnt = self.contacts[k];
                var valid = false;

                if (postdata._search) {
                    var value = cnt[postdata.searchField];
                    if (value)
                        value = value.toLowerCase();

                    var operand = (postdata.searchString || '').toLowerCase();

                    if (postdata.searchField != 'score') {
                        if (postdata.searchOper == "eq") // equal
                            valid = value && (value == operand);
                        else if (postdata.searchOper == "ne") // not equal
                            valid = !value || (value != operand);
                        else if (postdata.searchOper == "bw") // begins with
                            valid = value && (value.indexOf(operand) == 0);
                        else if (postdata.searchOper == "bn") // does not begin with
                            valid = !value || (value.indexOf(operand) != 0);
                        else if (postdata.searchOper == "ew") // ends with
                            valid = value && (value.indexOf(operand) == (value.length - operand.length));
                        else if (postdata.searchOper == "en") // does not end with
                            valid = !value || (value.indexOf(operand) != (value.length - operand.length));
                        else if (postdata.searchOper == "cn") // contains
                            valid = value && (value.indexOf(operand) >= 0);
                        else if (postdata.searchOper == "nc") // does not contain
                            valid = !value || (value.indexOf(operand) < 0);
                        else if (postdata.searchOper == "nu") // is null
                            valid = !value;
                        else if (postdata.searchOper == "nn") // is not null
                            valid = value;
                        else if (postdata.searchOper == "in") // is in
                            valid = value && (operand.indexOf(value) >= 0);
                        else if (postdata.searchOper == "ni") // is not in
                            valid = !value || (operand.indexOf(value) < 0);
                    }
                    else {

                        if (value) value = parseInt(value);
                        if (operand) operand = parseInt(operand);


                        if (postdata.searchOper == "eq") // equal
                            valid = value && (value == operand);
                        else if (postdata.searchOper == "ne") // not equal
                            valid = !value || (value != operand);
                        else if (postdata.searchOper == "lt") // less
                            valid = value && (value < operand);
                        else if (postdata.searchOper == "le") // less or equal
                            valid = value && (value <= operand);
                        else if (postdata.searchOper == "gt") // greater
                            valid = value && (value > operand);
                        else if (postdata.searchOper == "ge") // greater or equal
                            valid = value && (value >= operand);
                        else if (postdata.searchOper == "nu") // is null
                            valid = !value;
                        else if (postdata.searchOper == "nn") // is not null
                            valid = value != '';
                        else if (postdata.searchOper == "in") // is in
                            valid = value && (operand == value);
                        else if (postdata.searchOper == "ni") // is not in
                            valid = !value || (operand != value);
                    }
                }

                if (valid)
                    contacts.push(cnt);
            }

        }
        else
            contacts = self.contacts;


        rows = [];


        var cclen = contacts.length;
        var pagesize = postdata.rows;
        var pageno = postdata.page; //1..n
        var last = pageno * pagesize;
        var ii = pagesize + 1;

        while (ii--) {

            var i = last - ii;
            if (i >= cclen) break;

            var mydata = contacts[i];


            // use the same order as in grid.colModel
            rowdata =
            [mydata.id, mydata.guid, mydata.sources, mydata.status, mydata.score, mydata.name, mydata.title,
                mydata.email_html, mydata.phone_html,
                mydata.city, mydata.state, mydata.connections, mydata.contextcompany, mydata.bio, mydata.context,
                mydata.firstname, mydata.middlename, mydata.lastname, mydata.autofilledemail, mydata.autofilledphone,
                mydata.crmcontactid, mydata.crmcontactname, mydata.crmaccountid, mydata.crmaccountname, mydata.crmleadid, mydata.crmleadname,
                mydata.email, mydata.phone, mydata.phone2, mydata.invdate
            ];

            rows.push({ id: mydata.id, cell: rowdata });
        }


        var totalpages = Math.ceil(contacts.length / postdata.rows);
        var data = { "page": postdata.page, "total": totalpages, "records": contacts.length, "rows": rows };


        var mygrid = lib.$("#grid")[0];
        mygrid.addJSONData(data);
    }

    this.sortResults = function (prop, asc) {

        var self = Broadlook.ProfilerCompany;

        if (prop == 'score') {

            self.contacts = self.contacts.sort(function (a, b) {

                if (asc) return (parseInt(a[prop]) - parseInt(b[prop]));
                else return (parseInt(b[prop]) - parseInt(a[prop]));
            });
        }
        else if (prop.indexOf(' ') < 0) {

            primer = function (a) { return ('' + a).toUpperCase() };
            reverse = !asc;
            key = function (x) { return primer ? primer(x[prop]) : x[prop] };

            self.contacts = self.contacts.sort(function (a, b) {
                var A = key(a), B = key(b);
                return ((A < B) ? -1 : ((A > B) ? +1 : 0)) * [-1, 1][+!!reverse];
            });
        }
        else {
            props = prop.split(', ');

            primer = function (a) { return ('' + a).toUpperCase() };
            reverse = !asc;
            key = function (x) { return primer ? primer(x[props[0]]) : x[props[0]] };
            key2 = function (x) { return primer ? primer(x[props[1]]) : x[props[1]] };


            self.contacts = self.contacts.sort(function (a, b) {
                var A = key(a), B = key(b);
                var A2 = key2(a), B2 = key2(b);
                return ((A < B) ? -1 :
                        ((A > B) ? +1 :
                        ((A2 < B2) ? -1 : ((A2 > B2) ? +1 : 0))
                        )) * [-1, 1][+!!reverse];
            });
        }

    }


    this.getRecord = function (index) {
        var self = Broadlook.ProfilerCompany;
        if (!self.contacts) return null;
        if (index < 0 || index >= self.contacts.length) return null;

        var mydata = self.contacts[i];

        return mydata;
    }

    this.deleteLeads = function () {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;


        var s = String(lib.$("#grid").jqGrid('getGridParam', 'selarrrow'));
        if (s == '') return;
        var rownums = s.split(',');
        if (rownums.length == 0) return;

        var ids = [];
        var lines = [];

        var ilen = rownums.length;
        var i = rownums.length;
        while (i--) {

            var rec = lib.$("#grid").jqGrid('getRowData', rownums[ilen - i - 1]);

            // compile list
            var id = rec['guid'];
            ids.push(id);

            var name = rec['name'];
            lines.push("<li>" + name + "</li>");

        };

        lib.$("#delete-list").html(lines.join(''));


        lib.$("#delete-dialog").dialog({
            title: 'Delete records',
            width: 600,
            height: 200,
            modal: true,
            buttons: {
                "Delete": function () {

                    if (self.deleteRecords(ids))
                        self.submitChanges(function (res) {

                            if (res)
                                lib.$("#delete-list").html("Records were deleted successfully");
                            else
                                lib.$("#delete-list").html("Cannot delete");

                            lib.$("#delete-dialog").dialog({
                                buttons: {
                                    "Ok": function () {

                                        if (res)
                                            self.loadData(false);

                                        lib.$(this).dialog("close");
                                    }
                                }
                            });
                        });
                },
                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }).width(570).height(170);


    }


    this.deleteRecords = function (ids) {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        try {


            var $xml = lib.$(lib.$.parseXML(self.cleanXML(self.company.result_xml)));
            var records = $xml.find("CONTACTS").children(0);

            var i = ids.length;

            while (i--) {

                var found = false;
                var n = records.length;
                while (n--) {
                    var record = records[n];

                    if (record.childNodes[0].text) { if (record.childNodes[0].text != ids[i]) continue; }
                    else { if (record.childNodes[0].textContent != ids[i]) continue; }

                    var j = record.childNodes.length;
                    while (j--) {
                        var element = record.childNodes[j];

                        if (element.nodeName == 'STATUS') {

                            if (element.text) element.text = 2;  // inactive
                            else element.textContent = 2;

                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }

            }

            if ($xml[0].documentElement.xml)
                self.company.result_xml = $xml[0].documentElement.xml;
            else
                self.company.result_xml = (new XMLSerializer()).serializeToString($xml[0].documentElement);


            return true;
        }
        catch (error) {
            lib.showError(error.message);

            return false;
        }
    }



    /***********************************************************************************

    FILL EMAIL & PHONE WIZARD

    ************************************************************************************/

    this.fillLeads = function () {

        var lib = Broadlook.Library;
        var self = Broadlook.ProfilerCompany;

        var s = String(lib.$("#grid").jqGrid('getGridParam', 'selarrrow'));
        if (s == '') return;
        var rownums = s.split(',');
        if (rownums.length == 0) return;

        var url = self.company.website; // lib.$("#companyurl").text();
        try {
            //url = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/)[2];
            url = url.match(/:\/\/(www[0-9]?\.)?(.[^:]+)/)[2];
            //alert(self.company.website + ' ==> ' + url);
            //match(/:\/\/(www[0-9]?\.)?(.[^<&<<&"\A/:]+)/)[2] 
        }
        catch (err) { }

        if (url.indexOf('www.') == 0) url = url.substring(4);
        if (url.indexOf('/') == (url.length - 1)) url = url.substring(0, url.length - 1);

        var phone = lib.$("#phone").text();

        lib.$("#fill-email-domain", "#filldlg").val(url);
        lib.$("#fill-phone-number", "#filldlg").val(phone);

        // check or uncheck phone update box
        lib.$("#fill-phone-chk").attr('checked', lib.nz(phone));

        //Auto-detect the template
        if (lib.$("#fill-email-detected").val() !== "1") {

            var ids = lib.$("#grid").jqGrid('getDataIDs');

            var candidates = [];
            var templates = [];

            lib.$("option", "#fill-email-template").each(function (index) {
                templates.push(lib.$(this).text());
            });

            lib.$.each(lib.$("#grid").getDataIDs(), function (_, id) {
                var rec = lib.$("#grid").jqGrid('getRowData', id);
                if (lib.nz(rec.email) && String(rec.email).indexOf('@') > 0) {
                    var actual = String(rec.email).split('@', 2)[0];
                    lib.$(templates).each(function (index) {
                        var test = self.applyTemplate(rec.firstname, rec.lastname, this);
                        if (test === actual) candidates.push(this);
                    });
                }
            });

            var counts = [];

            lib.$(templates).each(function (index) {
                counts[this] = 0;
            });

            lib.$(candidates).each(function (index) {
                counts[this] = 1 + counts[this];
            });

            var t = '';
            var max = 0;
            lib.$(templates).each(function (index) {
                if (counts[this] > max) {
                    max = counts[this];
                    t = this;
                };
            });

            if (lib.nz(t)) {
                lib.$("#fill-email-template-text").val(t);
                lib.$("#fill-email-detected").val("1");
            }

        }

        lib.$("#filldlg-table").show();
        lib.$("#filldlg-loading").hide();

        self.PopulateSampleEmails();

        lib.$("#filldlg").dialog({
            title: 'Fill Missing Information Wizard',
            width: 600,
            height: 200,
            modal: true,
            buttons: {
                "OK": function () {

                    var updates = [];

                    var fillemail = typeof (lib.$("#fill-email-chk:checked").val()) != 'undefined';
                    var fillphone = typeof (lib.$("#fill-phone-chk:checked").val()) != 'undefined';

                    if (!fillemail && !fillphone)
                        return;

                    var newdomain = lib.$("#fill-email-domain").val().toLowerCase().trim();
                    var template = lib.$("#fill-email-template-text").val();
                    var newphone = lib.$("#fill-phone-number").val();

                    if (!self.ValdiationEmailFormat(template)) { alert('Invalid Email Format'); return; }

                    template = template.replace(/["']/g, "");
                    template = template.replace("'", "");

                    if (fillemail && !lib.nz(newdomain))
                        return;

                    if (fillemail && !lib.nz(template))
                        return;

                    if (fillphone && !lib.nz(newphone))
                        return;


                    var i = rownums.length;
                    while (i--) {

                        var rownum = rownums[i];
                        var rec = lib.$("#grid").jqGrid('getRowData', rownum);


                        var update = new Object;
                        update.id = rec['id'];
                        //update.entityname = "blt_profilerlead";
                        update.changes = [];

                        if (fillemail) {

                            var newemail = self.applyTemplate(rec.firstname, rec.lastname, template) + "@" + newdomain;

                            if (lib.nz(newemail) && newemail != rec.email) {
                                //rec.email = newemail;
                                //rec.autofilledemail = 1;


                                update.changes.push({ fieldname: "email", value: newemail });
                                update.changes.push({ fieldname: "autofilledemail", value: true });
                            }
                        }

                        if (fillphone) {
                            if (lib.nz(newphone) && newphone != rec.phone) {
                                //rec.phone = newphone;
                                //rec.autofilledphone = 1;

                                update.changes.push({ fieldname: "phone", value: newphone });
                                update.changes.push({ fieldname: "autofilledphone", value: true });

                            }
                        }

                        if (update.changes.length > 0) {
                            updates.push(update);
                            self.saveChangesInXMLLead(self.company, rec, update.changes);
                        }


                    }


                    var callback = function () {

                        // update grid cells

                        var i = updates.length;
                        while (i--) {
                            var k = updates[i].changes.length;
                            while (k--) {
                                var change = updates[i].changes[k];
                                /*
                                
                                if (change.fieldname == "email" || change.fieldname == "phone") {
                                    var rowid = updates[i].id;
                                    var newvalue = self.formatAutofilledField(change.value);
                                    lib.$("#grid").jqGrid("setCell", rowid, change.fieldname, newvalue);
                                }


                                */
                                if (change.fieldname == "email") {
                                    var rowid = updates[i].id;

                                    var email_html = self.formatAutofilledField(change.value);

                                    lib.$("#grid").jqGrid("setCell", rowid, "email", change.value);
                                    lib.$("#grid").jqGrid("setCell", rowid, "email_html", email_html);
                                }
                                else if (change.fieldname == "phone") {
                                    var rowid = updates[i].id;

                                    var phone_html = self.formatAutofilledField(change.value);

                                    lib.$("#grid").jqGrid("setCell", rowid, "phone", change.value);
                                    lib.$("#grid").jqGrid("setCell", rowid, "phone_html", phone_html);
                                }

                            }
                        }

                        lib.$(".ui-dialog-buttonpane").show();
                        lib.$("#filldlg").dialog("close");

                    };

                    self.submitChanges(callback);

                    // show progress, do not close
                    lib.$("#filldlg-table").hide();
                    lib.$("#filldlg-loading").show();
                    lib.$(".ui-dialog-buttonpane").hide();

                    //lib.$(this).dialog("close");
                },
                Cancel: function () {
                    lib.$(this).dialog("close");
                }
            }

        }).width(570).height(170);

    }

    this.applyTemplate = function (firstname, lastname, template) {

        var first = String(firstname).toLowerCase();
        var last = String(lastname).toLowerCase();

        var fi = '';
        if (first.length > 0) fi = first[0];

        var li = '';
        if (last.length > 0) li = last[0];

        var res = String(template);

        if (res.indexOf('First') > -1)
            res = res.replace(/First/g, first);
        if (res.indexOf('F') > -1)
            res = res.replace(/F/g, fi);

        if (res.indexOf('Last') > -1)
            res = res.replace(/Last/g, last);
        if (res.indexOf('L') > -1)
            res = res.replace(/L/g, li);

        return res;
    }




    var ___x = 1;

}).apply(Broadlook.ProfilerCompany);




Broadlook.Library = Broadlook.Library || { __namespace: true };

(function () {


}).apply(Broadlook.Library);
