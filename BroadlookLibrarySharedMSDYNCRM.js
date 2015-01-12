if (typeof (Broadlook) == "undefined") { Broadlook = { __namespace: true }; }

Broadlook.Library = Broadlook.Library || { __namespace: true };

//http://whattheheadsaid.com/2010/10/cross-context-isarray-and-internet-explorer
(function () {
    var toString = Object.prototype.toString,
        strArray = Array.toString(),
        jscript = /*@cc_on @_jscript_version @*/ + 0;

    // jscript will be 0 for browsers other than IE
    if (!jscript) {
        Array.isArray = Array.isArray || function (obj) {
            return toString.call(obj) == "[object Array]";
        }
    }
    else {
        Array.isArray = function (obj) {
            try {
                return "constructor" in obj && String(obj.constructor) == strArray;
            }catch(e) {
                return  typeof obj != 'undefined' &&
                        obj != null &&
                        typeof obj.push == 'object' &&
                        typeof obj.pop == 'object' && 
                        typeof obj.concat == 'object' && 
                        typeof obj.join == 'object' && 
                        typeof obj.splice == 'object' && 
                        typeof obj.length == 'number';
            }
        }
    }
})();

var ReqStatuses = new Object();
ReqStatuses['1'] = [1, 'Request received, continuing process.', 'This class of status code indicates a provisional response, consisting only of the Status-Line and optional headers, and is terminated by an empty line. Since HTTP/1.0 did not define any 1xx status codes, servers must not send a 1xx response to an HTTP/1.0 client except under experimental conditions.'];
ReqStatuses['100'] = [100, 'Continue', 'This means that the server has received the request headers, and that the client should proceed to send the request body (in the case of a request for which a body needs to be sent; for example, a POST request). If the request body is large, sending it to a server when a request has already been rejected based upon inappropriate headers is inefficient. To have a server check if the request could be accepted based on the request\'s headers alone, a client must send Expect: 100-continue as a header in its initial request and check if a 100 Continue status code is received in response before continuing (or receive 417 Expectation Failed and not continue).'];
ReqStatuses['101'] = [101, ' Switching Protocols', 'This means the requester has asked the server to switch protocols and the server is acknowledging that it will do so.'];
ReqStatuses['102'] = [102, ' Processing (WebDAV; RFC 2518)', 'As a WebDAV request may contain many sub-requests involving file operations, it may take a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet. This prevents the client from timing out and assuming the request was lost.'];
ReqStatuses['2'] = [2, 'Success', 'This class of status codes indicates the action requested by the client was received, understood, accepted and processed successfully.'];
ReqStatuses['200'] = [200, ' OK', 'Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request the response will contain an entity describing or containing the result of the action.'];
ReqStatuses['201'] = [201, ' Created', 'The request has been fulfilled and resulted in a new resource being created.'];
ReqStatuses['202'] = [202, ' Accepted', 'The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.'];
ReqStatuses['203'] = [203, ' Non-Authoritative Information (since HTTP/1.1)', 'The server successfully processed the request, but is returning information that may be from another source.'];
ReqStatuses['203'] = [204, ' No Content', 'The server successfully processed the request, but is not returning any content.'];
ReqStatuses['205'] = [205, ' Reset Content', 'The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.'];
ReqStatuses['206'] = [206, ' Partial Content', 'The server is delivering only part of the resource due to a range header sent by the client. The range header is used by tools like wget to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.'];
ReqStatuses['207'] = [207, ' Multi-Status (WebDAV; RFC 4918)', 'The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.'];
ReqStatuses['208'] = [208, 'Already Reported (WebDAV; RFC 5842)', 'The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again.'];
ReqStatuses['226'] = [226, 'IM Used (RFC 3229)', 'The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.'];
ReqStatuses['3'] = [3, 'Redirection', 'This class of status code indicates that further action needs to be taken by the user agent to fulfil the request. The action required may be carried out by the user agent without interaction with the user if and only if the method used in the second request is GET or HEAD. A user agent should not automatically redirect a request more than five times, since such redirections usually indicate an infinite loop.'];
ReqStatuses['300'] = [300, 'Multiple Choices', 'Indicates multiple options for the resource that the client may follow. It, for instance, could be used to present different format options for video, list files with different extensions, or word sense disambiguation.'];
ReqStatuses['301'] = [301, 'Moved Permanently', 'This and all future requests should be directed to the given URI.'];
ReqStatuses['302'] = [302, 'Found', 'This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours. However, some Web applications and frameworks use the 302 status code as if it were the 303.'];
ReqStatuses['303'] = [303, 'See Other (since HTTP/1.1)', 'The response to the request can be found under another URI using a GET method. When received in response to a POST (or PUT/DELETE), it should be assumed that the server has received the data and the redirect should be issued with a separate GET message.'];
ReqStatuses['304'] = [304, 'Not Modified', 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-Match. This means that there is no need to retransmit the resource, since the client still has a previously-downloaded copy.'];
ReqStatuses['305'] = [305, 'Use Proxy (since HTTP/1.1)', 'The requested resource is only available through a proxy, whose address is provided in the response. Many HTTP clients (such as Mozilla and Internet Explorer) do not correctly handle responses with this status code, primarily for security reasons.'];
ReqStatuses['306'] = [306, 'Switch Proxy', 'No longer used. Originally meant "Subsequent requests should use the specified proxy."'];
ReqStatuses['307'] = [307, 'Temporary Redirect (since HTTP/1.1)', 'In this case, the request should be repeated with another URI; however, future requests should still use the original URI. In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request. For instance, a POST request should be repeated using another POST request.'];
ReqStatuses['308'] = [308, 'Permanent Redirect (approved as experimental RFC)', 'The request, and all future requests should be repeated using another URI. 307 and 308 (as proposed) parallel the behaviours of 302 and 301, but do not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly.'];
ReqStatuses['4'] = [4, 'Client Error', 'The 4xx class of status code is intended for cases in which the client seems to have erred. Except when responding to a HEAD request, the server should include an entity containing an explanation of the error situation, and whether it is a temporary or permanent condition. These status codes are applicable to any request method. User agents should display any included entity to the user.'];
ReqStatuses['400'] = [400, 'Bad Request', 'The request cannot be fulfilled due to bad syntax.'];
ReqStatuses['401'] = [401, 'Unauthorized', 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. See Basic access authentication and Digest access authentication.'];
ReqStatuses['402'] = [402, 'Payment Required', 'Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, but that has not happened, and this code is not usually used. As an example of its use, however, Apple\'s defunct MobileMe service generated a 402 error if the MobileMe account was delinquent. In addition, YouTube uses this status if a particular IP address has made excessive requests, and requires the person to enter a CAPTCHA.'];
ReqStatuses['403'] = [403, 'Forbidden', 'The request was a valid request, but the server is refusing to respond to it. Unlike a 401 Unauthorized response, authenticating will make no difference. On servers where authentication is required, this commonly means that the provided credentials were successfully authenticated but that the credentials still do not grant the client permission to access the resource (e.g. a recognized user attempting to access restricted content).'];
ReqStatuses['404'] = [404, 'Not Found', 'The requested resource could not be found but may be available again in the future. Subsequent requests by the client are permissible.'];
ReqStatuses['405'] = [405, 'Method Not Allowed', 'A request was made of a resource using a request method not supported by that resource; for example, using GET on a form which requires data to be presented via POST, or using PUT on a read-only resource.'];
ReqStatuses['406'] = [406, 'Not Acceptable', 'The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.'];
ReqStatuses['407'] = [407, 'Proxy Authentication Required', 'The client must first authenticate itself with the proxy.'];
ReqStatuses['408'] = [408, 'Request Timeout', 'The server timed out waiting for the request. According to W3 HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time."'];
ReqStatuses['409'] = [409, 'Conflict', 'Indicates that the request could not be processed because of conflict in the request, such as an edit conflict.'];
ReqStatuses['410'] = [410, 'Gone', 'Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource again in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a "404 Not Found" may be used instead.'];
ReqStatuses['411'] = [411, 'Length Required', 'The request did not specify the length of its content, which is required by the requested resource.'];
ReqStatuses['412'] = [412, 'Precondition Failed', 'The server does not meet one of the preconditions that the requester put on the request.'];
ReqStatuses['413'] = [413, 'Request Entity Too Large', 'The request is larger than the server is willing or able to process.'];
ReqStatuses['414'] = [414, 'Request-URI Too Long', 'The URI provided was too long for the server to process.'];
ReqStatuses['415'] = [415, 'Unsupported Media Type', 'The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.'];
ReqStatuses['416'] = [416, 'Requested Range Not Satisfiable', 'The client has asked for a portion of the file, but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file.'];
ReqStatuses['417'] = [417, 'Expectation Failed', 'The server cannot meet the requirements of the Expect request-header field.'];
ReqStatuses['418'] = [418, 'I\'m a teapot (RFC 2324)', 'This code was defined in 1998 as one of the traditional IETF April Fools\' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers.'];
ReqStatuses['419'] = [419, 'Authentication Timeout', 'Not a part of the HTTP standard, 419 Authentication Timeout denotes that previously valid authentication has expired. It is used as an alternative to 401 Unauthorized in order to differentiate from otherwise authenticated clients being denied access to specific server resources.'];
ReqStatuses['420'] = [420, 'Enhance Your Calm (Twitter)', 'Not part of the HTTP standard, but returned by the Twitter Search and Trends API when the client is being rate limited. Other services may wish to implement the 429 Too Many Requests response code instead.'];
ReqStatuses['422'] = [422, 'Unprocessable Entity (WebDAV; RFC 4918)', 'The request was well-formed but was unable to be followed due to semantic errors.'];
ReqStatuses['423'] = [423, 'Locked (WebDAV; RFC 4918)', 'The resource that is being accessed is locked.'];
ReqStatuses['424'] = [424, 'Failed Dependency (WebDAV; RFC 4918)', 'The request failed due to failure of a previous request (e.g. a PROPPATCH).'];
ReqStatuses['424'] = [424, 'Method Failure (WebDAV)', 'Indicates the method was not executed on a particular resource within its scope because some part of the method\'s execution failed causing the entire method to be aborted.'];
ReqStatuses['425'] = [425, 'Unordered Collection (Internet draft)', 'Defined in drafts of "WebDAV Advanced Collections Protocol", but not present in "Web Distributed Authoring and Versioning (WebDAV) Ordered Collections Protocol".'];
ReqStatuses['426'] = [426, 'Upgrade Required (RFC 2817)', 'The client should switch to a different protocol such as TLS/1.0.'];
ReqStatuses['428'] = [428, 'Precondition Required (RFC 6585)', 'The origin server requires the request to be conditional. Intended to prevent "the \'lost update\' problem, where a client GETs a resource\'s state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict."'];
ReqStatuses['429'] = [429, 'Too Many Requests (RFC 6585)', 'The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.'];
ReqStatuses['431'] = [431, 'Request Header Fields Too Large (RFC 6585)', 'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.'];
ReqStatuses['444'] = [444, 'No Response (Nginx)', 'Used in Nginx logs to indicate that the server has returned no information to the client and closed the connection (useful as a deterrent for malware).'];
ReqStatuses['449'] = [449, 'Retry With (Microsoft)', 'A Microsoft extension. The request should be retried after performing the appropriate action.\r\nOften search-engines or custom applications will ignore required parameters. Where no default action is appropriate, the Aviongoo website sends a "HTTP/1.1 449 Retry with valid parameters: param1, param2, . . ." response. The applications may choose to learn, or not.'];
ReqStatuses['450'] = [450, 'Blocked by Windows Parental Controls (Microsoft)', 'A Microsoft extension. This error is given when Windows Parental Controls are turned on and are blocking access to the given webpage.'];
ReqStatuses['451'] = [451, 'Unavailable For Legal Reasons (Internet draft)', 'Defined in the internet draft "A New HTTP Status Code for Legally-restricted Resources". Intended to be used when resource access is denied for legal reasons, e.g. censorship or government-mandated blocked access. A reference to the 1953 dystopian novel Fahrenheit 451, where books are outlawed.'];
//ReqStatuses['451'] = [451 , 'Redirect (Microsoft)', 'Used in Exchange ActiveSync if there either is a more efficient server to use or the server can\'t access the users mailbox.\r\nThe client is supposed to re-run the HTTP Autodiscovery protocol to find a better suited server.'];
ReqStatuses['494'] = [494, 'Request Header Too Large (Nginx)', 'Nginx internal code similar to 413 but it was introduced earlier.'];
ReqStatuses['495'] = [495, 'Cert Error (Nginx)', 'Nginx internal code used when SSL client certificate error occurred to distinguish it from 4XX in a log and an error page redirection.'];
ReqStatuses['496'] = [496, 'No Cert (Nginx)', 'Nginx internal code used when client didn\'t provide certificate to distinguish it from 4XX in a log and an error page redirection.'];
ReqStatuses['497'] = [497, 'HTTP to HTTPS (Nginx)', 'Nginx internal code used for the plain HTTP requests that are sent to HTTPS port to distinguish it from 4XX in a log and an error page redirection.'];
ReqStatuses['499'] = [499, 'Client Closed Request (Nginx)', 'Used in Nginx logs to indicate when the connection has been closed by client while the server is still processing its request, making server unable to send a status code back.'];
ReqStatuses['5'] = [5, 'Server Error', 'Response status codes beginning with the digit "5" indicate cases in which the server is aware that it has encountered an error or is otherwise incapable of performing the request. Except when responding to a HEAD request, the server should include an entity containing an explanation of the error situation, and indicate whether it is a temporary or permanent condition. Likewise, user agents should display any included entity to the user. These response codes are applicable to any request method.'];
ReqStatuses['500'] = [500, 'Internal Server Error', 'A generic error message, given when no more specific message is suitable.'];
ReqStatuses['501'] = [501, 'Not Implemented', 'The server either does not recognize the request method, or it lacks the ability to fulfil the request.'];
ReqStatuses['502'] = [502, 'Bad Gateway', 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.'];
ReqStatuses['503'] = [503, 'Service Unavailable', 'The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.'];
ReqStatuses['504'] = [504, 'Gateway Timeout', 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.'];
ReqStatuses['505'] = [505, 'HTTP Version Not Supported', 'The server does not support the HTTP protocol version used in the request.'];
ReqStatuses['506'] = [506, 'Variant Also Negotiates (RFC 2295)', 'Transparent content negotiation for the request results in a circular reference.'];
ReqStatuses['507'] = [507, 'Insufficient Storage (WebDAV; RFC 4918)', 'The server is unable to store the representation needed to complete the request.'];
ReqStatuses['508'] = [508, 'Loop Detected (WebDAV; RFC 5842)', 'The server detected an infinite loop while processing the request (sent in lieu of 208).'];
ReqStatuses['509'] = [509, 'Bandwidth Limit Exceeded (Apache bw/limited extension)', 'This status code, while used by many servers, is not specified in any RFCs.'];
ReqStatuses['510'] = [510, 'Not Extended (RFC 2774)', 'Further extensions to the request are required for the server to fulfil it.'];
ReqStatuses['511'] = [511, 'Network Authentication Required (RFC 6585)', 'The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network (e.g. "captive portals" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot).'];
ReqStatuses['598'] = [598, 'Network read timeout error (Unknown)', 'This status code is not specified in any RFCs, but is used by Microsoft HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.'];
ReqStatuses['599'] = [599, 'Network connect timeout error (Unknown)', 'This status code is not specified in any RFCs, but is used by Microsoft HTTP proxies to signal a network connect timeout behind the proxy to a client in front of the proxy.;'];



(function () {
    this.getRequestStatus = function (statusCode) {
        var lib = Broadlook.Library;

        var reqStatus = ReqStatuses[statusCode.toString()];
        if (reqStatus != null) { return reqStatus; }
        else {
            reqStatus = ReqStatuses[Math.floor(statusCode / 100).toString()];
            if (reqStatus != null) { return reqStatus; }
            else { return null; }
        }
        return null;
    },
    this.getRequestStatusTitle = function (statusCode) {
        var lib = Broadlook.Library;

        var reqStatus = lib.getRequestStatus(statusCode);
        if (reqStatus != null) { return reqStatus[1]; }
        else { return 'Unknown Status'; }
    },
    this.getRequestStatusDescription = function (statusCode) {
        var lib = Broadlook.Library;

        var reqStatus = lib.getRequestStatus(statusCode);
        if (reqStatus != null) { return reqStatus[2]; }
        else { return 'Unknown Status'; }
    },
    this.getFieldLabel = function (entity, field) {

        var label = field;




        if (field == "FirstName") label = "First Name";
        else if (field == "CompanyName") label = "Company Name";
        else if (field == "MiddleName") label = "Middle Name";
        else if (field == "FullName") label = "Full Name";
        else if (field == "LastName") label = "Last Name";
        else if (field == "JobTitle") label = "Job Title";
        else if (field == "Telephone1") label = "Phone 1";
        else if (field == "Telephone2") label = "Phone2";
        else if (field == "MobilePhone") label = "MobilePhone";
        else if (field == "EMailAddress1") label = "Email";
        else if (field == "Address1_Line1") label = "Address 1";
        else if (field == "Address1_Line2") label = "Address 2";
        else if (field == "Address1_City") label = "City";
        else if (field == "Address1_StateOrProvince") label = "State";
        else if (field == "Address1_PostalCode") label = "ZIP";
        else if (field == "Address1_Country") label = "Country";
        else if (field == "blt_linkedin") label = "LinkedIn";
        else if (field == "blt_facebook") label = "Facebook";
        else if (field == "blt_googleplus") label = "Google+";
        else if (field == "blt_twitter") label = "Twitter";
        else if (field == "blt_skype") label = "Skype"; // not a field 

        else if (field == "blt_socl") label = "So.cl";
        else if (field == "blt_blog") label = "Blog";
        else if (field == "blt_youtube") label = "YouTube";
        else if (field == "blt_xing") label = "Xing";
        else if (field == "blt_quora") label = "Quora";

        else if (field == "blt_slideshare") label = "SlideShare";
        else if (field == "blt_reddit") label = "Reddit";
        else if (field == "blt_stumbleupon") label = "StumbleUpon";
        else if (field == "blt_digg") label = "Digg";
        else if (field == "blt_pinterest") label = "Pinterest";



        return label;

    }
    this.getLocalizedFieldLabel = function (LogicalName, Guid, FieldName, Callback, Reference) {
        var requestMain = ""
        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"b:RetrieveLocLabelsRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>AttributeName</c:key>";
        requestMain += "            <c:value i:type=\"d:string\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">" + FieldName + "</c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>EntityMoniker</c:key>";
        requestMain += "            <c:value i:type=\"a:EntityReference\">";
        requestMain += "              <a:Id>" + Guid + "</a:Id>";
        requestMain += "              <a:LogicalName>" + LogicalName + "</a:LogicalName>";
        requestMain += "              <a:Name i:nil=\"true\" />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>IncludeUnpublished</c:key>";
        requestMain += "            <c:value i:type=\"d:boolean\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">" + "false" + "</c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>RetrieveLocLabels</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";

        var req = lib.createXmlHttpRequest();

        req.open("POST", Broadlook.Library.getOrgServiceUrl(), true)

        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");

        //var successCallback = null;

        //if (!errorCallback)
        //    errorCallback = Broadlook.Library.showError;

        req.onreadystatechange = function () { Broadlook.Library.getLocalizedFieldLabelCallback(req, Callback, Reference); };
        req.send(requestMain);
    }
    this.getLocalizedFieldLabelCallback = function (Response, Callback, Reference) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var result = Response.responseXML;
                alert(Response.responseText);
                var fieldLabel = result.getElementsByTagName("c:Label")[0].getElementsByTagName("c:UserLocalizedLabel")[0].getElementsByTagName("c:Label")[0].childNodes[0];
                //Label (Label)
                //UserLocalizedLabel (LocalizedLabel)
                //Label (string)
                //alert(fieldLabel);
                if (Callback != null)
                    Callback(fieldLabel, Reference, null)
            }
            else {
                var error = Broadlook.Library.getServiceError(req.responseXML);
                alert(error);
                alert(Response.responseText);
                if (Callback != null)
                    Callback(false, Reference, error)
            }
        }
    }

    this.retrieveNextPage = function (response, callback) { //ownerPartialCallback

        // Unified logic

        var lib = Broadlook.Library;
        if (typeof (response) === "undefined" || response === null) response = [];

        var nextUri = response.__next; // ms

        if (typeof (nextUri) != 'undefined')
            lib.retrieveRecordsWithPath(nextUri, function (response2) {
                if (typeof (callback) != 'undefined')
                    callback(response2);
                lib.retrieveNextPage(response2, callback);
            });
        else {
            if (typeof (callback) != 'undefined')
                callback(null);
        }
        //        var rows = response.records; //sf
        //        if (typeof (rows) == 'undefined') rows = response.results; // ms 

        //        if (rows && rows.length > 0)
        //            lib.convertParams.ownerRecords = lib.convertParams.ownerRecords.concat(rows);

        //        var nextUri = response.__next; // ms

        //        if (typeof (nextUri) != 'undefined')
        //            lib.retrieveRecordsWithPath(nextUri, lib.ownerPartialCallback);
        //        else
        //            lib.ownerCallback(lib.convertParams.ownerRecords);

    }


    /******************************************************************************************

    Workflows

    ******************************************************************************************/



    this.callOnDemandWF = function (workflowId, entityIds, entityTypeCode, callback) {

        var lib = Broadlook.Library;

        if (lib.demo) {
            lib.showError("Not supported operation in DEMO mode");
            if (lib.nz(callback))
                callback(true);
            return;
        }


        var a = [];

        //if (entityIds instanceof Array) a = entityIds;
        //if (typeof entityIds == 'array') a = entityIds;
        //if (Object.prototype.toString.call(entityIds) == '[object Array]') a = entityIds;
        if (Array.isArray(entityIds)) a = entityIds;
        else {
            if (('' + entityIds).indexOf(';') >= 0)
                a = entityIds.split(';')
            else
                a.push(entityIds);
        };

        if (lib.z(a[a.length - 1])) a.pop(); // remove the last one if it is empty

        //var sIds = String(entityIds); 
        var sIds = a.join(';');
        if (sIds[sIds.length - 1] != ';') sIds += ';';

        var sEntityTypeCode = entityTypeCode;

        var sWorkflowId = workflowId;
        var iWindowPosX = 500;

        if (lib.z(entityTypeCode))
            entityTypeCode = lib.entityTypeCode;

        if (lib.z(entityTypeCode)) {
            lib.showError("Cannot determine the Entity Type Code");
            return;
        }

        var iWindowPosY = 200;

        //window.open(url, "", "status=no,scrollbars=no,toolbars=no,menubar=no,location=no");

        var oResult = openStdDlg(prependOrgName("/_grid/cmds/dlg_runworkflow.aspx") + "?iObjType=" + CrmEncodeDecode.CrmUrlEncode(sEntityTypeCode) + "&iTotal=" +
	    CrmEncodeDecode.CrmUrlEncode(a.length) + "&wfId=" + CrmEncodeDecode.CrmUrlEncode(sWorkflowId) + "&sIds=" + CrmEncodeDecode.CrmUrlEncode(sIds), a, iWindowPosX, iWindowPosY);

        if (lib.nz(callback))
            callback(oResult);

    }


    //SF: this.transformOwnerRecord = function(nativeRecord) { return { Id = nativeRecord.Id, Name = nativeRecord.Name; };  }

    /******************************************************************************************

    CRM User

    ******************************************************************************************/


    this.retrieveUsers = function (callback) {

        var lib = Broadlook.Library;

        if (lib.demo) {

            var arr = [];

            for (var i = 0; i < 12; i++) {

                var acc = new Object;
                acc.FullName = "Demo User " + i;
                acc.SystemUserId = "ID" + i;

                arr.push(acc);
            }

            var res = new Object;
            res.results = arr;


            if (lib.nz(callback))
                callback(res);

            return;
        }

        var path = lib.ODataPath + "/SystemUserSet?$select=SystemUserId,FullName&$orderby=FullName&$filter=IsDisabled eq false and AccessMode/Value eq 0";

        var req = lib.createXmlHttpRequest();
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            Broadlook.Library.retrieveRecordCallBack(this, callback);
        };
        req.send();
    }

    this.virtualizeOwnerRecords = function (nativeRecords) {

        var virtualRecords = [];

        if (!nativeRecords || !nativeRecords.results || nativeRecords.results == 0) {
            //virtualRecords = null;
        }
        else {
            var i = 0;
            var len = nativeRecords.results.length;
            while (i < len) {

                var virtualRecord = Broadlook.Library.transformOwnerRecord(nativeRecords.results[i]);
                virtualRecords.push(virtualRecord);

                i++;
            }
        }

        return virtualRecords;
    }

    this.transformOwnerRecord = function (nativeRecord) {
        var virtualRecord =
            {
                Id: nativeRecord.SystemUserId.replace('{', '').replace('}', '').toLowerCase(),
                Name: nativeRecord.FullName
            };

        return virtualRecord;
    }

    this.getUser = function () {
        ///<summary>
        /// get logged in user
        ///</summary>

        var User = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            User = context.getUserId();
        }
        else {
            if (typeof Xrm.Page.context == "object") {
                User = Xrm.Page.context.getUserId();
            }
            else { throw new Error("Unable to access the UserId"); }
        }

        return User;
    }

    this.getOrg = function () {
        ///<summary>
        /// get organisation
        ///</summary>

        var Org = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            Org = context.getOrgUniqueName();
        }
        else {
            if (typeof Xrm.Page.context == "object") {
                Org = Xrm.Page.context.getOrgUniqueName();
            }
            else { throw new Error("Unable to access Organisation name"); }
        }

        return Org;
    }

    //    this.callDialog = function () {
    //        var url="/" + getOrg() + "/cs/dialog/rundialog.aspx?DialogId=%7bB7D825D7-7EF6-4713-AC11-284546FEB260%7d&EntityName=systemuser&ObjectId=" + getUser();
    //        window.open(url, "", "status=no,scrollbars=no,toolbars=no,menubar=no,location=no");
    //        //window.open(url);
    //    }

    /******************************************************************************************

    CRM Account

    ******************************************************************************************/


    this.createAccountRecord = function (company, callback) {
        var lib = Broadlook.Library;
        var account = new Object();

        if (company != null) {
            account.Name = company.companyname;
            account.WebSiteURL = company.website;
            account.Address1_Line1 = company.address_line1;
            account.Address1_Line2 = company.address_line2;
            account.Address1_City = company.address_city;
            account.Address1_StateOrProvince = company.address_stateorprovince;
            account.Address1_PostalCode = company.address_postalcode;

            if (company.id) {
                account.blt_profilercompanyid = new Object;
                account.blt_profilercompanyid.Id = company.id;
                account.blt_profilercompanyid.LogicalName = Broadlook.Metadata.Entities.ProfilerCompany.Name;
            }
        }

        var jsonAccount = window.JSON.stringify(account);

        var createAccountReq = lib.createXmlHttpRequest();
        createAccountReq.open("POST", Broadlook.Library.ODataPath + "/AccountSet", true);
        createAccountReq.setRequestHeader("Accept", "application/json");
        createAccountReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        createAccountReq.onreadystatechange = function () {
            Broadlook.Library.createAccountReqCallBack(this, callback);
        };
        createAccountReq.send(jsonAccount);
    }

    this.createAccountReqCallBack = function (createAccountReq, callback) {
        if (createAccountReq.readyState == 4) {
            if (createAccountReq.status == 201) {
                //Success
                var newAccount = JSON.parse(createAccountReq.responseText).d;

                if (typeof (callback) != 'undefined' && callback != null)
                    callback(newAccount.AccountId);

            }
            else {
                //Failure
                Broadlook.Library.errorHandler(createAccountReq);

                if (typeof (callback) != 'undefined' && callback != null)
                    callback(false);
            }
        }
    }

    this.retrieveAccountRecords = function (searchstring, callback) {
        var lib = Broadlook.Library;
        if (lib.demo) {

            var arr = [];

            for (var i = 0; i < 12; i++) {

                var acc = new Object;
                acc.Name = searchstring + " " + i;
                acc.AccountId = "ID" + i;

                arr.push(acc);
            }

            var res = new Object;
            res.results = arr;

            if (lib.nz(callback))
                callback(res);

            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/AccountSet?$filter=substringof('" + escape(searchstring.replace(/'/g, "''")) + "',Name) and StateCode/Value eq 0&$select=Name,AccountId,Address1_StateOrProvince,Address1_City&$orderby=Name,Address1_City";
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            Broadlook.Library.retrieveRecordCallBack(this, callback);
        };
        req.send();

    }

    this.virtualizeAccountRecords = function (nativeRecords) {

        var virtualRecords = [];

        if (!nativeRecords || !nativeRecords.results || nativeRecords.results == 0) {
            //virtualRecords = null;
        }
        else {
            var i = 0;
            var len = nativeRecords.results.length;
            while (i < len) {

                var virtualRecord = Broadlook.Library.transformAccountRecord(nativeRecords.results[i]);
                virtualRecords.push(virtualRecord);

                i++;
            }
        }

        return virtualRecords;
    }

    this.transformAccountRecord = function (nativeRecord) {
        var virtualRecord =
            {
                Id: nativeRecord.AccountId.replace('{', '').replace('}', '').toLowerCase(),
                Name: nativeRecord.Name,
                City: nativeRecord.Address1_City,
                State: nativeRecord.Address1_StateOrProvince
            };

        return virtualRecord;
    }


    /******************************************************************************************

    CRM Contact

    ******************************************************************************************/

    this.createContact = function (gridrow, company, accountid, callback, callbackparam) {

        var lib = Broadlook.Library;

        var record = new Object();

        var fixstr = function (s, n) {
            return (s ? s : '').slice(0, n);
        }

        record.FirstName = fixstr(gridrow.firstname, 50);
        record.MiddleName = fixstr(gridrow.middlename, 50);
        record.LastName = fixstr(gridrow.lastname, 50);
        record.JobTitle = fixstr(gridrow.title, 100);
        record.EMailAddress1 = fixstr(gridrow.email, 100);
        record.Telephone1 = fixstr(gridrow.phone, 50);
        record.Telephone2 = fixstr(gridrow.phone2, 50);
        record.WebSiteUrl = fixstr((company ? company.website : ''), 200);
        record.Description = fixstr(gridrow.bio, 2000);

        if (gridrow.city && gridrow.state) {
            record.Address1_City = fixstr(gridrow.city, 80);
            record.Address1_StateOrProvince = fixstr(gridrow.state, 50);

            // add street address from the company -- only if city and state are the same
            if (company)
                if (record.Address1_City == fixstr(company.address_city, 80) && record.Address1_PostalCode == fixstr(company.address_postalcode, 20)) {
                    record.Address1_Line1 = fixstr(company.address_line1, 250);
                    record.Address1_Line2 = fixstr(company.address_line2, 250);
                    record.Address1_StateOrProvince = fixstr(company.address_stateorprovince, 50);
                }
        }
        else if (company) {
            record.Address1_Line1 = fixstr(company.address_line1, 250);
            record.Address1_Line2 = fixstr(company.address_line2, 250);
            record.Address1_City = fixstr(company.address_city, 80);
            record.Address1_StateOrProvince = fixstr(company.address_stateorprovince, 50);
            record.Address1_PostalCode = fixstr(company.address_postalcode, 20);
        }

        if (lib.nz(accountid)) {
            record.ParentCustomerId = new Object;
            record.ParentCustomerId.Id = accountid;
            record.ParentCustomerId.LogicalName = 'account';
        }

        var packedparam = { "gridrow": gridrow, "callbackparam": callbackparam };
        lib.createRecord(record, 'Contact', callback, packedparam);

    }

    this.retrieveContactRecords = function (entityname, searchstring, fieldname, callback) {
        // entityname: Contact            
        // searchstring: smith
        //FullName


        if (Broadlook.Library.demo) {

            var arr = [];

            for (var i = 0; i < 12; i++) {

                var acc = new Object;
                acc.FullName = searchstring + " " + i;
                acc.ContactId = "ID" + i;

                arr.push(acc);
            }

            var res = new Object;
            res.results = arr;

            if (Broadlook.Library.nz(callback))
                callback(res);

            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = Broadlook.Library.ODataPath + "/ContactSet?$filter=substringof('" + escape(searchstring.replace(/'/g, "''")) + "'," + fieldname + ") and StateCode/Value eq 0&$select=ContactId,FullName,EmailAddress,Address1_StateOrProvince,Address1_City&$orderby=FullName,Address1_City";
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            Broadlook.Library.retrieveRecordCallBack(this, callback);
        };
        req.send();

    }

    this.retrieveRegistrationId = function (callback) {
        var lib = Broadlook.Library;

        if (lib.demo && !lib.ODataPath) {
            callback(false);
            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/blt_broadlookregistrationSet?$select=blt_broadlookregistrationId&$orderby=CreatedOn";
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            Broadlook.Library.retrieveRecordCallBack(this, callback);
        };
        req.send();
    }

    this.findRecordsBySubstring = function (entityname, substring, searchfield, outputfields, sortfields, callback) {
        // entityname: Contact            
        // substring: smith
        // searchfield: FullName
        // outputfields: ContactId,FullName,EmailAddress,Address1_StateOrProvince,Address1_City
        // sortfields: FullName,Address1_City

        var lib = Broadlook.Library;

        if (lib.demo) {

            var arr = [];

            for (var i = 0; i < 1; i++) {

                var rec = new Object;

                //for (f in outputfields) {

                //    if (outputfields[f] == "ParentCustomerId") {
                //        rec[outputfields[f]] = new Object;
                //        rec[outputfields[f]].Id = "id" + i;
                //        rec[outputfields[f]].Name = "name " + i;
                //    }
                //    else
                //        rec[outputfields[f]] = outputfields[f];

                //    //substring + " " + i;
                //}

                //rec["FullName"] = substring;

                //if (substring == "msmith@broadlook.com") {
                rec["FullName"] = "Mary Smith";
                rec["JobTitle"] = "Sales Manger";
                rec["CompanyName"] = "ABC Company, Incorporated";
                rec["ParentCustomerId"] = new Object;
                rec["ParentCustomerId"].Id = "id" + i;
                rec["ParentCustomerId"].Name = "ABC Company, Incorporated";
                rec["EMailAddress1"] = "msmith@broadlook.com";
                rec["Address1_City"] = "Pewaukee";
                rec["Address1_StateOrProvince"] = "WI";
                //if (typeof rec["ContactId"] != 'undefined')
                rec["ContactId"] = 3000 + i;
                //if (typeof rec["LeadId"] != 'undefined')
                rec["LeadId"] = 4000 + i;
                //}

                rec["CreatedOn"] = new Date(2013, Math.floor((Math.random() * 10) + 1), Math.floor((Math.random() * 30) + 1));
                rec["ModifiedOn"] = new Date(2013, Math.floor((Math.random() * 10) + 1), Math.floor((Math.random() * 30) + 1));

                arr.push(rec);
            }

            var res = new Object;
            res.results = arr;

            if (lib.nz(callback))
                callback(res);

            return;
        }

        var condition = "";
        if (lib.nz(substring) && lib.nz(searchfield))
            condition = "substringof('" + escape(substring.replace(/'/g, "''")) + "'," + searchfield + ") and ";



        var req = lib.createXmlHttpRequest();
        var path = Broadlook.Library.ODataPath + "/" + entityname + "Set?$filter=" + condition + "StateCode/Value eq 0&$select=" + outputfields.join(",") + "&$orderby=" + sortfields.join(",");
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            Broadlook.Library.retrieveRecordCallBack(this, callback);
        };
        req.send();

    }


    this.findRecordsBySubstring2 = function (entityname, substring, searchfield, firstchars2, searchfield2, outputfields, sortfields, callback) {
        // entityname: Contact            
        // substring: smith
        // searchfield: FullName
        // substring: j
        // searchfield: FirstName
        // outputfields: ContactId,FullName,EmailAddress,Address1_StateOrProvince,Address1_City
        // sortfields: FullName,Address1_City
        var lib = Broadlook.Library;

        if (Broadlook.Library.demo) {

            var arr = [];

            for (var i = 0; i < 2; i++) {

                var rec = new Object;

                for (f in outputfields) {

                    if (outputfields[f] == "ParentCustomerId") {
                        rec[outputfields[f]] = new Object;
                        rec[outputfields[f]].Id = "id" + i;
                        rec[outputfields[f]].Name = "name " + i;
                    }
                    else
                        rec[outputfields[f]] = substring + " " + i;
                }

                if (substring == "Smith") {
                    rec["FullName"] = "Mary Smith";
                    rec["JobTitle"] = "Sales Manger";
                    rec["CompanyName"] = "ABC Company, Incorporated";
                    rec["ParentCustomerId"] = new Object;
                    rec["ParentCustomerId"].Id = "id" + i;
                    rec["ParentCustomerId"].Name = "ABC Company, Incorporated";
                    rec["EMailAddress1"] = "msmith@broadlook.com";
                    rec["Address1_City"] = "Pewaukee";
                    rec["Address1_StateOrProvince"] = "WI";
                    if (typeof rec["ContactId"] != 'undefined') rec["ContactId"] = 1000 + i;
                    if (typeof rec["LeadId"] != 'undefined') rec["LeadId"] = 2000 + i;
                }

                arr.push(rec);
            }

            var res = new Object;
            res.results = arr;

            if (Broadlook.Library.nz(callback))
                callback(res);

            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = Broadlook.Library.ODataPath + "/" + entityname + "Set?$filter=" +
        "substringof('" + escape(substring.replace(/'/g, "''")) + "'," + searchfield + ") " +
        "and startswith(" + searchfield2 + ", '" + escape(firstchars2.replace(/'/g, "''")) + "') " +
        "and StateCode/Value eq 0" +
        "&$select=" + outputfields.join(",") + "&$orderby=" + sortfields.join(",");
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            Broadlook.Library.retrieveRecordCallBack(this, callback);
        };
        req.send();

    }


    /******************************************************************************************

    CRM Lead

    ******************************************************************************************/


    this.createLead = function (gridrow, company, callback, callbackparam) {

        var lib = Broadlook.Library;

        var record = new Object();

        var fixstr = function (s, n) {
            return (s ? s : '').slice(0, n);
        }

        record.FirstName = fixstr(gridrow.firstname, 50);       // 50
        record.MiddleName = fixstr(gridrow.middlename, 50);     // 50
        record.LastName = fixstr(gridrow.lastname, 50);         // 50
        record.JobTitle = fixstr(gridrow.title, 100);           // 100
        record.EMailAddress1 = fixstr(gridrow.email, 100);      // 100
        record.Telephone1 = fixstr(gridrow.phone, 50);          // 50
        record.Telephone2 = fixstr(gridrow.phone2, 50);         // 50
        record.CompanyName = fixstr((gridrow.contextcompany ? gridrow.contextcompany : (company ? company.companyname : '')), 100); //100
        record.WebSiteUrl = fixstr((company ? company.website : ''), 200);
        record.Description = fixstr(gridrow.bio, 2000);

        if (gridrow.city && gridrow.state) {
            record.Address1_City = fixstr(gridrow.city, 80);
            record.Address1_StateOrProvince = fixstr(gridrow.state, 50);

            // add street address from the company -- only if city and state are the same
            if (company)
                if (record.Address1_City == fixstr(company.address_city, 80) && record.Address1_PostalCode == fixstr(company.address_postalcode, 20)) {
                    record.Address1_Line1 = fixstr(company.address_line1, 250);
                    record.Address1_Line2 = fixstr(company.address_line2, 250);
                    record.Address1_StateOrProvince = fixstr(company.address_stateorprovince, 50);
                }
        }
        else if (company) {
            record.Address1_Line1 = fixstr(company.address_line1, 250);
            record.Address1_Line2 = fixstr(company.address_line2, 250);
            record.Address1_City = fixstr(company.address_city, 80);
            record.Address1_StateOrProvince = fixstr(company.address_stateorprovince, 50);
            record.Address1_PostalCode = fixstr(company.address_postalcode, 20);
        }

        record.Subject = fixstr('Broadlook Profiler Lead' + (gridrow.name ? ' - ' + gridrow.name : '') + (record.CompanyName ? ' from ' + record.CompanyName : ''), 300); //300

        if (company) {
            record.blt_profilercompanyid = new Object;
            record.blt_profilercompanyid.Id = company.id;
            record.blt_profilercompanyid.LogicalName = Broadlook.Metadata.Entities.ProfilerCompany.Name;
        }

        var packedparam = { "gridrow": gridrow, "callbackparam": callbackparam };

        lib.createRecord(record, 'Lead', callback, packedparam);

    }


    /******************************************************************************************

    Generic Dynamics CRM operations

    ******************************************************************************************/


    this.createLink = function (entity, id) {

        var lib = Broadlook.Library;

        if (typeof (entity) == "undefined" || String(entity) == '') return;

        var url = lib.getServerUrl();
                
        // CRM 2013
        //https://broadlook.crm.dynamics.com/main.aspx?
        //etn=contact&
        //extraqs=etc%3d2%26id%3db947239b-0f38-e311-af5c-6c3be5a8fd08&
        //id=b947239b-0f38-e311-af5c-6c3be5a8fd08&
        //pagetype=entityrecord
        //#988631841
        return url + 'main.aspx?etn=' + String(entity) + '&id=' + String(id) + '&pagetype=entityrecord';
         


        var appendtype = false;

        var entityname = String(entity);

        if (entityname == 'lead') url += 'SFA/leads/edit.aspx';
        else if (entityname == "opportunity") url += "SFA/opps/edit.aspx";
        else if (entityname == "account") url += "SFA/accts/edit.aspx";
        else if (entityname == "contact") url += "SFA/conts/edit.aspx";
        else if (entityname == "incident") url += "CS/cases/edit.aspx";
        else {
            url += "main.aspx";
            appendtype = true;
        }

        url += '?id=';
        url += String(id);

        if (appendtype) {
            url += "&etn=";
            url += entityname;
            url += "&pagetype=entityrecord";
        }

        return url;
    }



    this.retrieveRecord = function (entityname, Id, callback, callbackparam) {

        var lib = Broadlook.Library;

        if (!lib.nz(Id)) {
            lib.showError("Missing parameter - Id")
            callback(false);;
            return;
        }

        if (!lib.nz(entityname)) {
            lib.showMessage("Missing parameter - entityname");
            callback(false);
            return;
        }

        Id = String(Id).replace('{', '').replace('}', '');

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityname + "Set(guid'" + Id + "')";
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.retrieveRecordCallBack(this, callback, callbackparam);
        };
        req.send();

    }

    this.retrieveRecordsByFilter = function (entityname, filter, outputfields, sortfields, callback, callbackparam) {
        //var select = “$select=Name&$top=1&$filter=Name eq ‘swansolutions’”;
        var lib = Broadlook.Library;

        if (!lib.nz(entityname)) {
            lib.showMessage("Missing parameter - entityname");
            callback(false);
            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityname + "Set?";
        if (filter != null) { path += "&$filter=" + filter; }
        if (outputfields != null) { path += "&$select=" + outputfields.join(","); }
        if (sortfields != null) { path += "&$orderby=" + sortfields.join(","); }
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.retrieveRecordCallBack(this, callback, callbackparam);
        };
        req.send();

    }

    this.retrieveRelatedRecords = function (entityname, Id, relationship, callback, callbackparam) {
        //var select = “$select=Name&$top=1&$filter=Name eq ‘swansolutions’”;
        var lib = Broadlook.Library;

        if (!lib.nz(entityname)) {
            lib.showMessage("Missing parameter - entityname");
            callback(false);
            return;
        }
        if (!lib.nz(Id)) {
            lib.showError("Missing parameter - Id")
            callback(false);;
            return;
        }

        if (!lib.nz(relationship)) {
            lib.showError("Missing parameter - relationship")
            callback(false);;
            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityname + "Set(guid'" + Id + "')/" + relationship;
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.retrieveRecordCallBack(this, callback, callbackparam);
        };
        req.send();

    }

    this.retrieveRelatedRecordsByFilter = function (entityname, Id, relationship, filter, outputfields, sortfields, callback, callbackparam) {
        //var select = “$select=Name&$top=1&$filter=Name eq ‘swansolutions’”;

        var lib = Broadlook.Library;

        if (!lib.nz(entityname)) {
            lib.showMessage("Missing parameter - entityname");
            callback(false);
            return;
        }
        if (!lib.nz(Id)) {
            lib.showError("Missing parameter - Id")
            callback(false);;
            return;
        }

        if (!lib.nz(relationship)) {
            lib.showError("Missing parameter - relationship")
            callback(false);;
            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityname + "Set(guid'" + Id + "')/" + relationship + "?";
        if (filter != null) { path += "&$filter=" + filter; }
        if (outputfields != null) { path += "&$select=" + outputfields.join(","); }
        if (sortfields != null) { path += "&$orderby=" + sortfields.join(","); }

        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.retrieveRecordCallBack(this, callback, callbackparam);
        };
        req.send();

    }


    this.retrieveRecords = function (entityname, Ids, callback, callbackparam) {

        var lib = Broadlook.Library;

        if (typeof (Ids) == "undefined") {
            lib.showError("Missing parameter -  Ids");
            callback(false);
            return;
        }

        if (typeof (entityname) == "undefined") {
            lib.showError("Missing parameter - entityname");
            callback(false);
            return;
        }

        if (entityname == "lead") entityname = "Lead";
        if (entityname == "contact") entityname = "Contact";
        if (entityname == "account") entityname = "Aoccount";

        var ids = [];

        if (typeof (Ids) == "string")
            ids = Ids.split(';');
        else
            ids = Ids;


        if (lib.demo) {
            var demorecords = new Object;
            demorecords.results = [];

            for (var i = 0; i < ids.length; i++) {
                var demorec = [];

                var id = ids[i];

                if (entityname == 'lead')
                    demorec["LeadId"] = id;
                else
                    demorec["ContactId"] = id;

                demorec["FirstName"] = "Mary " + id;
                demorec["LastName"] = "Smith " + id;

                demorecords.results.push(demorec);
            }

            callback(demorecords);
            return;
        }



        var filterarray = [];
        var i = ids.length;
        while (i--) {
            //for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            if (lib.z(id)) continue;
            //if (filter != "") filter += " or ";
            id = id.replace('{', '').replace('}', '');

            filterarray.push(entityname + "Id eq guid'" + id + "'");
            //filter += entityname + "Id eq guid'" + id + "'";
        }

        var filter = filterarray.join(' or ');


        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityname + "Set?" + "$filter=" + filter + "&$top=5000" + "";
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.retrieveRecordCallBack(this, callback, callbackparam);
        };
        req.send();

    }


    this.retrieveAllRecords = function (entityname, callback, callbackparam) {

        var lib = Broadlook.Library;

        if (typeof (entityname) == "undefined") {
            lib.showError("Missing parameter - entityname");
            callback(false);
            return;
        }

        if (lib.demo) {
            var demorecords = new Object;
            demorecords.results = [];

            var demorec = [];

            if (entityname == 'Lead')
                demorec["LeadId"] = "lead123";
            else
                demorec["ContactId"] = "contact123";

            demorec["FirstName"] = "Mary";
            demorec["LastName"] = "Smith";

            demorecords.results[0] = demorec;

            callback(demorecords);
            return;
        }

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityname + "Set";
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.retrieveRecordCallBack(this, callback, callbackparam);
        };
        req.send();

    }




    this.retrieveRecordsWithPath = function (path, callback, callbackparam) {

        var lib = Broadlook.Library;

        if (typeof (path) == "undefined") {
            lib.showMessage("'path' argument is empty");
            if (typeof (callback) != 'undefined' && callback != null)
                callback(false);
            return;
        }

        var req = lib.createXmlHttpRequest();
        req.open("GET", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.retrieveRecordCallBack(this, callback, callbackparam);
        };
        req.send();
    }




    this.retrieveRecordCallBack = function (req, callback, callbackparam) {

        var lib = Broadlook.Library;

        if (req.readyState == 4 /* complete */) {
            this.onreadystatechange = null; //avoids memory leaks
            if (req.status == 200) {
                //Success
                var retrievedRecord = null;

                try {
                    retrievedRecord = JSON.parse(req.responseText).d;

                }
                catch (err) {

                    var errortext = lib.extractCrmError(req.responseText);

                    if (lib.nz(errortext))
                        lib.showError(errortext);
                    else
                        lib.errorHandler(err);

                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(false, callbackparam, null);

                }

                if (typeof (callback) != 'undefined' && callback != null)
                    callback(retrievedRecord, callbackparam, null);


            }
            else {
                //Failure
                var msg = lib.errorHandler(req);
                var error = new Object();
                try { error = JSON.parse(req.responseText).error; }
                catch (e) { error = new Object(); error.code = 0; error.message = new Object(); error.message.lang = 'en-us'; error.message.value = (msg.length > 0 ? msg : e.message); }
                error.ReqStatus = req.status;

                if (typeof (callback) != 'undefined' && callback != null)
                    callback(false, callbackparam, error);
            }
        }
    }




    this.createRecord = function (record, entityName, callback, callbackparam) {
        var lib = Broadlook.Library;

        if (lib.demo) {
            var newRecord = new Object;
            newRecord.Id = 1;
            newRecord.LeadId = 1;
            newRecord.ContactId = 1;
            newRecord.FullName = 'John Smith';
            newRecord.Subject = 'John Smith';
            newRecord.__metadata = new Object;
            newRecord.__metadata.type == "Microsoft.Crm.Sdk.Data.Services." + entityName;
            if (lib.nz(callback))
                callback(newRecord, callbackparam);
            return;
        }

        var jsonRecord = window.JSON.stringify(record);

        var createReq = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityName + "Set";
        createReq.open("POST", path, true);
        createReq.setRequestHeader("Accept", "application/json");
        createReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        createReq.onreadystatechange = function () {
            lib.createReqCallBack(this, callback, callbackparam);
        };
        createReq.send(jsonRecord);
    }




    this.createReqCallBack = function (req, callback, callbackparam) {
        var lib = Broadlook.Library;
        if (req.readyState == 4 /* complete */) {
            this.onreadystatechange = null; //avoids memory leaks
            if (req.status == 201) {
                //Success
                try {
                    var newRecord = JSON.parse(req.responseText).d;
                }
                catch (err) {

                    var errortext = lib.extractCrmError(req.responseText);

                    if (lib.nz(errortext))
                        lib.showError(errortext);
                    else
                        lib.errorHandler(err);

                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(false, callbackparam, null);

                }
                if (typeof (callback) != 'undefined' && callback != null)
                    callback(newRecord, callbackparam, null);
            }
            else {
                //Failure
                var msg = lib.errorHandler(req);
                var error = new Object();
                try { error = JSON.parse(req.responseText).error; }
                catch (e) { error = new Object(); error.code = 0; error.message = new Object(); error.message.lang = 'en-us'; error.message.value = (msg.length > 0 ? msg : e.message); }
                error.ReqStatus = req.status;

                if (typeof (callback) != 'undefined' && callback != null)
                    callback(false, callbackparam, error);
            }
        }
    }


    this.deleteRecord = function (id, entityName, callback, callbackparam) {
        var lib = Broadlook.Library;

        if (lib.demo) {
            if (lib.nz(callback))
                callback(id, callbackparam);
            return;
        }

        //var jsonRecord = window.JSON.stringify(record);

        var req = lib.createXmlHttpRequest();
        var path = lib.ODataPath + "/" + entityName + "Set(guid'" + id + "')";
        req.open("POST", path, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("X-HTTP-Method", "DELETE");
        //createReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            lib.deleteReqCallBack(this, id, callback, callbackparam);
        };
        req.send();
    }


    this.deleteReqCallBack = function (req, id, callback, callbackparam) {
        var lib = Broadlook.Library;
        if (req.readyState == 4 /* complete */) {
            //if (req.status == 201) {
            if (req.status == 204 || req.status == 1223) {
                //Success
                try {
                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(id, callbackparam, null);
                }
                catch (err) {

                    var errortext = lib.extractCrmError(req.responseText);

                    if (lib.nz(errortext))
                        lib.showError(errortext);
                    else
                        lib.errorHandler(err);

                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(false, callbackparam, null);

                }
            }
            else {
                //Failure
                var msg = lib.errorHandler(req);
                var error = new Object();
                try { error = JSON.parse(req.responseText).error; }
                catch (e) { error = new Object(); error.code = 0; error.message = new Object(); error.message.lang = 'en-us'; error.message.value = (msg.length > 0 ? msg : e.message); }
                error.ReqStatus = req.status;

                if (typeof (callback) != 'undefined' && callback != null)
                    callback(false, callbackparam, error);
            }
        }
    }


    this.updateRecord = function (entityname, recordid, requestedchanges, callback, callbackparam) {
        var lib = Broadlook.Library;
        if (lib.demo) {

            lib.showError("Update opertaion is not supported in DEMO mode");
            if (lib.nz(callback))
                callback(true);

            return;

        }

        var req = lib.createXmlHttpRequest();
        var changes = new Object();

        var i = requestedchanges.length;
        while (i--)  //for (var i = 0; i < requestedchanges.length; i++) {
            changes[requestedchanges[i].fieldname] = requestedchanges[i].value;

        req.open("POST", lib.ODataPath + "/" + entityname + (entityname.indexOf('Set/') >= 0 || entityname.indexOf('Set(') >= 0 || entityname.indexOf('Set') == entityname.length - 4 ? '' : 'Set' + "(guid'" + recordid + "')"), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("X-HTTP-Method", "MERGE");
        req.onreadystatechange = function () {
            lib.updateReqCallBack(this, callback, true, callbackparam);
        };
        req.send(JSON.stringify(changes));

    }



    this.updateReqCallBack = function (updateAccountReq, callback, last, callbackparam) {
        var lib = Broadlook.Library;
        if (updateAccountReq.readyState == 4 /* complete */) {
            this.onreadystatechange = null; //avoids memory leaks
            //There appears to be an issue where IE maps the 204 status to 1223 when no content is returned.
            if (updateAccountReq.status == 204 || updateAccountReq.status == 1223 || updateAccountReq.status == 0) {
                //Success
                if (last)
                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(true, callbackparam, null);
            }
            else {
                //Failure
                var msg = lib.errorHandler(updateAccountReq);
                var error = new Object();
                try { error = JSON.parse(updateAccountReq.responseText).error; }
                catch (e) { error = new Object(); error.code = 0; error.message = new Object(); error.message.lang = 'en-us'; error.message.value = (msg.length > 0 ? msg : e.message); }
                error.ReqStatus = updateAccountReq.status;

                if (last)
                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(false, callbackparam, error);
            }
        }
    }

    this.SetState = function (entityName, id, stateCode, statusCode, callback, callbackParam) {
        var lib = Broadlook.Library;
        ///<summary>
        /// Sends synchronous/asynchronous request to setState of a record.
        ///</summary>
        ///<param name="entityName" type="String">
        /// A JavaScript String corresponding to the Schema name of
        /// entity that is used for setState operations.
        /// </param>
        ///<param name="id" type="String">
        /// A JavaScript String corresponding to the GUID of
        /// entity that is used for setState operations.
        /// </param>
        ///<param name="stateCode" type="Int">
        /// A JavaScript Integer corresponding to the value of
        /// entity state that is used for setState operations.
        /// </param>
        ///<param name="statusCode" type="Int">
        /// A JavaScript Integer corresponding to the value of
        /// entity status that is used for setState operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var request = [
        "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>",
            "<soap:Body>",
                "<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>",
                  "<request i:type='b:SetStateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
                    "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
                        "<a:KeyValuePairOfstringanyType>",
                            "<c:key>EntityMoniker</c:key>",
                            "<c:value i:type='a:EntityReference'>",
                              "<a:Id>", id, "</a:Id>",
                              "<a:LogicalName>", entityName, "</a:LogicalName>",
                              "<a:Name i:nil='true' />",
                            "</c:value>",
                          "</a:KeyValuePairOfstringanyType>",
                          "<a:KeyValuePairOfstringanyType>",
                            "<c:key>State</c:key>",
                            "<c:value i:type='a:OptionSetValue'>",
                              "<a:Value>", stateCode.toString(), "</a:Value>",
                            "</c:value>",
                          "</a:KeyValuePairOfstringanyType>",
                          "<a:KeyValuePairOfstringanyType>",
                            "<c:key>Status</c:key>",
                            "<c:value i:type='a:OptionSetValue'>",
                              "<a:Value>", statusCode.toString(), "</a:Value>",
                            "</c:value>",
                          "</a:KeyValuePairOfstringanyType>",
                    "</a:Parameters>",
                    "<a:RequestId i:nil='true' />",
                    "<a:RequestName>SetState</a:RequestName>",
                "</request>",
                "</Execute>",
            "</soap:Body>",
        "</soap:Envelope>"
        ].join("");

        var async = !!callback;

        var req = lib.createXmlHttpRequest();


        req.open("POST", lib.getOrgServiceUrl(), true)

        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");

        //var successCallback = null;

        if (!callback)
            callback = lib.showError;

        req.onreadystatechange = function () { Broadlook.Library.SetStateResponse(req, callback, true, callbackParam); };
        req.send(request);

    };

    this.SetStateResponse = function (req, callback, last, callbackparam) {
        var lib = Broadlook.Library;
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (last)
                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(true, callbackparam);
            }
            else {
                //Failure
                lib.errorHandler(req);
                if (last)
                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(false, callbackparam);
            }
        }
    }

    this.getServerUrl = function () {
        // Returns CRM server URL with ending slash 

        var serverUrl = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            serverUrl = context.getServerUrl();
        }
        else {
            if (typeof Xrm != "undefined") // not local
                if (typeof Xrm.Page.context == "object") {
                    serverUrl = Xrm.Page.context.getServerUrl();
                }
                else {
                    throw new Error("Unable to access the server URL");
                }
        }

        if (location.hostname == 'localhost') {
            // we are on the server and reported server name may not work
            var p = location.pathname.indexOf('/%');
            if (p > 0) {
                var orgname = location.pathname.substring(0, p);
                orgname = orgname.replace(/\//g, '');
                if (orgname != null && orgname.length > 0) {
                    serverUrl = location.protocol + '//' + location.host + '/' + orgname;
                }
            }
        }

        // remove all slashes
        while (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }

        // add one slash
        if (serverUrl.substring(serverUrl.length - 1) != '/') serverUrl = serverUrl + '/';

        return serverUrl;
    }


    this.getOrgServiceUrl = function () {
        /// Returns the URL for the SOAP endpoint using the context information available in the form
        /// or HTML Web resource.
        var lib = Broadlook.Library;
        var serverUrl = lib.getServerUrl();
        //while (serverUrl.match(/\/$/)) {
        //    serverUrl = serverUrl.substring(0, serverUrl.length - 1);

        return serverUrl + "XRMServices/2011/Organization.svc/web";
    }


    this.AssignRequest = function (systemuserid, entityid, entitytypename, successCallback, errorCallback) {
        // systemuserid: GUID w/o {}
        var lib = Broadlook.Library;
        var requestMain = ""
        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"b:AssignRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>Target</c:key>";
        requestMain += "            <c:value i:type=\"a:EntityReference\">";
        requestMain += "              <a:Id>" + entityid + "</a:Id>";
        requestMain += "              <a:LogicalName>" + entitytypename + "</a:LogicalName>";
        requestMain += "              <a:Name i:nil=\"true\" />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>Assignee</c:key>";
        requestMain += "            <c:value i:type=\"a:EntityReference\">";
        requestMain += "              <a:Id>" + systemuserid + "</a:Id>";
        requestMain += "              <a:LogicalName>systemuser</a:LogicalName>";
        requestMain += "              <a:Name i:nil=\"true\" />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>Assign</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";
        var req = lib.createXmlHttpRequest();


        req.open("POST", lib.getOrgServiceUrl(), true)

        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");

        //var successCallback = null;

        if (!errorCallback)
            errorCallback = lib.showError;

        req.onreadystatechange = function () { Broadlook.Library.AssignResponse(req, successCallback, errorCallback); };
        req.send(requestMain);
    }


    this.AssignResponse = function (req, successCallback, errorCallback) {
        ///<summary>
        /// Recieves the assign response
        ///</summary>
        ///<param name="req" Type="XMLHttpRequest">
        /// The XMLHttpRequest response
        ///</param>
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        /// For this message no data is returned so a success callback is not really necessary.
        ///</param>
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        /// This function accepts a JScript error returned by the _getError function
        ///</param>
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (successCallback != null) {
                    successCallback();
                }
            }
            else {
                if (errorCallback != null)
                    errorCallback(Broadlook.Library.getServiceError(req.responseXML));
            }
        }
    }


    this.MergeRequest = function (TargetId, TargetLogicalName, SubordinateId, Changes, Callback, callbackParam) {
        // systemuserid: GUID w/o {}
        //throw 'Incomplete Method - Impliment Changes to Entity Properties';
        var lib = Broadlook.Library;
        var requestMain = ""
        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"b:MergeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>Target</c:key>";
        requestMain += "            <c:value i:type=\"a:EntityReference\">";
        requestMain += "              <a:Id>" + TargetId + "</a:Id>";
        requestMain += "              <a:LogicalName>" + TargetLogicalName + "</a:LogicalName>";
        requestMain += "              <a:Name i:nil=\"true\" />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>SubordinateId</c:key>";
        requestMain += "            <c:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + SubordinateId + "</c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>PerformParentingChecks</c:key>";
        requestMain += "            <c:value i:type=\"d:boolean\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">" + "false" + "</c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";

        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>UpdateContent</c:key>";
        requestMain += "            <c:value i:type=\"a:Entity\">";
        requestMain += "              <a:Attributes>";


        //requestMain += "                <a:KeyValuePairOfstringanyType>";
        //requestMain += "                  <c:key>address1_city</c:key>";
        //requestMain += "                  <c:value i:type=\"d:string\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">Richfield 3</c:value>";
        //requestMain += "                </a:KeyValuePairOfstringanyType>";
        //requestMain += "                <a:KeyValuePairOfstringanyType>";
        //requestMain += "                  <c:key>accountid</c:key>";
        //requestMain += "                  <c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">dc2c414e-0d91-e011-8d64-1cc1de7955db</c:value>";
        //requestMain += "                </a:KeyValuePairOfstringanyType>";


        requestMain += "              </a:Attributes>";
        //requestMain += "              <a:EntityState i:nil=\"true\" />";
        //requestMain += "              <a:FormattedValues />";
        //requestMain += "              <a:Id>" + TargetId + "</a:Id>";
        requestMain += "              <a:LogicalName>" + TargetLogicalName + "</a:LogicalName>";
        requestMain += "              <a:RelatedEntities />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";

        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>Merge</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";
        var req = lib.createXmlHttpRequest();


        req.open("POST", lib.getOrgServiceUrl(), false)

        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");

        //var successCallback = null;

        if (!Callback)
            Callback = lib.showError;

        req.onreadystatechange = function () { Broadlook.Library.MergeResponse(req, Callback, callbackParam); };
        req.send(requestMain);
    }


    this.MergeResponse = function (req, Callback, callbackParam) {
        ///<summary>
        /// Recieves the assign response
        ///</summary>
        ///<param name="req" Type="XMLHttpRequest">
        /// The XMLHttpRequest response
        ///</param>
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        /// For this message no data is returned so a success callback is not really necessary.
        ///</param>
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        /// This function accepts a JScript error returned by the _getError function
        ///</param>
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (Callback != null) {
                    Callback(true, callbackParam, null);
                }
            }
            else {
                if (Callback != null) {
                    Callback(true, callbackParam, Broadlook.Library.getServiceError(req.responseXML));
                }
            }
        }
    }






















    this.UpdateActivityParties = function (ActivityId, ActivityLogicalName, ActivityParties, Callback, callbackParam) {
        // systemuserid: GUID w/o {}
        //throw 'Incomplete Method - Impliment Changes to Entity Properties';
        var Sender = [];
        var To = []; var CC = []; var BCC = [];
        var Required = []; var Optional = [];
        var Organizer = []; var Regarding = [];
        var Owner = [];
        var Resource = []; var Customer = []; var Partner = [];

        //if (!(Sender instanceof Array) && typeof Sender == 'string') { Sender = [Sender]; } else { Sender = []; }
        //if (!(To instanceof Array) && typeof To == 'string') { To = [To]; } else { To = []; }
        //if (!(CC instanceof Array) && typeof CC == 'string') { CC = [CC]; } else { CC = []; }
        //if (!(BCC instanceof Array) && typeof BCC == 'string') { BCC = [BCC]; } else { BCC = []; }
        //if (!(Required instanceof Array) && typeof Required == 'string') { Required = [Required]; } else { Required = []; }
        //if (!(Optional instanceof Array) && typeof Optional == 'string') { Optional = [Optional]; } else { Optional = []; }
        //if (!(Organizer instanceof Array) && typeof Organizer == 'string') { Organizer = [Organizer]; } else { Organizer = []; }
        //if (!(Regarding instanceof Array) && typeof Regarding == 'string') { Regarding = [Sender]; } else { Regarding = []; }
        //if (!(Resource instanceof Array) && typeof Resource == 'string') { Resource = [Owner]; } else { Resource = []; }
        //if (!(Customer instanceof Array) && typeof Customer == 'string') { Customer = [Customer]; } else { Customer = []; }
        //if (!(Partner instanceof Array) && typeof Partner == 'string') { Partner = [Partner]; } else { Partner = []; }

        //if (!(ActivityParties instanceof Array)) { ActivityParties = [ActivityParties]; }// else { ActivityParties = []; }
        //if (!(typeof ActivityParties == 'array')) { ActivityParties = [ActivityParties]; }// else { ActivityParties = []; }
        //if (!(Object.prototype.toString.call(ActivityParties) == '[object Array]')) { ActivityParties = [ActivityParties]; }// else { ActivityParties = []; }
        if (!Array.isArray(ActivityParties)) { ActivityParties = [ActivityParties]; }// else { ActivityParties = []; }

        for (var ap = 0; ap < ActivityParties.length; ap++) {
            if (ActivityParties[ap].ParticipationTypeMask != null && typeof ActivityParties[ap].ParticipationTypeMask != 'undefined') {
                switch (ActivityParties[ap].ParticipationTypeMask.Value) {
                    case 1: case "1": Sender.push(ActivityParties[ap]); break;
                    case 2: case "2": To.push(ActivityParties[ap]); break;
                    case 3: case "3": CC.push(ActivityParties[ap]); break;
                    case 4: case "4": BCC.push(ActivityParties[ap]); break;
                    case 5: case "5": Required.push(ActivityParties[ap]); break;
                    case 6: case "6": Optional.push(ActivityParties[ap]); break;
                    case 7: case "7": Organizer.push(ActivityParties[ap]); break;
                    case 8: case "8": Regarding.push(ActivityParties[ap]); break;
                    case 9: case "9": Owner.push(ActivityParties[ap]); break;
                    case 10: case "10": Resource.push(ActivityParties[ap]); break;
                    case 11: case "11": Customer.push(ActivityParties[ap]); break;
                    case 12: case "12": Partner.push(ActivityParties[ap]); break;
                    default: break;
                }
            }
        }




        var lib = Broadlook.Library;
        var requestMain = "";
        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"a:UpdateRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <b:key>Target</b:key>";
        requestMain += "            <b:value i:type=\"a:Entity\">";
        requestMain += "              <a:Attributes>";

        //allparties
        requestMain += lib.CreateActivityPartyXml(Sender, 'from');
        requestMain += lib.CreateActivityPartyXml(To, 'to');
        requestMain += lib.CreateActivityPartyXml(CC, 'cc');
        requestMain += lib.CreateActivityPartyXml(BCC, 'bcc');
        requestMain += lib.CreateActivityPartyXml(Required, 'requiredattendees');
        requestMain += lib.CreateActivityPartyXml(Optional, 'optionalattendees');
        requestMain += lib.CreateActivityPartyXml(Organizer, 'organizer');
        //requestMain +=lib.CreateActivityPartyXml(Regarding, 'To');
        //requestMain +=lib.CreateActivityPartyXml(Owner, 'To');
        //requestMain +=lib.CreateActivityPartyXml(Resource, 'To');
        //requestMain +=lib.CreateActivityPartyXml(Customer, 'To');
        //requestMain +=lib.CreateActivityPartyXml(Partner, 'To');

        //requestMain += "                <a:KeyValuePairOfstringanyType>";
        //requestMain += "                  <b:key>from</b:key>";
        //requestMain += "                  <b:value i:type=\"a:ArrayOfEntity\">";
        //requestMain += "                    <a:Entity>";
        //requestMain += "                      <a:Attributes>";
        //requestMain += "                        <a:KeyValuePairOfstringanyType>";
        //requestMain += "                          <b:key>partyid</b:key>";
        //requestMain += "                          <b:value i:type=\"a:EntityReference\">";
        //requestMain += "                            <a:Id>ce08ee7f-4f36-e111-b6f6-0050569838d6</a:Id>";
        //requestMain += "                            <a:LogicalName>systemuser</a:LogicalName>";
        //requestMain += "                            <a:Name i:nil=\"true\" />";
        //requestMain += "                          </b:value>";
        //requestMain += "                        </a:KeyValuePairOfstringanyType>";
        //requestMain += "                      </a:Attributes>";
        //requestMain += "                      <a:EntityState i:nil=\"true\" />";
        //requestMain += "                      <a:FormattedValues />";
        //requestMain += "                      <a:Id>00000000-0000-0000-0000-000000000000</a:Id>";
        //requestMain += "                      <a:LogicalName>activityparty</a:LogicalName>";
        //requestMain += "                      <a:RelatedEntities />";
        //requestMain += "                    </a:Entity>";
        //requestMain += "                  </b:value>";
        //requestMain += "                </a:KeyValuePairOfstringanyType>";

        requestMain += "              </a:Attributes>";
        requestMain += "              <a:EntityState i:nil=\"true\" />";
        requestMain += "              <a:FormattedValues />";
        requestMain += "              <a:Id>" + ActivityId + "</a:Id>";
        requestMain += "              <a:LogicalName>" + ActivityLogicalName + "</a:LogicalName>";
        requestMain += "              <a:RelatedEntities />";
        requestMain += "            </b:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>Update</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";

        console.log(requestMain);
        var req = lib.createXmlHttpRequest();


        req.open("POST", lib.getOrgServiceUrl(), false)

        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");

        //var successCallback = null;

        if (!Callback)
            Callback = lib.showError;

        req.onreadystatechange = function () { Broadlook.Library.UpdateActivityPartiesResponse(req, Callback, callbackParam); };
        req.send(requestMain);
    }

    this.CreateActivityPartyXml = function (Parties, Field) {
        var requestMain = "";
        if (Parties.length > 0) {
            requestMain += "                <a:KeyValuePairOfstringanyType>";
            requestMain += "                  <b:key>" + Field + "</b:key>";
            requestMain += "                  <b:value i:type=\"a:ArrayOfEntity\">";
            for (var p = 0; p < Parties.length; p++) {
                requestMain += "                    <a:Entity>";
                requestMain += "                      <a:Attributes>";
                requestMain += "                        <a:KeyValuePairOfstringanyType>";

                requestMain += "                          <b:key>partyid</b:key>";
                requestMain += "                          <b:value i:type=\"a:EntityReference\">";
                requestMain += "                            <a:Id>" + Parties[p].PartyId.Id + "</a:Id>";
                requestMain += "                            <a:LogicalName>" + Parties[p].PartyId.LogicalName + "</a:LogicalName>";
                requestMain += "                            <a:Name i:nil=\"true\" />";
                requestMain += "                          </b:value>";
                //requestMain += "                          <b:key>partyid</b:key>";
                //requestMain += "                          <b:value i:type=\"a:EntityReference\">";
                //requestMain += "                            <a:Id>ce08ee7f-4f36-e111-b6f6-0050569838d6</a:Id>";
                //requestMain += "                            <a:LogicalName>systemuser</a:LogicalName>";
                //requestMain += "                            <a:Name i:nil=\"true\" />";
                //requestMain += "                          </b:value>";

                //requestMain += "                          <b:key>addressused</b:key>";
                //requestMain += "                          <b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">mileyja@gmail.com</b:value>";

                requestMain += "                        </a:KeyValuePairOfstringanyType>";
                requestMain += "                      </a:Attributes>";
                requestMain += "                      <a:EntityState i:nil=\"true\" />";
                requestMain += "                      <a:FormattedValues />";
                requestMain += "                      <a:Id>00000000-0000-0000-0000-000000000000</a:Id>";
                requestMain += "                      <a:LogicalName>activityparty</a:LogicalName>";
                requestMain += "                      <a:RelatedEntities />";
                requestMain += "                    </a:Entity>";
            }
            requestMain += "                  </b:value>";
            requestMain += "                </a:KeyValuePairOfstringanyType>";
        }
        return requestMain;
    }
    this.UpdateActivityPartiesResponse = function (req, Callback, callbackParam) {
        ///<summary>
        /// Recieves the assign response
        ///</summary>
        ///<param name="req" Type="XMLHttpRequest">
        /// The XMLHttpRequest response
        ///</param>
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        /// For this message no data is returned so a success callback is not really necessary.
        ///</param>
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        /// This function accepts a JScript error returned by the _getError function
        ///</param>
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (Callback != null) {
                    Callback(true, callbackParam, null);
                }
            }
            else {
                if (Callback != null) {
                    Callback(true, callbackParam, Broadlook.Library.getServiceError(req.responseXML));
                }
            }
        }
    }

























    this.getServiceError = function (faultXml) {
        ///<summary>
        /// Parses the WCF fault returned in the event of an error.
        ///</summary>
        ///<param name="faultXml" Type="XML">
        /// The responseXML property of the XMLHttpRequest response.
        ///</param>
        var errorMessage = "Unknown Error (Unable to parse the fault)";
        if (typeof faultXml == "object") {
            try {
                var bodyNode = faultXml.firstChild.firstChild;
                //Retrieve the fault node
                for (var i = 0; i < bodyNode.childNodes.length; i++) {
                    var node = bodyNode.childNodes[i];
                    //NOTE: This comparison does not handle the case where the XML namespace changes
                    if ("s:Fault" == node.nodeName) {
                        for (var j = 0; j < node.childNodes.length; j++) {
                            var faultStringNode = node.childNodes[j];
                            if ("faultstring" == faultStringNode.nodeName) {
                                errorMessage = faultStringNode.text;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            catch (e) { };
        }
        return new Error(errorMessage);
    }


    this.extractCrmError = function (responsetext) {

        if (Broadlook.Library.z(responsetext)) return null;

        var p = responsetext.indexOf('<span id="ErrorText"');

        if (p > 0) {

            var text = (responsetext + "").slice(p);
            text = text.slice(text.indexOf('>') + 1);
            text = text.slice(0, text.indexOf('<'));
            return text;
        }

        return null;
    }

    /******************************************************************************************

    General CRM Form Operations

    ******************************************************************************************/

    this.getXrmPage = function () {

        if (Broadlook.Library.demo) {
            var p = new Object;
            p.data = new Object;
            p.data.entity = new Object;
            p.data.entity.attributes = new Object;

            return p;
        }

        if (document.parentWindow)
            return document.parentWindow.parent.Xrm.Page;
        else
            return window.parent.Xrm.Page;
    }

    this.saveRecord = function () {
        var xrmPage = Broadlook.Library.getXrmPage();

        xrmPage.data.entity.save();
    }

    this.closeForm = function () {
        var xrmPage = Broadlook.Library.getXrmPage();

        xrmPage.ui.close();
    }


    var FORM_TYPE_CREATE = 1;
    var FORM_TYPE_UPDATE = 2;
    var FORM_TYPE_READ_ONLY = 3;
    var FORM_TYPE_DISABLED = 4;
    var FORM_TYPE_QUICK_CREATE = 5;
    var FORM_TYPE_BULK_EDIT = 6;

    this.getFormStateID = function () {
        var xrmPage = Broadlook.Library.getXrmPage();
        return xrmPage.ui.getFormType();
    }

    this.getFormState = function () {

        switch (Broadlook.Library.getFormStateID()) {
            case FORM_TYPE_CREATE: return 'create'; break;
            case FORM_TYPE_UPDATE: return 'update'; break;
            case FORM_TYPE_READ_ONLY: return 'readonly'; break;
            case FORM_TYPE_DISABLED: return 'disabled'; break;
            case FORM_TYPE_QUICK_CREATE: return 'quick'; break;
            case FORM_TYPE_BULK_EDIT: return 'bulk'; break;
            default: return 'unknown'; break;
        }
        return 'unknown';
    }

}).apply(Broadlook.Library);



Broadlook.Metadata = Broadlook.Metadata || {};

(function () {

    this.__initialized = false;
    this.__namespace = true;

    //    this.Workflows = {
    //        __namespace: true
    //    };


    this.Entities = {

        Account: {
            EntityTypeCode: '1',
            Name: "account"
        },
        Contact: {
            EntityTypeCode: '2',
            Name: "contact"
        },
        Lead: {
            EntityTypeCode: '4',
            Name: "lead",
            FieldLabels: {
                "FirstName": "First Name"
            }
        },
        Registration: {
            EntityTypeCode: '',
            Name: "blt_broadlookregistration"
        },
        License: {
            EntityTypeCode: '',
            Name: "blt_license"
        },
        ProfilerLead: {
            EntityTypeCode: '',
            Name: "blt_profilerlead"
        },
        ProfilerCompany: {
            EntityTypeCode: '',
            Name: "blt_profilercompany"
        },
        ProfilerPlan: {
            EntityTypeCode: '',
            Name: "blt_profilerplan"
        },

        CaptureRequest: {
            EntityTypeCode: '',
            Name: "blt_capturerequest"
        },

        CaptureContact: {
            EntityTypeCode: '',
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
            EntityTypeCode: '',
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
        }
    }

    this.getEntityProperty = function (entity, property) {
        var code = Broadlook.Metadata.getEntityTypeCodeFromLogicalName(entity);
        console.log("TypeCode for " + entity + " is " + code + " (Obsolete)");
        return code;
    };

    this.getUserEntityAccess = function (EntityType, EntityGuid, PrincipalIsSystemUser, PrincipalGuid, Callback, CallbackParam) {

        var lib = Broadlook.Library;

        var page = lib.getXrmPage();


        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += page.getAuthenticationHeader();
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"b:RetrievePrincipalAccessRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>Target</c:key>";
        requestMain += "            <c:value i:type=\"a:EntityReference\">";
        requestMain += "              <a:Id>" + EntityGuid.toLowerCase() + "</a:Id>";
        requestMain += "              <a:LogicalName>" + EntityType.toLowerCase() + "</a:LogicalName>";
        requestMain += "              <a:Name i:nil=\"true\" />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>Principal</c:key>";
        requestMain += "            <c:value i:type=\"a:EntityReference\">";
        requestMain += "              <a:Id>" + PrincipalGuid.toLowerCase() + "</a:Id>";
        requestMain += "              <a:LogicalName>" + (PrincipalIsSystemUser ? "systemuser" : "team") + "</a:LogicalName>";
        requestMain += "              <a:Name i:nil=\"true\" />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>RetrievePrincipalAccess</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";

        var xmlHttpRequest = lib.createXmlHttpRequest();

        xmlHttpRequest.open("POST", lib.getOrgServiceUrl(), true);
        xmlHttpRequest.setRequestHeader("SOAPAction", 'http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute');
        xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        xmlHttpRequest.setRequestHeader("Content-Length", xml.length);
        xmlHttpRequest.setRequestHeader("Accept", "application/xml, text/xml, */*");

        xmlHttpRequest.onreadystatechange = function () {
            Broadlook.Library.retrieveRecordCallBack(this, callback, callbackparam);
        };

        xmlHttpRequest.send(xml);
    };
    this.getUserEntityAccessResponse = function (EntityType, EntityGuid, PrincipalIsSystemUser, PrincipalGuid) {
        var lib = Broadlook.Library;

        if (req.readyState == 4 /* complete */) {
            if (req.status == 200) {
                //Success
                var retrievedRecord = null;

                try {
                    retrievedRecord = JSON.parse(req.responseText).d;

                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(retrievedRecord, callbackparam, null);

                }
                catch (err) {

                    var errortext = lib.extractCrmError(req.responseText);

                    if (lib.nz(errortext))
                        lib.showError(errortext);
                    else
                        lib.errorHandler(err);

                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(false, callbackparam, null);

                }

            }
            else {
                //Failure
                var msg = lib.errorHandler(req);
                var error = new Object();
                try { error = JSON.parse(req.responseText).error; }
                catch (e) { error = new Object(); error.code = 0; error.message = new Object(); error.message.lang = 'en-us'; error.message.value = (msg.length > 0 ? msg : e.message); }
                error.ReqStatus = updateAccountReq.status;

                if (typeof (callback) != 'undefined' && callback != null)
                    callback(false, callbackparam, error);
            }
        }
    },

    this.getEntityTypeCodeFromLogicalName = function (entityName) {

        var lib = Broadlook.Library;

        /*Generate Soap Body.*/
        var soapBody = "<soap:Body>" +
                        "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">" +
                            "<request i:type=\"a:RetrieveEntityRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">" +
                            "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">" +
                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>EntityFilters</b:key>" +
                              "<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">" + "Entity" + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>" +

                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>MetadataId</b:key>" +
                              "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + "00000000-0000-0000-0000-000000000000" + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>" +

                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>RetrieveAsIfPublished</b:key>" +
                              "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + "false" + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>" +

                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>LogicalName</b:key>" +
                              "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + entityName + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>" +
                            "</a:Parameters>" +
                            "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveEntity</a:RequestName></request>" +
                        "</Execute>" +
                        "</soap:Body>";

        /*Wrap the Soap Body in a soap:Envelope.*/
        var soapXml = "<soap:Envelope " +
                    "  xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' " +
                    "  xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
                    "  xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
                    soapBody +
                    "</soap:Envelope>";

        /* Create the XMLHTTP object for the execute method.*/
        var xmlhttp = lib.createXmlHttpRequest();
        xmlhttp.open("POST", lib.getServerUrl() + 'XRMServices/2011/Organization.svc/web', false);
        xmlhttp.setRequestHeader("Accept", "application/xml, text/xml, */*");
        xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        xmlhttp.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        //xmlhttp.setRequestHeader("Content-Length", soapXml.length);

        /* Send the XMLHTTP object. */
        xmlhttp.send(soapXml);
        var response = xmlhttp.status;
        if (response == "200") {
            var result = xmlhttp.responseText;

            var xmlDoc;
            try //Internet Explorer 
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(result);
                var node = xmlDoc.getElementsByTagName("c:ObjectTypeCode")[0].childNodes[0];
                return node.nodeValue;
            }
            catch (e) {
                //Firefox, Mozilla, Opera, etc. 

                xmlDoc = xmlhttp.responseXML.documentElement;
                var node = xmlDoc.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[44].childNodes[0];
                return node.nodeValue;
            }



        }

        return null;
    }

    this.getEntityAttributeMetaData = function (MetadataId, Callback, CallbackParam) {

        var lib = Broadlook.Library;

        /*Generate Soap Body.*/
        var soapBody = "<soap:Body>" +
                        "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">" +
                            "<request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">" +
                            "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">" +

                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>MetadataId</b:key>" +
                              "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + MetadataId + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>" +

                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>RetrieveAsIfPublished</b:key>" +
                              "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + "false" + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>" +

                            "</a:Parameters>" +
                            "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveAttribute</a:RequestName></request>" +
                        "</Execute>" +
                        "</soap:Body>";

        /*Wrap the Soap Body in a soap:Envelope.*/
        var soapXml = "<soap:Envelope " +
                    "  xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' " +
                    "  xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
                    "  xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
                    soapBody +
                    "</soap:Envelope>";

        /* Create the XMLHTTP object for the execute method.*/
        var xmlhttp = lib.createXmlHttpRequest();
        xmlhttp.open("POST", lib.getServerUrl() + 'XRMServices/2011/Organization.svc/web', true);
        xmlhttp.setRequestHeader("Accept", "application/xml, text/xml, */*");
        xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        xmlhttp.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        //xmlhttp.setRequestHeader("Content-Length", soapXml.length);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    //Success

                    if (typeof (Callback) != 'undefined' && Callback != null)
                        Callback(xmlhttp.responseXML, CallbackParam, null);

                }
                else {
                    //Failure
                    Broadlook.Library.errorHandler(xmlhttp);

                    if (typeof (Callback) != 'undefined' && Callback != null)
                        Callback(false);
                }
            }

            return;
        };

        /* Send the XMLHTTP object. */
        xmlhttp.send(soapXml);
    }


    // Depth All, Attributes, Default, Entity, Privileges, Relationships
    this.getEntityMetaData = function (entityName, Depth, Callback, CallbackParam) {

        var lib = Broadlook.Library;

        if (Depth == null || typeof Depth == 'undefined') { Depth = ['Entity']; }
        else if (!Array.isArray(Depth)) { Depth = [Depth]; }
        //else if (!(Object.prototype.toString.call(Depth) == '[object Array]')) { Depth = [Depth]; }
        //else if (!(typeof Depth == 'array')) { Depth = [Depth]; }
        //else if (!(Depth instanceof Array)) { Depth = [Depth]; }

        /*Generate Soap Body.*/
        var soapBody = "<soap:Body>" +
                        "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">" +
                            "<request i:type=\"a:" + (entityName != null ? 'RetrieveEntityRequest' : 'RetrieveAllEntitiesRequest') + "\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">" +
                            "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">" +
                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>EntityFilters</b:key>" +
                              "<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">" + Depth.join(' ') + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>" +
                            "<a:KeyValuePairOfstringanyType>" +
                              "<b:key>RetrieveAsIfPublished</b:key>" +
                              "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + "false" + "</b:value>" +
                            "</a:KeyValuePairOfstringanyType>";


        if (entityName != null) {
            soapBody += "<a:KeyValuePairOfstringanyType>" +
                          "<b:key>MetadataId</b:key>" +
                          "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + "00000000-0000-0000-0000-000000000000" + "</b:value>" +
                        "</a:KeyValuePairOfstringanyType>" +
                        "<a:KeyValuePairOfstringanyType>" +
                           "<b:key>LogicalName</b:key>" +
                           "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + entityName + "</b:value>" +
                         "</a:KeyValuePairOfstringanyType>";
        }

        soapBody += "</a:Parameters>" +
                            "<a:RequestId i:nil=\"true\" /><a:RequestName>" + (entityName != null ? 'RetrieveEntity' : 'RetrieveAllEntities') + "</a:RequestName></request>" +
                        "</Execute>" +
                        "</soap:Body>";

        /*Wrap the Soap Body in a soap:Envelope.*/
        var soapXml = "<soap:Envelope " +
                    "  xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' " +
                    "  xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
                    "  xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
                    soapBody +
                    "</soap:Envelope>";

        /* Create the XMLHTTP object for the execute method.*/
        var xmlhttp = lib.createXmlHttpRequest();
        xmlhttp.open("POST", lib.getServerUrl() + 'XRMServices/2011/Organization.svc/web', Callback != null);
        xmlhttp.setRequestHeader("Accept", "application/xml, text/xml, */*");
        xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        xmlhttp.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        //xmlhttp.setRequestHeader("Content-Length", soapXml.length);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    //Success

                    if (typeof (Callback) != 'undefined' && Callback != null)
                        Callback(xmlhttp.responseXML, CallbackParam, null);
                    else { return xmlhttp.responseXML; }
                }
                else {
                    //Failure
                    Broadlook.Library.errorHandler(xmlhttp);

                    if (typeof (Callback) != 'undefined' && Callback != null)
                        Callback(false);
                    else { return false; }
                }
            }
            if (Callback != null) { return; } else {
                try {
                    return xmlhttp.responseXML;
                } catch (e) {
                    return false;
                }
            }
        };

        /* Send the XMLHTTP object. */
        xmlhttp.send(soapXml);

        if (Callback != null) { return; } else {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    //Success

                    if (typeof (Callback) != 'undefined' && Callback != null)
                        Callback(xmlhttp.responseXML, CallbackParam, null);
                    else { return xmlhttp.responseXML; }
                }
                else {
                    //Failure
                    Broadlook.Library.errorHandler(xmlhttp);

                    if (typeof (Callback) != 'undefined' && Callback != null)
                        Callback(false);
                    else { return false; }
                }
            }
            return xmlhttp.responseXML;
        }

    }

    this.init = function (app) {

        if (this.__initialized) return;

        var meta = Broadlook.Metadata;

        if (app == 'RC') {
            meta.Entities.Resume.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.Resume.Name);
        }
        else if (app == 'PR') {
            meta.Entities.ProfilerLead.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.ProfilerLead.Name);
            meta.Entities.ProfilerCompany.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.ProfilerCompany.Name);
            meta.Entities.ProfilerPlan.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.ProfilerPlan.Name);
        }
        else if (app == 'CC') {
            meta.Entities.CaptureContact.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.CaptureContact.Name);
            meta.Entities.CaptureRequest.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.CaptureRequest.Name);
        }
        else { // all
            meta.Entities.CaptureContact.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.CaptureContact.Name);
            meta.Entities.CaptureRequest.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.CaptureRequest.Name);
            meta.Entities.ProfilerLead.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.ProfilerLead.Name);
            meta.Entities.ProfilerCompany.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.ProfilerCompany.Name);
            meta.Entities.ProfilerPlan.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.ProfilerPlan.Name);
            meta.Entities.Resume.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.Resume.Name);
        }

        meta.Entities.Registration.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.Registration.Name);
        meta.Entities.License.EntityTypeCode = meta.getEntityTypeCodeFromLogicalName(meta.Entities.License.Name);

        this.__initialized = true;
    };


    var associate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to associate records.
        ///</summary>
        ///<param name="relationshipName" type="String">
        /// A JavaScript String corresponding to the relationship name
        /// that is used for associate operations.
        /// </param>
        ///<param name="targetEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the target entity
        /// that is used for associate operations.
        /// </param>
        ///<param name="targetId" type="String">
        /// A JavaScript String corresponding to the GUID of the target entity
        /// that is used for associate operations.
        /// </param>
        ///<param name="relatedEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the related entity
        /// that is used for associate operations.
        /// </param>
        ///<param name="relationshipBusinessEntities" type="Array">
        /// A JavaScript Array corresponding to the collection of the related entities as BusinessEntity
        /// that is used for associate operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var relatedEntities = relatedBusinessEntities;

        relatedEntities = isArray(relatedEntities) ? relatedEntities : [relatedEntities];

        var output = [];
        for (var i = 0; i < relatedEntities.length; i++) {
            if (relatedEntities[i].id != '') {
                output.push("<a:EntityReference>",
                                "<a:Id>", relatedEntities[i].id, "</a:Id>",
                                "<a:LogicalName>", relatedEntityName, "</a:LogicalName>",
                                "<a:Name i:nil='true' />",
                            "</a:EntityReference>");
            }
        }

        var relatedXml = output.join("");

        var request = [
            "<request i:type='a:AssociateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
                "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
                    "<a:KeyValuePairOfstringanyType>",
                        "<b:key>Target</b:key>",
                        "<b:value i:type='a:EntityReference'>",
                            "<a:Id>", targetId, "</a:Id>",
                            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
                            "<a:Name i:nil='true' />",
                        "</b:value>",
                    "</a:KeyValuePairOfstringanyType>",
                    "<a:KeyValuePairOfstringanyType>",
                        "<b:key>Relationship</b:key>",
                        "<b:value i:type='a:Relationship'>",
                            "<a:PrimaryEntityRole i:nil='true' />",
                            "<a:SchemaName>", relationshipName, "</a:SchemaName>",
                        "</b:value>",
                    "</a:KeyValuePairOfstringanyType>",
                    "<a:KeyValuePairOfstringanyType>",
                    "<b:key>RelatedEntities</b:key>",
                    "<b:value i:type='a:EntityReferenceCollection'>",
                        relatedXml,
                    "</b:value>",
                    "</a:KeyValuePairOfstringanyType>",
                "</a:Parameters>",
                "<a:RequestId i:nil='true' />",
                "<a:RequestName>Associate</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var response = $(resultXml).find('ExecuteResult').eq(0);
            var result = ((typeof window.CrmEncodeDecode != 'undefined') ? window.CrmEncodeDecode.CrmXmlDecode(response.text()) : crmXmlDecode(response.text()));
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var disassociate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to disassociate records.
        ///</summary>
        ///<param name="relationshipName" type="String">
        /// A JavaScript String corresponding to the relationship name
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="targetEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the target entity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="targetId" type="String">
        /// A JavaScript String corresponding to the GUID of the target entity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="relatedEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the related entity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="relationshipBusinessEntities" type="Array">
        /// A JavaScript Array corresponding to the collection of the related entities as BusinessEntity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var relatedEntities = relatedBusinessEntities;

        relatedEntities = isArray(relatedEntities) ? relatedEntities : [relatedEntities];

        var output = [];
        for (var i = 0; i < relatedEntities.length; i++) {
            if (relatedEntities[i].id != '') {
                output.push("<a:EntityReference>",
                                "<a:Id>", relatedEntities[i].id, "</a:Id>",
                                "<a:LogicalName>", relatedEntityName, "</a:LogicalName>",
                                "<a:Name i:nil='true' />",
                            "</a:EntityReference>");
            }
        }

        var relatedXml = output.join("");

        var request = [
            "<request i:type='a:DisassociateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
                "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
                    "<a:KeyValuePairOfstringanyType>",
                        "<b:key>Target</b:key>",
                        "<b:value i:type='a:EntityReference'>",
                            "<a:Id>", targetId, "</a:Id>",
                            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
                            "<a:Name i:nil='true' />",
                        "</b:value>",
                    "</a:KeyValuePairOfstringanyType>",
                    "<a:KeyValuePairOfstringanyType>",
                        "<b:key>Relationship</b:key>",
                        "<b:value i:type='a:Relationship'>",
                            "<a:PrimaryEntityRole i:nil='true' />",
                            "<a:SchemaName>", relationshipName, "</a:SchemaName>",
                        "</b:value>",
                    "</a:KeyValuePairOfstringanyType>",
                    "<a:KeyValuePairOfstringanyType>",
                    "<b:key>RelatedEntities</b:key>",
                    "<b:value i:type='a:EntityReferenceCollection'>",
                        relatedXml,
                    "</b:value>",
                    "</a:KeyValuePairOfstringanyType>",
                "</a:Parameters>",
                "<a:RequestId i:nil='true' />",
                "<a:RequestName>Disassociate</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var response = $(resultXml).find('ExecuteResult').eq(0);
            var result = ((typeof window.CrmEncodeDecode != 'undefined') ? window.CrmEncodeDecode.CrmXmlDecode(response.text()) : crmXmlDecode(response.text()));
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };


}).apply(Broadlook.Metadata);



