document.write('<script type="text/javascript" src="'+'\x2f_common\x2fglobal.ashx\x3fver\x3d2008624002'+'"></'+'script>')
document.write('<script type="text/javascript" src="'+'\x2f_common\x2fwindowinformation\x2fwindowinformation.js.aspx\x3flcid\x3d1033\x26amp\x3bver\x3d2008624002'+'"></'+'script>')
document.write('<script type="text/javascript" src="'+'\x2f_common\x2fentityproperties\x2fentitypropertiesutil.js.aspx\x3ftstamp\x3d2116874000\x26amp\x3bver\x3d2008624002'+'"></'+'script>')
function GetGlobalContext(){return Xrm.Page.context};var xhr = new XMLHttpRequest();
xhr.open("GET", "/WebResources/ClientGlobalContext.js.aspx", false);
if(xhr.addEventListener) {
   xhr.addEventListener('load',function(){if(xhr.status == 200){eval(xhr.responseText);}});
 } else { 
xhr.onreadystatechange  = function() { if (xhr.readyState==4 && xhr.status==200) {eval(xhr.responseText);} }
 }
xhr.setRequestHeader("Content-Type", "application/json");xhr.send();