(function () {

    this.getLicense = function (appname, callback) {

        var lib = Broadlook.Library;


        var license = new Object;

        if (lib.demo) {

            license.demo = true;
            license.expiration = new Date(2012, 0, 1, 0, 0, 0, 0); // Jan 1 2012
            license.registered = false;
            license.keys = [];
            license.keys.push("SAMPLEKEY");
            callback(license);
            return;
        }


        var retrieveLicensesCallback = function (results, license) {

            if (results && results.results && results.results.length > 0) {

                license.registered = true;

                var n = results.results.length;
                while (n--) {

                    var record = results.results[n];

                    if (record["blt_applicationname"] == appname) {

                        var expiration = lib.convertToDate(record["blt_expireson"]);

                        if (!license.expiration || license.expiration < expiration)
                            license.expiration = expiration;

                        var key = record["blt_key"];

                        if (key) {
                            license.keys.push(key);

                            if (key && key.length > 0 && key.indexOf("DEMO") < 0)
                                license.demo = false;
                        }
                    }
                }

            }

            callback(license);

        };

        //var retrieveRegistrationCallback = function (results, license) {

        var license = new Object;

        license.registered = false;
        license.demo = true;
        license.expiration = null;
        license.keys = [];


        //if (results && results.results && results.results.length > 0)
        //license.registered = true;

        lib.retrieveAllRecords(Broadlook.Metadata.Entities.License.Name, retrieveLicensesCallback, license);

        //};

        //lib.retrieveAllRecords(Broadlook.Metadata.Entities.Registration.Name, retrieveRegistrationCallback, license);

    }

    this.checkNewVersion = function () {

        Broadlook.Library.checkNewVersionInternal('dynamics');

    }

    this.checkExistingVersion = function (latest) {
        var lib = Broadlook.Library;

        try {

            if (lib.demo) {
                var current = new Object;
                current.build = 123;
                current.version = '1.0.0.123';
                lib.checkExistingVersionCallback(current, latest);
                return;
            }

            var retrieveRecordsByFilterCallback = function (result) {

                var current = null;

                if (result && result.results && result.results.length > 0) {
                    var version = result.results[0].Version;
                    var b = version.replace(/[0-9]+[.][0-9]+[.][0-9]+[.]/, '');
                    var n = parseInt(b);
                    var build = null;
                    if (n == b) build = n;

                    if (build) {
                        current = new Object;
                        current.build = build;
                        current.version = version;
                    }
                }
                
                lib.checkExistingVersionCallback(current, latest);
            };

            var retrieveRecordsByFilter2 = function (entityname, filter, outputfields, sortfields, callback, callbackparam) {
                var lib = Broadlook.Library;
                if (!lib.nz(entityname)) {
                    if (typeof (callback) != 'undefined' && callback != null)
                        callback(false);
                    return;
                }
                var req = lib.createXmlHttpRequest();
                var path = lib.ODataPath + "/" + entityname + "Set?";
                if (filter != null) { path += "&$filter=" + filter; }
                if (outputfields != null) { path += "&$select=" + outputfields.join(","); }
                if (sortfields != null) { path += "&$orderby=" + sortfields.join(","); }
                req.open("GET", path, true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = function () {
                    retrieveRecordCallBack2(this, callback, callbackparam);
                };
                req.send();
            }

            var retrieveRecordCallBack2 = function (req, callback, callbackparam) {
                var lib = Broadlook.Library;
                if (req.readyState == 4 /* complete */) {
                    this.onreadystatechange = null; //avoids memory leaks
                    if (req.status == 200) {
                        //Success
                        var retrievedRecord = null;
                        try {
                            retrievedRecord = JSON.parse(req.responseText).d;
                        }
                        catch (err) {
                            if (typeof (callback) != 'undefined' && callback != null)
                                callback(false, callbackparam, null);
                        }
                        if (typeof (callback) != 'undefined' && callback != null)
                            callback(retrievedRecord, callbackparam, null);
                    }
                    else {
                        //Failure
                        if (typeof (callback) != 'undefined' && callback != null)
                            callback(false, callbackparam, null);
                    }
                }
            }

            retrieveRecordsByFilter2('Solution', "UniqueName eq 'BroadlookCrmSuite'", ['Version'], null, retrieveRecordsByFilterCallback, latest);
        }
        catch (an_exception) {
            lib.showError(an_exception);
        }
    }

}).apply(Broadlook.Library);




Broadlook.JsonXml = {
    jsVar: function (s) { return String(s || '').replace(/-/g, "_"); },
    isNum: function (s) {
        // based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
        // few bugs corrected from original function :
        // - syntax error : regexp.test(string) instead of string.test(reg)
        // - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
        // - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
        // - string is "trimmed", allowing to accept space at the beginning and end of string
        var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
        return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
    },
    myArr: function (o) {

        // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
        //if(!o.length) o = [ o ]; o.length=o.length;
        if (!Broadlook.Library.$.isArray(o)) o = [o]; o.length = o.length;

        // here is where you can attach additional functionality, such as searching and sorting...
        return o;
    },
    extended: false,
    xml2json: function (xml, extended) {
        if (!xml) return {}; // quick fail

        Broadlook.JsonXml.extended = extended;
        //### PARSER LIBRARY
        // Core function
        // Core Function End
        // Utility functions
        // OLD isNum function: (for reference only)
        //var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };

        // Utility functions End
        //### PARSER LIBRARY END

        // Convert plain text to xml
        if (typeof xml == 'string') xml = Broadlook.JsonXml.text2xml(xml);

        // Quick fail if not xml (or if this is a node)
        if (!xml.nodeType) return;
        if (xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;

        // Find xml root node
        var root = (xml.nodeType == 9) ? xml.documentElement : xml;

        // Convert xml to json
        var out = Broadlook.JsonXml.Xml2JsonInternal(root, true /* simple */);

        // Clean-up memory
        xml = null; root = null;

        // Send output
        return out;
    },
    Xml2JsonInternal: function (node, simple) {
        if (!node) return null;
        var txt = '', obj = null, att = null;
        var nt = node.nodeType, nn = Broadlook.JsonXml.jsVar(node.localName || node.nodeName);
        var nv = node.text || node.nodeValue || '';
        /*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
        if (node.childNodes) {
            if (node.childNodes.length > 0) {
                /*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
                Broadlook.Library.$.each(node.childNodes, function (n, cn) {
                    var cnt = cn.nodeType, cnn = Broadlook.JsonXml.jsVar(cn.localName || cn.nodeName);
                    var cnv = cn.text || cn.nodeValue || '';

                    cnn = cnn.split(':');
                    cnn = cnn[cnn.length - 1];

                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
                    if (cnt == 8) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
                        return; // ignore comment node
                    }
                    else if (cnt == 3 || cnt == 4 || !cnn) {
                        // ignore white-space in between tags
                        if (cnv.match(/^\s+$/)) {
                            /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
                            return;
                        };
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
                        txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
                        // make sure we ditch trailing spaces from markup
                    }
                    else {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
                        obj = obj || {};
                        if (obj[cnn]) {
                            /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);

                            // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                            if (!obj[cnn].length) obj[cnn] = Broadlook.JsonXml.myArr(obj[cnn]);
                            obj[cnn] = Broadlook.JsonXml.myArr(obj[cnn]);

                            obj[cnn][obj[cnn].length] = Broadlook.JsonXml.Xml2JsonInternal(cn, true/* simple */);
                            obj[cnn].length = obj[cnn].length;
                        }
                        else {
                            /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
                            obj[cnn] = Broadlook.JsonXml.Xml2JsonInternal(cn);
                        };
                    };
                });
            };//node.childNodes.length>0
        };//node.childNodes
        if (node.attributes) {
            if (node.attributes.length > 0) {
                /*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
                att = {}; obj = obj || {};
                Broadlook.Library.$.each(node.attributes, function (a, at) {
                    var atn = Broadlook.JsonXml.jsVar(at.name), atv = at.value;
                    att[atn] = atv;
                    if (obj[atn]) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);

                        // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                        //if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
                        obj[cnn] = Broadlook.JsonXml.myArr(obj[cnn]);

                        obj[atn][obj[atn].length] = atv;
                        obj[atn].length = obj[atn].length;
                    }
                    else {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
                        obj[atn] = atv;
                    };
                });
                //obj['attributes'] = att;
            };//node.attributes.length>0
        };//node.attributes
        if (obj) {
            obj = Broadlook.Library.$.extend((txt != '' ? new String(txt) : {}),/* {text:txt},*/ obj || {}/*, att || {}*/);
            txt = (obj.text) ? (typeof (obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
            if (txt) obj.text = txt;
            txt = '';
        };
        var out = obj || txt;
        //console.log([extended, simple, out]);
        if (Broadlook.JsonXml.extended) {
            if (txt) out = {};//new String(out);
            txt = out.text || txt || '';
            if (txt) out.text = txt;
            if (!simple) out = Broadlook.JsonXml.myArr(out);
        };
        return out;
    },// parseXML
    text2xml: function (str) {
        // NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
        //return $(xml)[0];
        var out;
        try {
            var xml = ((!Broadlook.Library.$.support.opacity && !Broadlook.Library.$.support.style)) ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
            xml.async = false;
        } catch (e) { throw new Error("XML Parser could not be instantiated") };
        try {
            if ((!Broadlook.Library.$.support.opacity && !Broadlook.Library.$.support.style)) out = (xml.loadXML(str)) ? xml : false;
            else out = xml.parseFromString(str, "text/xml");
        } catch (e) { throw new Error("Error parsing XML string") };
        return out;
    }
}






Broadlook.EntityMetadataCache = {
    init: function (Callback) {
        //Broadlook.EntityMetadataCache.CacheDelete();
        var cache = Broadlook.EntityMetadataCache.CacheBaseRetreive();
        var cacheInit = Broadlook.EntityMetadataCache.CacheSessionRetreive();
        //console.log(cache);
        //console.log(cacheInit);
        if (cacheInit != null) {
            //console.log('Cache Loaded');
            //Broadlook.EntityMetadataCache._entityMetadataCache = cache;

            if (Callback == null || typeof Callback == 'undefined') { return; }
            else { Callback(); }
        } else {

            //console.log('Cache Loading');
            Broadlook.EntityMetadataCache.CacheDelete();
            //Broadlook.Metadata.getEntityMetaData(null, ['Entity'], function (Response, Reference, Error) {
            Broadlook.Metadata.getEntityMetaData(null, ['Entity'], function (Response, Reference, Error) {
                //console.log(Broadlook.JsonXml.xml2json(Response).Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType);
                //console.log(Broadlook.JsonXml.xml2json(Response).Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType[0]);
                //console.log(Broadlook.JsonXml.xml2json(Response).Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType[0].value);
                //console.log(Broadlook.JsonXml.xml2json(Response).Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType[0].value.EntityMetadata);
                //console.log(Broadlook.JsonXml.xml2json(Response).Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType[0].value.EntityMetadata);
                console.log('Xml-Json - Start');
                var entityDefinitions = [];
                if (Response) { // fixes the bug from IE 9.0.8112.16421 - Unable to get value of the property 'ExecuteResponse': object is null
                    var jsonResponse = Broadlook.JsonXml.xml2json(Response);
                    if (jsonResponse && jsonResponse.Body)
                        entityDefinitions = jsonResponse.Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType[0].value.EntityMetadata;
                }
                //console.log('Xml-Json - Complete');

                //console.log(entityDefinitions);
                //Broadlook.EntityMetadataCache._entityMetadataCache = [];//entityDefinitions;

                //console.log('Cache Loaded');



                for (var d = 0; d < entityDefinitions.length; d++) {
                    //entityDefinitions[d].Depth = ['E'];
                    entityDefinitions[d].D = ['E'];
                    var metadata = Broadlook.EntityMetadataCache.AddToCache(entityDefinitions[d], true);

                    //    console.log(Broadlook.EntityMetadataCache._entityMetadataCache[d].ObjectTypeCode + ' - ' + Broadlook.EntityMetadataCache._entityMetadataCache[d].SchemaName + ' - ' + Broadlook.EntityMetadataCache._entityMetadataCache[d].LogicalName + ' - ' + Broadlook.EntityMetadataCache._entityMetadataCache[d].MetadataId);
                }

                //Broadlook.EntityMetadataCache.CacheBaseRegister();

                Broadlook.EntityMetadataCache.CacheSessionSet();
                //Broadlook.EntityMetadataCache.CacheSessionRetreive();
                if (Callback == null || typeof Callback == 'undefined') { return; }
                else { Callback(); }
            }, null);
        }
    },
    GetTypeCode: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.ObjectTypeCode; }
        if (def != null) { return def.TC; }
        return '';
    },
    GetLogicalName: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.LogicalName; }
        if (def != null) { return def.LN; }
        return '';
    },
    GetSchemaName: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.SchemaName; }
        if (def != null) { return def.SN; }
        return '';
    },
    GetIsCustom: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        if (def != null) {
            //if (def.IsCustomEntity == true || def.IsCustomEntity == 'true') { return true; }
            //else { return false; }
            //console.log(def.iC);
            if (def.iC == 1 || def.iC == "1" || def.iC == true || def.iC == 'true') { return true; }
            else { return false; }
        }
        return true;
    },
    GetDisplayName: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.DisplayName.LocalizedLabels.LocalizedLabel.Label; }
        //if (def != null) { return def.DisplayName; }
        if (def != null) { return def.DN; }
        return '';
    },
    GetDisplayCollectionName: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.DisplayCollectionName.LocalizedLabels.LocalizedLabel.Label; }
        //if (def != null) { return def.DisplayCollectionName; }
        if (def != null) { return def.CN; }
        return '';
    },
    GetDescription: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.Description.LocalizedLabels.LocalizedLabel.Label; }
        //if (def != null) { return def.Description; }
        if (def != null) { return def.DE; }
        return '';
    },
    GetSmallIcon: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.IconSmallName; }
        if (def != null) { return def.IS; }
        return '';
    },
    GetSmallIconURL: function (Search) {
        var icon = Broadlook.EntityMetadataCache.GetSmallIcon(Search);
        if (typeof icon == 'string')
        { return Mscrm.CrmUri.create('/webresources/' + icon)['$4S_0'] }
        else if (Broadlook.EntityMetadataCache.GetIsCustom(Search))
        { return Mscrm.CrmUri.create('/_Common/icon.aspx?cache=1&iconType=GridIcon&objectTypeCode=' + Broadlook.EntityMetadataCache.GetTypeCode(Search)); }
        else if (icon == null)
        { return Mscrm.CrmUri.create('/_imgs/ico_16_' + Broadlook.EntityMetadataCache.GetTypeCode(Search) + '.gif'); }
        else { return Mscrm.CrmUri.create('/_Common/icon.aspx?cache=1&iconType=GridIcon&objectTypeCode=' + Broadlook.EntityMetadataCache.GetTypeCode(Search)); }
        //http://crmdev.broadlook.local/DevCRM/_Common/icon.aspx?cache=1&iconType=GridIcon&objectTypeCode=10017
    },
    GetMediumIcon: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.IconMediumName; }
        if (def != null) { return def.IM; }
        return '';
    },
    GetMediumIconURL: function (Search) {
        var icon = Broadlook.EntityMetadataCache.GetMediumIcon(Search);
        if (typeof icon == 'string')
        { return Mscrm.CrmUri.create('/webresources/' + icon)['$4S_0'] }
        else if (Broadlook.EntityMetadataCache.GetIsCustom(Search))
        { return Mscrm.CrmUri.create('/_Common/icon.aspx?cache=1&iconType=FormHeaderEntityIcon&objectTypeCode=' + Broadlook.EntityMetadataCache.GetTypeCode(Search)); }
        else if (icon == null)
        { return Mscrm.CrmUri.create('/_imgs/FormEntity/ico_fhe_' + Broadlook.EntityMetadataCache.GetTypeCode(Search) + '.png'); }
        else { return Mscrm.CrmUri.create('/_Common/icon.aspx?cache=1&iconType=FormHeaderEntityIcon&objectTypeCode=' + Broadlook.EntityMetadataCache.GetTypeCode(Search)); }
        //http://crmdev.broadlook.local/DevCRM/_Common/icon.aspx?cache=1&iconType=FormHeaderEntityIcon&objectTypeCode=1
    },
    GetLargeIcon: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.IconLargeName; }
        if (def != null) { return def.IL; }
        return '';
    },
    GetLargeIconURL: function (Search) {
        var icon = Broadlook.EntityMetadataCache.GetMediumIcon(Search);
        if (typeof icon == 'string')
        { return Mscrm.CrmUri.create('/webresources/' + icon)['$4S_0'] }
        else if (Broadlook.EntityMetadataCache.GetIsCustom(Search))
        { return Mscrm.CrmUri.create('/_Common/icon.aspx?cache=1&iconType=FormHeaderEntityIcon&objectTypeCode=' + Broadlook.EntityMetadataCache.GetTypeCode(Search)); }
        else if (icon == null)
        { return Mscrm.CrmUri.create('/_imgs/FormEntity/ico_fhe_' + Broadlook.EntityMetadataCache.GetTypeCode(Search) + '.png'); }
        else { return Mscrm.CrmUri.create('/_Common/icon.aspx?cache=1&iconType=FormHeaderEntityIcon&objectTypeCode=' + Broadlook.EntityMetadataCache.GetTypeCode(Search)); }
        //http://crmdev.broadlook.local/DevCRM/_Common/icon.aspx?cache=1&iconType=FormHeaderEntityIcon&objectTypeCode=1
    },
    GetPrimaryIdAttributeName: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.PrimaryIdAttribute; }
        if (def != null) { return def.PI; }
        return '';
    },
    GetPrimaryIdAttribute: function (Search) {
        return Broadlook.EntityMetadataCache.GetEntityMetadataAttribute(Search, Broadlook.EntityMetadataCache.GetPrimaryIdAttributeName(Search));
    },
    GetPrimaryNameAttributeName: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        //if (def != null) { return def.PrimaryNameAttribute; }
        if (def != null) { return def.PN; }
        return '';
    },
    GetPrimaryNameAttribute: function (Search) {
        return Broadlook.EntityMetadataCache.GetEntityMetadataAttribute(Search, Broadlook.EntityMetadataCache.GetPrimaryNameAttributeName(Search));
    },
    GetEntityMetadata: function (Search) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(Search, null, false, null);
        if (def != null) { return def; }
        return null;
    },
    GetEntityMetadataAttribute: function (EntitySearch, FieldSearch, Retry) {
        var def = Broadlook.EntityMetadataCache.GetDefinition(EntitySearch, null, false, null);
        if (def != null) {
            //console.log(def);
            //if (def.A instanceof Array) {// != null && def.Attributes.length > 0) {
            //if (typeof def.A == 'array') {// != null && def.Attributes.length > 0) {
            //if (Object.prototype.toString.call(def.A) == '[object Array]') {// != null && def.Attributes.length > 0) {
            if (Array.isArray(def.A)) {// != null && def.Attributes.length > 0) {
                for (var a = 0; a < def.A.length; a++) {
                    //console.log(def.Attributes.AttributeMetadata[a]);
                    if (def.A[a].LN == FieldSearch ||
                        def.A[a].CN == FieldSearch ||
                        def.A[a].SN == FieldSearch)
                    { return def.A[a]; }
                }
                return null;
            } else {
                if (Retry == null) { Retry = 1; } else if (Retry > 5) { return null; } else { Retry++; }
                Broadlook.EntityMetadataCache.GetDefinition(EntitySearch, ['E', 'A', 'P', 'R'], true, null);
                return Broadlook.EntityMetadataCache.GetEntityMetadataAttribute(EntitySearch, FieldSearch, Retry);
            }
        }
        return null;
    },

    VirtualDefinitions: function () {
        if (Broadlook.EntityMetadataCache.VirtualCache == null) { Broadlook.EntityMetadataCache.VirtualCache = []; }
        else { return Broadlook.EntityMetadataCache.VirtualCache; }

        var entityMetaData = {};
        console.log('Loading: ' + 'cc (virtual)');

        entityMetaData.TM = '1';//ActivityTypeMask
        entityMetaData.D = ['E', 'A', 'P', 'R'];//Depth

        entityMetaData.A = [];
        entityMetaData.PI = 'id';//PrimaryIdAttribute
        entityMetaData.PN = 'name';//PrimaryNameAttribute

        var fields = ['ID', 'Name', 'First Name', 'Middle Name', 'Last Name', 'Salutation', 'Suffix', 'Title', 'Company', 'Department', 'Email', 'Website', 'Phone', 'Phone 2', 'Mobile', 'Fax', 'Pager', 'Address 1', 'Address 2', 'City', 'State', 'Zip', 'Country', 'Facebook', 'Twitter', 'LinkedIn', 'Google Plus', 'Skype', 'socl', 'Blog', 'YouTube', 'Xing', 'Quora', 'SlideShare', 'Reddit', 'StumbleUpon', 'Digg', 'Pinterest'];
        for (var a = 0; a < fields.length; a++) {
            var attr = {};

            attr.AT = 'String';//AttributeType
            attr.CN = a;//ColumnNumber

            attr.DE = '';//Description

            attr.DN = fields[a];//DisplayName

            attr.iC = 1;//IsCustomAttribute
            attr.iM = 0;//IsManaged
            attr.iPI = (entityMetaData.PI == fields[a] ? 1 : 0);//IsPrimaryId
            attr.iPN = (entityMetaData.PN == fields[a] ? 1 : 0);//IsPrimaryName


            attr.iVC = 0;//IsValidForCreate
            attr.iVR = 1;//IsValidForRead
            attr.iVU = 0;//IsValidForUpdate

            attr.LN = fields[a].toLowerCase().replace(' ', '');//LogicalName
            attr.ID = fields[a];//MetadataId
            attr.MN = NaN;//MinValue
            attr.MX = NaN;//MaxValue
            attr.P = NaN;//Precision
            attr.PS = undefined;//PrecisionSource
            attr.DV = '';//DefaultFormValue
            attr.SN = fields[a].toLowerCase().replace(' ', '');//SchemaName
            attr.ML = 500;//MaxLength

            attr.OS = {};//Options
            attr.OS.O = [];//Multi Options
            attr.OS.TO = null;//True Option
            attr.OS.FO = null;//False Option

            attr.T = []

            entityMetaData.A.push(attr);
        }

        var attr = {};

        attr.AT = 'DateTime';//AttributeType
        attr.CN = a;//ColumnNumber

        attr.DE = '';//Description

        attr.DN = 'Modified On';//DisplayName

        attr.iC = 1;//IsCustomAttribute
        attr.iM = 0;//IsManaged
        attr.iPI = 0;//IsPrimaryId
        attr.iPN = 0;//IsPrimaryName


        attr.iVC = 0;//IsValidForCreate
        attr.iVR = 1;//IsValidForRead
        attr.iVU = 0;//IsValidForUpdate

        attr.LN = 'modifiedon';//LogicalName
        attr.ID = 'modifiedon';//MetadataId
        attr.MN = NaN;//MinValue
        attr.MX = NaN;//MaxValue
        attr.P = NaN;//Precision
        attr.PS = undefined;//PrecisionSource
        attr.DV = '';//DefaultFormValue
        attr.SN = 'modifiedon';//SchemaName
        attr.ML = 500;//MaxLength

        attr.OS = {};//Options
        attr.OS.O = [];//Multi Options
        attr.OS.TO = null;//True Option
        attr.OS.FO = null;//False Option

        attr.T = []

        entityMetaData.A.push(attr);


        var attr = {};

        attr.AT = 'DateTime';//AttributeType
        attr.CN = a;//ColumnNumber

        attr.DE = '';//Description

        attr.DN = 'Created On';//DisplayName

        attr.iC = 1;//IsCustomAttribute
        attr.iM = 0;//IsManaged
        attr.iPI = 0;//IsPrimaryId
        attr.iPN = 0;//IsPrimaryName


        attr.iVC = 0;//IsValidForCreate
        attr.iVR = 1;//IsValidForRead
        attr.iVU = 0;//IsValidForUpdate

        attr.LN = 'createdon';//LogicalName
        attr.ID = 'createdon';//MetadataId
        attr.MN = NaN;//MinValue
        attr.MX = NaN;//MaxValue
        attr.P = NaN;//Precision
        attr.PS = undefined;//PrecisionSource
        attr.DV = '';//DefaultFormValue
        attr.SN = 'createdon';//SchemaName
        attr.ML = 500;//MaxLength

        attr.OS = {};//Options
        attr.OS.O = [];//Multi Options
        attr.OS.TO = null;//True Option
        attr.OS.FO = null;//False Option

        attr.T = [];

        entityMetaData.A.push(attr);


        var attr = {};

        attr.AT = 'Lookup';//AttributeType
        attr.CN = a;//ColumnNumber

        attr.DE = '';//Description

        attr.DN = 'Status Reason';//DisplayName

        attr.iC = 1;//IsCustomAttribute
        attr.iM = 0;//IsManaged
        attr.iPI = 0;//IsPrimaryId
        attr.iPN = 0;//IsPrimaryName


        attr.iVC = 0;//IsValidForCreate
        attr.iVR = 1;//IsValidForRead
        attr.iVU = 0;//IsValidForUpdate

        attr.LN = 'statuscode';//LogicalName
        attr.ID = 'statuscode';//MetadataId
        attr.MN = NaN;//MinValue
        attr.MX = NaN;//MaxValue
        attr.P = NaN;//Precision
        attr.PS = undefined;//PrecisionSource
        attr.DV = '';//DefaultFormValue
        attr.SN = 'statuscode';//SchemaName
        attr.ML = 500;//MaxLength

        attr.OS = {};//Options
        attr.OS.O = [];//Multi Options
        attr.OS.TO = null;//True Option
        attr.OS.FO = null;//False Option

        attr.T = [];

        entityMetaData.A.push(attr);


        var attr = {};

        attr.AT = 'Lookup';//AttributeType
        attr.CN = a;//ColumnNumber

        attr.DE = '';//Description

        attr.DN = 'State';//DisplayName

        attr.iC = 1;//IsCustomAttribute
        attr.iM = 0;//IsManaged
        attr.iPI = 0;//IsPrimaryId
        attr.iPN = 0;//IsPrimaryName


        attr.iVC = 0;//IsValidForCreate
        attr.iVR = 1;//IsValidForRead
        attr.iVU = 0;//IsValidForUpdate

        attr.LN = 'statecode';//LogicalName
        attr.ID = 'statecode';//MetadataId
        attr.MN = NaN;//MinValue
        attr.MX = NaN;//MaxValue
        attr.P = NaN;//Precision
        attr.PS = undefined;//PrecisionSource
        attr.DV = '';//DefaultFormValue
        attr.SN = 'statecode';//SchemaName
        attr.ML = 500;//MaxLength

        attr.OS = {};//Options
        attr.OS.O = [];//Multi Options
        attr.OS.TO = null;//True Option
        attr.OS.FO = null;//False Option

        attr.T = [];

        entityMetaData.A.push(attr);


        entityMetaData.DE = 'Broadlook Captured Contact';//Description;

        entityMetaData.CN = 'Captured Contacts';//DisplayCollectionName;
        entityMetaData.DN = 'Captured Contact';//DisplayName;

        entityMetaData.IL = 'blt_/Images/cc/capturerequest16x16.gif';//IconLargeName
        entityMetaData.IM = 'blt_/Images/cc/capturerequest16x16.gif';//IconMediumName
        entityMetaData.IS = 'blt_/Images/cc/capturerequest16x16.gif';//IconSmallName

        entityMetaData.iA = 0;//IsActivity
        entityMetaData.iAP = 0;//IsActivityParty
        entityMetaData.iC = 1;//IsCustomEntity
        entityMetaData.iM = 0;//IsManaged
        entityMetaData.LN = 'cc';//.LogicalName

        entityMetaData.OM = [];//One-to-Many
        entityMetaData.MO = [];//Many-to-Many
        entityMetaData.MM = [];//Many-to-Many

        entityMetaData.ID = null;//MetadataId
        entityMetaData.TC = 'cc';//ObjectTypeCode

        entityMetaData.P = [];//Permissions

        entityMetaData.SN = 'cc';


        Broadlook.EntityMetadataCache.VirtualCache.push(entityMetaData);
        //return entityMetaData;

        return Broadlook.EntityMetadataCache.VirtualCache;
    },

    // Depth All, Attributes, Default, Entity, Privileges, Relationships
    GetDefinition: function (Search, Depth, Force, Callback, CallbackParam) {
        if (Search == null || typeof Search == 'undefined' || Search.trim() == '') { return null; }
                
        //console.log('GetDefinition: ' + Search + '-' + Depth + '-' + Force);
        //if (Broadlook.EntityMetadataCache._entityMetadataCache == null || typeof Broadlook.EntityMetadataCache._entityMetadataCache == 'undefined')
        //{ Broadlook.EntityMetadataCache._entityMetadataCache = []; }
        //console.log(Broadlook.EntityMetadataCache._entityMetadataCache);

        if (Depth == null || typeof Depth == 'undefined') { Depth = ['E']; }
        else if (!Array.isArray(Depth)) { Depth = [Depth]; }
        //else if (!(Object.prototype.toString.call(Depth) == '[object Array]')) { Depth = [Depth]; }
        //else if (!(typeof Depth == 'array')) { Depth = [Depth]; }
        //else if (!(Depth instanceof Array)) { Depth = [Depth]; }

        for (var i = 0; i < Depth.length; i++) {
            switch (Depth[i]) {
                case 'Entity': Depth[i] = 'E'; break;
                case 'Attributes': Depth[i] = 'A'; break;
                case 'Privileges': Depth[i] = 'P'; break;
                case 'Relationships': Depth[i] = 'R'; break;
                default: break;
            }
        }
        //if (Broadlook.EntityMetadataCache._entityMetadataCache == null || typeof Broadlook.EntityMetadataCache._entityMetadataCache == 'undefined') { Broadlook.EntityMetadataCache._entityMetadataCache = []; }

        //console.log('' + Search + '-' + Depth + '-' + Force);
        var found = false;
        var logicalname = Search.toLowerCase();
        var typeCode = Search.toLowerCase();
        var virtualCache = Broadlook.EntityMetadataCache.VirtualDefinitions();

        for (var d = 0; d < virtualCache.length; d++) {
            var virt = virtualCache[d];
            if (virt.TC == Search || virt.LN == Search || virt.SN == Search) {
                return virt;
            }
        }
        var baseCache = Broadlook.EntityMetadataCache.CacheBaseRetreive();
        for (var d = 0; d < baseCache.length; d++) {
            var base = baseCache[d];
            if (base.TC == Search || base.LN == Search || base.SN == Search) {

                logicalname = base.LN;
                typeCode = base.TC;

                found = true;
                if (!Force) {

                    var cache = Broadlook.EntityMetadataCache.CacheRetreive(base.L, base.N);

                    if (cache == null || typeof cache.D == "unknown" || typeof cache.D == "undefined") { break; }

                    //if (!(cache.D instanceof Array)) { cache.D = ['E']; }
                    //if (!(typeof cache.D == 'array')) { cache.D = ['E']; }
                    //if (!(Object.prototype.toString.call(cache.D) == '[object Array]')) { cache.D = ['E']; }
                    if (!Array.isArray(cache.D)) { cache.D = ['E']; }

                    var depthCovered = true;
                    for (var i = 0; i < Depth.length; i++) {
                        if ([].concat(cache.D).indexOf(Depth[i]) < 0) { depthCovered = false; break; }
                    }
                    if (depthCovered) {
                        if (Callback != null) { Callback(cache, CallbackParam); }
                        //else { return cache; }
                        return cache;
                    }
                }
                break;
            }
        }

        //if (!found) { Broadlook.EntityMetadataCache.init(null); }
        //console.log(Depth);

        var entityDefinition = null;

        Broadlook.EntityMetadataCache.CacheBaseIterate(typeCode);

        if (Callback != null) {
            console.log('Loading: ' + logicalname + ' (Async)');
            Broadlook.Metadata.getEntityMetaData(logicalname, ['Entity', 'Attributes', 'Privileges', 'Relationships'], function (Response, Reference, Error) {
                var entityMetadata = null;
                if (Response) entityMetadata = Broadlook.JsonXml.xml2json(Response).Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType.value;

                //console.log(entityMetadata);
                if (entityMetadata == null || typeof entityMetadata == 'undefined') { Callback(null, CallbackParam); }
                else {
                    //console.log(entityMetadata);
                    entityMetadata.D = ['E', 'A', 'P', 'R'];
                    entityMetadata = Broadlook.EntityMetadataCache.AddToCache(entityMetadata, true);
                    Callback(entityMetadata, CallbackParam);
                }

            }, null);
            return null;
        }
        else {
            console.log('Loading: ' + logicalname + ' (Sync)');

            var response = Broadlook.Metadata.getEntityMetaData(logicalname, ['Entity', 'Attributes', 'Privileges', 'Relationships'], null, null);
            if (response) var entityMetadata = Broadlook.JsonXml.xml2json(response).Body.ExecuteResponse.ExecuteResult.Results.KeyValuePairOfstringanyType.value;

            //console.log(Broadlook.JsonXml.xml2json(response));
            //console.log(entityMetadata);

            if (entityMetadata == null || typeof entityMetadata == 'undefined') { return null; }
            else {
                //console.log(entityMetadata);
                entityMetadata.D = ['E', 'A', 'P', 'R'];
                entityMetadata = Broadlook.EntityMetadataCache.AddToCache(entityMetadata, true);
                return entityMetadata;
            }
        }

    },
    AddToCache: function (EntityMetadata, Persist) {
        if (EntityMetadata == null || typeof EntityMetadata == 'undefined') { return; }

        EntityMetadata = Broadlook.EntityMetadataCache.CleanEntityMetaData(EntityMetadata);

        var found = false;
        var baseCache = Broadlook.EntityMetadataCache.CacheBaseRetreive();
        for (var d = 0; d < baseCache.length; d++) {
            //console.log(Broadlook.EntityMetadataCache._entityMetadataCache[d].ObjectTypeCode + '-' + entityDefinition[0].ObjectTypeCode);
            //if (Broadlook.EntityMetadataCache._entityMetadataCache[d].ObjectTypeCode == EntityMetadata.ObjectTypeCode)
            if (baseCache[d].TC == EntityMetadata.TC) { found = true; }
        }
        //console.log('found:' + found);

        //if (!found) { Broadlook.EntityMetadataCache._entityMetadataCache.push(EntityMetadata); }

        if (!found) { Broadlook.EntityMetadataCache.CacheBaseRegisterEntity(EntityMetadata); }
        else { Broadlook.EntityMetadataCache.CacheStore(EntityMetadata); }

        return EntityMetadata;
    },
    CleanEntityMetaData: function (EntityMetaData) {
        var entityMetaData = {};
        console.log('Cleaning: ' + EntityMetaData.LogicalName);

        //console.log(EntityMetaData);
        entityMetaData.TM = EntityMetaData.ActivityTypeMask;
        entityMetaData.D = EntityMetaData.D; //Depth

        //if (EntityMetaData.Attributes.AttributeMetadata instanceof Array) {
        //if (typeof EntityMetaData.Attributes.AttributeMetadata == 'array') {
        //if (Object.prototype.toString.call(EntityMetaData.Attributes.AttributeMetadata) == '[object Array]') {
        if (Array.isArray(EntityMetaData.Attributes.AttributeMetadata)) {
            entityMetaData.A = [];

            for (var a = 0; a < EntityMetaData.Attributes.AttributeMetadata.length; a++) {
                var attr = {};

                attr.AT = EntityMetaData.Attributes.AttributeMetadata[a].AttributeType;
                attr.CN = EntityMetaData.Attributes.AttributeMetadata[a].ColumnNumber;

                if (typeof EntityMetaData.Attributes.AttributeMetadata[a].Description.LocalizedLabels == 'string') { attr.DE = EntityMetaData.Attributes.AttributeMetadata[a].Description.LocalizedLabels; }
                else { attr.DE = EntityMetaData.Attributes.AttributeMetadata[a].Description.LocalizedLabels.LocalizedLabel.Label; }

                if (typeof EntityMetaData.Attributes.AttributeMetadata[a].DisplayName.LocalizedLabels == 'string') { attr.DN = EntityMetaData.Attributes.AttributeMetadata[a].DisplayName.LocalizedLabels; }
                else { attr.DN = EntityMetaData.Attributes.AttributeMetadata[a].DisplayName.LocalizedLabels.LocalizedLabel.Label; }

                attr.iC = (EntityMetaData.Attributes.AttributeMetadata[a].IsCustomAttribute == "true" ? 1 : 0);
                attr.iM = (EntityMetaData.Attributes.AttributeMetadata[a].IsManaged == "true" ? 1 : 0);
                attr.iPI = (EntityMetaData.Attributes.AttributeMetadata[a].IsPrimaryId == "true" ? 1 : 0);
                attr.iPN = (EntityMetaData.Attributes.AttributeMetadata[a].IsPrimaryName == "true" ? 1 : 0);


                attr.iVC = (EntityMetaData.Attributes.AttributeMetadata[a].IsValidForCreate == "true" ? 1 : 0);
                attr.iVR = (EntityMetaData.Attributes.AttributeMetadata[a].IsValidForRead == "true" ? 1 : 0);
                attr.iVU = (EntityMetaData.Attributes.AttributeMetadata[a].IsValidForUpdate == "true" ? 1 : 0);

                attr.LN = EntityMetaData.Attributes.AttributeMetadata[a].LogicalName;
                attr.ID = EntityMetaData.Attributes.AttributeMetadata[a].MetadataId;
                attr.MN = parseFloat(EntityMetaData.Attributes.AttributeMetadata[a].MinValue);
                attr.MX = parseFloat(EntityMetaData.Attributes.AttributeMetadata[a].MaxValue);
                attr.P = parseInt(EntityMetaData.Attributes.AttributeMetadata[a].Precision);
                attr.PS = EntityMetaData.Attributes.AttributeMetadata[a].PrecisionSource;
                attr.DV = EntityMetaData.Attributes.AttributeMetadata[a].DefaultFormValue;
                attr.SN = EntityMetaData.Attributes.AttributeMetadata[a].SchemaName;
                attr.ML = parseInt(EntityMetaData.Attributes.AttributeMetadata[a].MaxLength);

                attr.OS = {};
                attr.OS.O = [];
                attr.OS.TO = null;
                attr.OS.FO = null;


                ProcessOption = function (OptMetaData) {
                    if (OptMetaData != null &&
                        typeof OptMetaData != 'undefined') {

                        var opt = {};
                        if (typeof OptMetaData.Description.LocalizedLabels == 'string')
                        { opt.DE = OptMetaData.Description.LocalizedLabels; }
                        else { opt.DE = OptMetaData.Description.LocalizedLabels.LocalizedLabel.Label; }

                        if (typeof OptMetaData.Label.LocalizedLabels == 'string')
                        { opt.L = OptMetaData.Label.LocalizedLabels; }
                        else { opt.L = OptMetaData.Label.LocalizedLabels.LocalizedLabel.Label; }

                        opt.V = OptMetaData.Value;

                        opt.S = OptMetaData.State;

                        //console.log(opt);
                        return opt;
                    }
                    return null;
                }

                if (typeof EntityMetaData.Attributes.AttributeMetadata[a].OptionSet != 'undefined') {
                    if (typeof EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options != 'undefined') {
                        if (typeof EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata != 'undefined') {
                            //if (!(EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata instanceof Array))
                            //if (!(typeof EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata == 'array'))
                            //if (!(Object.prototype.toString.call(EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata) == '[object Array]'))
                            if (!Array.isArray(EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata))
                            { EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata = [EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata]; }

                            for (var o = 0 ; o < EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata.length; o++) {
                                var opt = ProcessOption(EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.Options.OptionMetadata[o], attr.OptionSet);
                                if (opt != null) { attr.OS.O.push(opt); }
                            }
                        }
                    }
                    attr.OS.TO = ProcessOption(EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.TrueOption);
                    attr.OS.FO = ProcessOption(EntityMetaData.Attributes.AttributeMetadata[a].OptionSet.FalseOption);
                }

                attr.T = []
                if (typeof EntityMetaData.Attributes.AttributeMetadata[a].Targets != 'undefined') {
                    //if (!(EntityMetaData.Attributes.AttributeMetadata[a].Targets.string instanceof Array)) { EntityMetaData.Attributes.AttributeMetadata[a].Targets.string = [EntityMetaData.Attributes.AttributeMetadata[a].Targets.string]; }
                    //if (!(typeof EntityMetaData.Attributes.AttributeMetadata[a].Targets.string == 'array')) { EntityMetaData.Attributes.AttributeMetadata[a].Targets.string = [EntityMetaData.Attributes.AttributeMetadata[a].Targets.string]; }
                    //if (!(Object.prototype.toString.call(EntityMetaData.Attributes.AttributeMetadata[a].Targets.string) == '[object Array]')) { EntityMetaData.Attributes.AttributeMetadata[a].Targets.string = [EntityMetaData.Attributes.AttributeMetadata[a].Targets.string]; }
                    if (!Array.isArray(EntityMetaData.Attributes.AttributeMetadata[a].Targets.string)) { EntityMetaData.Attributes.AttributeMetadata[a].Targets.string = [EntityMetaData.Attributes.AttributeMetadata[a].Targets.string]; }
                    var baseCache = Broadlook.EntityMetadataCache.CacheBaseRetreive();
                    for (var o = 0 ; o < EntityMetaData.Attributes.AttributeMetadata[a].Targets.string.length; o++) {
                        //if (EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o] == EntityMetaData.LogicalName ||
                        //    EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o] == EntityMetaData.SchemaName ||
                        //    EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o] == EntityMetaData.ObjectTypeCode)
                        //{ attr.T.push(EntityMetaData.ObjectTypeCode); }
                        //else { attr.T.push(Broadlook.EntityMetadataCache.GetTypeCode(EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o])); }
                        //attr.T.puksh(EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o]);
                        for (var d = 0; d < baseCache.length; d++) {
                            //console.log(Broadlook.EntityMetadataCache._entityMetadataCache[d].ObjectTypeCode + '-' + entityDefinition[0].ObjectTypeCode);
                            //if (Broadlook.EntityMetadataCache._entityMetadataCache[d].ObjectTypeCode == EntityMetadata.ObjectTypeCode)
                            if (baseCache[d].LN == EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o] ||
                                baseCache[d].SN == EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o] ||
                                baseCache[d].TC == EntityMetaData.Attributes.AttributeMetadata[a].Targets.string[o]) { attr.T.push(baseCache[d].TC); break; }
                        }

                    }
                }


                entityMetaData.A.push(attr);

                //attr.AttributeOf: "preferredcontactmethodcode"
                //attr.CanBeSecuredForCreate: "false"
                //attr.CanBeSecuredForRead: "false"
                //attr.CanBeSecuredForUpdate: "false"
                //attr.CanModifyAdditionalSettings: Object
                //attr.DeprecatedVersion: Object
                //attr.EntityLogicalName: "account"
                //attr.HasChanged: Object
                //attr.IsAuditEnabled: Object
                //attr.IsCustomizable: Object
                //attr.IsRenameable: Object
                //attr.IsSecured: "false"
                //attr.IsValidForAdvancedFind: Object
                //attr.IsValidForCreate: "false"
                //attr.IsValidForRead: "true"
                //attr.IsValidForUpdate: "false"
                //attr.LinkedAttributeId: Object
                //attr.RequiredLevel: Object
            }
        } else if (typeof EntityMetaData.Attributes == 'string') { entityMetaData.A = []; } else { entityMetaData.A = null; }

        //entityMetaData.CanBeInManyToMany = EntityMetaData.CanBeInManyToMany;
        //entityMetaData.D = EntityMetaData.Depth;
        if (typeof EntityMetaData.Description.LocalizedLabels == 'string') { entityMetaData.DE = EntityMetaData.Description.LocalizedLabels; }
        else { entityMetaData.DE = EntityMetaData.Description.LocalizedLabels.LocalizedLabel.Label; }

        if (typeof EntityMetaData.DisplayCollectionName.LocalizedLabels == 'string') { entityMetaData.CN = EntityMetaData.DisplayCollectionName.LocalizedLabels; }
        else { entityMetaData.CN = EntityMetaData.DisplayCollectionName.LocalizedLabels.LocalizedLabel.Label; }

        if (typeof EntityMetaData.DisplayName.LocalizedLabels == 'string') { entityMetaData.DN = EntityMetaData.DisplayName.LocalizedLabels; }
        else { entityMetaData.DN = EntityMetaData.DisplayName.LocalizedLabels.LocalizedLabel.Label; }

        if (typeof EntityMetaData.IconLargeName == 'string') { entityMetaData.IL = EntityMetaData.IconLargeName; } else { entityMetaData.IL = null; }
        if (typeof EntityMetaData.IconMediumName == 'string') { entityMetaData.IM = EntityMetaData.IconMediumName; } else { entityMetaData.IM = null; }
        if (typeof EntityMetaData.IconSmallName == 'string') { entityMetaData.IS = EntityMetaData.IconSmallName; } else { entityMetaData.IS = null; }
        //entityMetaData.IL = EntityMetaData.IconLargeName;
        //entityMetaData.IM = EntityMetaData.IconMediumName;
        //entityMetaData.IS = EntityMetaData.IconSmallName;

        entityMetaData.iA = (EntityMetaData.IsActivity == "true" ? 1 : 0);
        entityMetaData.iAP = (EntityMetaData.IsActivityParty == "true" ? 1 : 0);
        entityMetaData.iC = (EntityMetaData.IsCustomEntity == "true" ? 1 : 0);
        entityMetaData.iM = (EntityMetaData.IsManaged == "true" ? 1 : 0);
        entityMetaData.LN = EntityMetaData.LogicalName;

        ProcessRelationship = function (RelationShip) {
            if (RelationShip != null &&
                typeof RelationShip != 'undefinded') {
                var rel = {};

                //rel.IsCustomRelationship = RelationShip.IsCustomRelationship;
                //rel.IsManaged = RelationShip.IsManaged;
                //rel.MetadataId = RelationShip.MetadataId;
                rel.RA = RelationShip.ReferencedAttribute;
                rel.RE = RelationShip.ReferencedEntity;
                rel.rA = RelationShip.ReferencingAttribute;
                rel.rE = RelationShip.ReferencingEntity;
                rel.SN = RelationShip.SchemaName;

                //rel.AssociatedMenuConfiguration: Object
                //rel.CascadeConfiguration: Object
                //rel.HasChanged: Object
                //rel.IsCustomizable: Object
                //rel.IsValidForAdvancedFind: "true"
                //rel.RelationshipType: "OneToManyRelationship"
                //rel.SecurityTypes: "None"

                //console.log(rel);
                return rel;
            }
            return null;
        }

        //if (EntityMetaData.OneToManyRelationships.OneToManyRelationshipMetadata instanceof Array) {
        //if (typeof EntityMetaData.OneToManyRelationships.OneToManyRelationshipMetadata == 'array') {
        //if (Object.prototype.toString.call(EntityMetaData.OneToManyRelationships.OneToManyRelationshipMetadata) == '[object Array]') {
        if (Array.isArray(EntityMetaData.OneToManyRelationships.OneToManyRelationshipMetadata)) {
            entityMetaData.OM = [];

            for (var r = 0; r < EntityMetaData.OneToManyRelationships.OneToManyRelationshipMetadata.length; r++) {
                var rel = ProcessRelationship(EntityMetaData.OneToManyRelationships.OneToManyRelationshipMetadata[r]);
                if (rel != null) { entityMetaData.OM.push(rel); }
            }
        } else if (typeof EntityMetaData.OneToManyRelationships == 'string') { entityMetaData.OM = []; } else { entityMetaData.OM = null; }

        //if (EntityMetaData.ManyToOneRelationships.OneToManyRelationshipMetadata instanceof Array) {
        //if (typeof EntityMetaData.ManyToOneRelationships.OneToManyRelationshipMetadata == 'array') {
        //if (Object.prototype.toString.call(EntityMetaData.ManyToOneRelationships.OneToManyRelationshipMetadata) == '[object Array]') {
        if (Array.isArray(EntityMetaData.ManyToOneRelationships.OneToManyRelationshipMetadata)) {
            entityMetaData.MO = [];

            for (var r = 0; r < EntityMetaData.ManyToOneRelationships.OneToManyRelationshipMetadata.length; r++) {
                var rel = ProcessRelationship(EntityMetaData.ManyToOneRelationships.OneToManyRelationshipMetadata[r]);
                if (rel != null) { entityMetaData.MO.push(rel); }
            }
        } else if (typeof EntityMetaData.ManyToOneRelationships == 'string') { entityMetaData.MO = []; } else { entityMetaData.MO = null; }

        //if (EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata instanceof Array) {
        //if (EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata == 'array') {
        //if (Object.prototype.toString.call(EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata) == '[object Array]') {
        if (Array.isArray(EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata)) {
            entityMetaData.MM = [];

            for (var r = 0; r < EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata.length; r++) {

                var rel = {};

                rel.A1 = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].Entity1IntersectAttribute;
                rel.E1 = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].Entity1LogicalName;
                rel.A2 = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].Entity2IntersectAttribute;
                rel.E2 = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].Entity2LogicalName;
                rel.E = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].IntersectEntityName;
                //rel.IsCustomRelationship = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].IsCustomRelationship;
                //rel.IsManaged = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].IsManaged;
                rel.ID = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].MetadataId;
                rel.SN = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].SchemaName;
                //rel.SecurityTypes = EntityMetaData.ManyToManyRelationships.ManyToManyRelationshipMetadata[r].SecurityTypes;

                //rel.Entity1AssociatedMenuConfiguration: Object
                //rel.Entity2AssociatedMenuConfiguration: Object
                //rel.HasChanged: Object
                //rel.IsCustomizable: Object
                //rel.IsValidForAdvancedFind: "true"
                //rel.RelationshipType: "ManyToManyRelationship"

                entityMetaData.MM.push(rel);
            }
        } else if (typeof EntityMetaData.ManyToManyRelationships == 'string') { entityMetaData.MM = []; } else { entityMetaData.MM = null; }

        entityMetaData.ID = EntityMetaData.MetadataId;
        entityMetaData.TC = EntityMetaData.ObjectTypeCode;

        entityMetaData.PI = EntityMetaData.PrimaryIdAttribute;
        entityMetaData.PN = EntityMetaData.PrimaryNameAttribute;



        //if (EntityMetaData.Privileges.SecurityPrivilegeMetadata instanceof Array) {
        //if (typeof EntityMetaData.Privileges.SecurityPrivilegeMetadata == 'array') {
        //if (Object.prototype.toString.call(EntityMetaData.Privileges.SecurityPrivilegeMetadata) == '[object Array]') {
        if (Array.isArray(EntityMetaData.Privileges.SecurityPrivilegeMetadata)) {
            entityMetaData.P = [];

            for (var p = 0; p < EntityMetaData.Privileges.SecurityPrivilegeMetadata.length; p++) {
                var priv = {}

                priv.B = EntityMetaData.Privileges.SecurityPrivilegeMetadata[p].CanBeBasic;
                priv.D = EntityMetaData.Privileges.SecurityPrivilegeMetadata[p].CanBeDeep;
                priv.G = EntityMetaData.Privileges.SecurityPrivilegeMetadata[p].CanBeGlobal;
                priv.L = EntityMetaData.Privileges.SecurityPrivilegeMetadata[p].CanBeLocal;
                priv.N = EntityMetaData.Privileges.SecurityPrivilegeMetadata[p].Name;
                priv.ID = EntityMetaData.Privileges.SecurityPrivilegeMetadata[p].PrivilegeId;
                priv.T = EntityMetaData.Privileges.SecurityPrivilegeMetadata[p].PrivilegeType;

                entityMetaData.P.push(priv);
            }
        } else if (typeof EntityMetaData.Privileges == 'string') { entityMetaData.P = []; } else { entityMetaData.P = null; }

        //if (entityMetaData.Privileges instanceof Array) { entityMetaData.Privileges = EntityMetaData.Privileges; }
        //else { entityMetaData.Privileges = []; }

        entityMetaData.SN = EntityMetaData.SchemaName;

        //entityMetaData.IsAuditEnabled: Object
        //entityMetaData.IsAvailableOffline: "true"
        //entityMetaData.IsChildEntity: "false"
        //entityMetaData.IsConnectionsEnabled: Object
        //entityMetaData.HasChanged: Object
        //entityMetaData.AutoRouteToOwnerQueue: "false"
        //entityMetaData.CanBePrimaryEntityInRelationship: Object
        //entityMetaData.CanBeRelatedEntityInRelationship: Object
        //entityMetaData.CanCreateAttributes: Object
        //entityMetaData.CanCreateCharts: Object
        //entityMetaData.CanCreateForms: Object
        //entityMetaData.CanCreateViews: Object
        //entityMetaData.CanModifyAdditionalSettings: Object
        //entityMetaData.CanTriggerWorkflow: "false"
        //entityMetaData.IsCustomizable: Object
        //entityMetaData.IsDocumentManagementEnabled: "false"
        //entityMetaData.IsDuplicateDetectionEnabled: Object
        //entityMetaData.IsEnabledForCharts: "false"
        //entityMetaData.IsImportable: "false"
        //entityMetaData.IsIntersect: "false"
        //entityMetaData.IsMailMergeEnabled: Object
        //entityMetaData.IsMappable: Object
        //entityMetaData.IsReadingPaneEnabled: "true"
        //entityMetaData.IsRenameable: Object
        //entityMetaData.IsValidForAdvancedFind: "false"
        //entityMetaData.IsValidForQueue: Object
        //entityMetaData.IsVisibleInMobile: Object
        //entityMetaData.OwnershipType: "OrganizationOwned"
        //entityMetaData.RecurrenceBaseEntityLogicalName: Object
        //entityMetaData.ReportViewName: "FilteredSdkMessageRequestField"

        //console.log(entityMetaData);

        return entityMetaData;
    },
    //GetWindowStorage: function () {
    //    var windowStorage = Broadlook.EntityMetadataCache.GetParentRecursive(window).windowStorage;
    //    if (windowStorage == null || typeof windowStorage == 'undefined') {
    //        Broadlook.EntityMetadataCache.SetWindowStorage({});
    //        Broadlook.EntityMetadataCache.GetWindowStorage();
    //    } else {
    //        return windowStorage;
    //    }
    //},
    //SetWindowStorage: function (WindowStorage) {
    //    var parentWindow = Broadlook.EntityMetadataCache.GetParentRecursive(window);
    //    parentWindow.windowStorage = WindowStorage;
    //},
    //GetParentRecursive: function (currentWindow) {
    //    console.log(currentWindow);
    //    return currentWindow.top;
    //    //console.log(currentWindow);
    //    //if (currentWindow.parent != null || typeof currentWindow.parent != 'undefined') {
    //    //    if (currentWindow.parent.opener != null || typeof currentWindow.parent.opener != 'undefined')
    //    //    { return Broadlook.EntityMetadataCache.GetParentRecursive(currentWindow.parent.opener); }
    //    //    else { return Broadlook.EntityMetadataCache.GetParentRecursive(currentWindow.parent); }
    //    //} else { return currentWindow; }
    //},
    CacheStore: function (EntityMetadata) {
        //if (Broadlook.EntityMetadataCache.windowStorage == null || typeof Broadlook.EntityMetadataCache.windowStorage == 'undefined') { Broadlook.EntityMetadataCache.windowStorage = {}; }

        //console.log(Broadlook.EntityMetadataCache._entityMetadataCache);
        //if (EntityMetadata instanceof Object) {
        if (typeof EntityMetadata == 'object') {
            try {

                try {
                    var base = Broadlook.EntityMetadataCache.CacheBaseRetreive();
                    for (var e = 0 ; e < base.length; e++) {
                        //console.log(Broadlook.EntityMetadataCache._entityMetadataCache[e]);
                        if (base[e].SN == EntityMetadata.SN) {
                            //var current = null;
                            //current = Broadlook.EntityMetadataCache.CacheRetreive(base[e].L, base[e].N, true);
                            if (window.opener) { window.opener.top[base[e].N] = EntityMetadata; }
                            else { window.top[base[e].N] = EntityMetadata; }

                            if (typeof localStorage != 'undefined' && typeof localStorage != 'unknown' && localStorage != null) {

                                //if (current == null || (EntityMetadata.D >= current.D)) {
                                var cache = JSON.stringify(EntityMetadata);
                                if (base[e].L == 'L') { localStorage.setItem(base[e].N, cache); }
                                else { sessionStorage.setItem(base[e].N, cache); }
                                break;
                                //}
                                //break;
                            }
                        }
                    }
                } catch (e) {
                    console.log('Entity Cache Submit Error');
                    //console.log(e);
                    console.log(e.message);
                    //windowStorage[base[e].N] = cache;
                }
            } catch (e) {
                console.log('Entity Cache Submit Error');
                //console.log(e);
                console.log(e.message);
            }
        } else { }
    },
    CacheRetreive: function (Location, Name, IngoreWindow) {
        //if (Broadlook.EntityMetadataCache.windowStorage == null || typeof Broadlook.EntityMetadataCache.windowStorage == 'undefined') { Broadlook.EntityMetadataCache.windowStorage = {}; }
        var cache = null;
        if (IngoreWindow != true) {
            if (window.opener) { if (typeof window.opener.top[Name] == "unknown") cache = null; else cache = window.opener.top[Name]; }
            else { cache = window.top[Name]; }

            //window.opener.top[Name];
            //if (cache instanceof Object) { return cache; }
            if (typeof cache == 'object' && cache != null && typeof cache.D != 'undefined' && typeof cache.D != 'unknown') { return cache; }
            else { cache = null; }
        }
        if (typeof localStorage != 'undefined' && typeof localStorage != 'unknown' && localStorage != null) {
            if (cache == null) {
                if (Location == 'L' && localStorage.getItem(Name) != null) {
                    try { cache = JSON.parse(localStorage.getItem(Name)); }
                    catch (e) { console.log('Error Parsing from Local Storage: ' + e.message); }
                }
                if (cache == null && sessionStorage.getItem(Name) != null) {
                    try { cache = JSON.parse(sessionStorage.getItem(Name)); }
                    catch (e) { console.log('Error Parsing from Session Storage: ' + e.message); }
                }
                if (Location != 'L' && cache == null && localStorage.getItem(Name) != null) {
                    try { cache = JSON.parse(localStorage.getItem(Name)); }
                    catch (e) { console.log('Error Parsing from Local Storage (Not Defined Location): ' + e.message); }
                }
                if (cache != null && IngoreWindow != true) {
                    if (window.opener) { window.opener.top[Name] = cache; }
                    else { window.top[Name] = cache; }
                }
            }
        }
        return cache;
    },
    CacheBaseIterate: function (TypeCode) {
        if (typeof localStorage != 'undefined' && typeof localStorage != 'unknown' && localStorage != null) {
            var cache = Broadlook.EntityMetadataCache.CacheBaseRetreive();
            for (var e = 0; e < cache.length; e++) {
                if (cache[e].TC == TypeCode) {
                    cache[e].C++;
                    break;
                }
            }
            cache.sort(function (a, b) { return b.C - a.C; });

            //var top = 0;
            for (var e = 0; e < cache.length; e++) {
                if (cache[e].C != 0 && (e < 25 || (top != 0 && top == cache[e].C))) {
                    if (cache[e].L != 'L' && sessionStorage.getItem(cache[e].N) != null) {
                        localStorage.setItem(cache[e].N, sessionStorage.getItem(cache[e].N));
                        sessionStorage.removeItem(cache[e].N);
                    }
                    cache[e].L = 'L';
                    sessionStorage.removeItem(cache[e].N);
                } else {
                    if (cache[e].L == 'L' && localStorage.getItem(cache[e].N) != null) {
                        sessionStorage.setItem(cache[e].N, localStorage.getItem(cache[e].N));
                        localStorage.removeItem(cache[e].N);
                    }
                    cache[e].L = 'S';
                    localStorage.removeItem(cache[e].N);
                }
            }
            localStorage.setItem('MDCb', JSON.stringify(cache));
        }
    },
    CacheBaseRetreive: function () {
        var cache = null;
        try {
            if (typeof localStorage != 'undefined' && typeof localStorage != 'unknown' && localStorage != null) {
                cache = JSON.parse(localStorage.getItem('MDCb'));
            } else {
                if (window.opener) { cache = window.opener.top.MDCb; }
                else { cache = window.top.MDCb; }
            }

            //cache = JSON.parse(localStorage.getItem('MDCb'));
            //console.log(cache);
        } catch (e) {
            console.log('Entity Cache Retreived Error');
            //console.log(e);
            //console.log(e.message);
            //console.log(localStorage.getItem('MDCb'));
            //throw e;
            if (typeof localStorage != 'undefined' && typeof localStorage != 'unknown' && localStorage != null) {
                localStorage.removeItem('MDCb');
            } else {
                if (window.opener) { window.opener.top.MDCb = null; window.opener.top.MDCl = null; }
                else { window.top.MDCb = null; window.top.MDCl = null; }
            }
            //localStorage.removeItem('MDCb');
        }
        //if (!(cache instanceof Array)) {
        //if (!(typeof cache == 'array')) {
        //if (!(Object.prototype.toString.call(cache) == '[object Array]')) {
        if (!Array.isArray(cache)) {
            if (window.opener) { window.opener.top.MDCb = null; window.opener.top.MDCl = null; }
            else { window.top.MDCb = null; window.top.MDCl = null; }
            cache = [];
            //Broadlook.EntityMetadataCache.CacheDelete();
        }
        return cache;
    },
    CacheSessionRetreive: function () {
        try {
            var mdcl = null;
            if (window.opener) { mdcl = window.opener.top.MDCl; }
            else { mdcl = window.top.MDCl; }

            if (mdcl != null || mdcl != 'undefined') { return mdcl; }
            else { return null; }
            //console.log(cache);
        } catch (e) {
            console.log('Entity Session Retreived Error');
            //console.log(e);
            console.log(e.message);
            return null;
        }
    },
    CacheSessionSet: function () {
        //console.log('Set Session Cache');
        if (window.opener) { window.opener.top.MDCl = true; }
        else { window.top.MDCl = true; }
    },
    CacheBaseRegisterEntity: function (Cache) {
        var base = Broadlook.EntityMetadataCache.CacheBaseRetreive();
        var n = 'MDC_' + Cache.TC;
        var c = 0;
        var l = 'S';
        switch (Cache.TC) {
            case '1':
            case '2':
            case '4':
                c = 1000; l = 'L'; break;
            case '3':
            case '1084':
            case '1090':
            case '1088':
                c = 50; l = 'L'; break;
            default: c = 0; l = 'S'; break;
        }

        base.push({
            'TC': Cache.TC,
            'LN': Cache.LN,
            'SN': Cache.SN,
            'L': l,
            'N': n,
            'C': c
        });
        if (typeof localStorage != 'undefined' && typeof localStorage != 'unknown' && localStorage != null) {
            localStorage.setItem('MDCb', JSON.stringify(base));
        } else {
            if (window.opener) { window.opener.top.MDCb = base; }
            else { window.top.MDCb = base; }
        }
        Broadlook.EntityMetadataCache.CacheStore(Cache);
    },
    CacheBaseRegister: function (BaseCache) {
        //var base = [];
        for (var e = 0 ; e < BaseCache.length; e++) {
            Broadlook.EntityMetadataCache.CacheBaseRegisterEntity(BaseCache[e]);
        }
    },
    CacheDelete: function () {
        if (typeof localStorage != 'undefined' && typeof localStorage != 'unknown' && localStorage != null) {
            for (var l = localStorage.length - 1; l >= 0; l--) {
                if (localStorage.key(l).substring(0, 3) == 'MDC')
                { localStorage.removeItem(localStorage.key(l)); }
            }
            for (var s = sessionStorage.length - 1; s >= 0 ; s--) {
                if (sessionStorage.key(s).substring(0, 3) == 'MDC')
                { sessionStorage.removeItem(sessionStorage.key(s)); }
            }
            localStorage.removeItem('MDCb');
            sessionStorage.removeItem('MDCb');
            //document.cookie = ['BLT_EntityMetaDataCache=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
        }
    }
}
