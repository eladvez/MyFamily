function insertframe_adjustHeight(obj, offset) {
	var helpFrame = jQuery("#" + obj.name);
	var innerDoc = (helpFrame.get(0).contentDocument) ? helpFrame.get(0).contentDocument : helpFrame.get(0).contentWindow.document;
	var el = innerDoc.body.parentElement;
    var innerDocHeight = el.scrollHeight < el.offsetHeight ? el.scrollHeight : el.offsetHeight;
    if (jQuery.browser.msie) {
	   var innerDocHeight = el.scrollHeight;
    }
	helpFrame.height(innerDocHeight + offset);
}

function inserframe_crossdomain_adjustHeight(obj, offset ) {
	var helpFrame = jQuery("#" + obj.name);
    jQuery.postMessage({event:"insertframe_get_height",url:location.href,"name":obj.name,"offset":offset},helpFrame.attr('src'),helpFrame.get(0).contentWindow);
}

function insertframe_get_params(query) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
    var urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}
        
function insertframe_attach_child_receive_event(origins) {
            
    jQuery.receiveMessage(function(e){insertframe_receive_event(e);},  
                          function(e) {var re = new RegExp(origins.join("|"), "i");
                                       return(e.match(re) != null);
                          }
    );
}
        
function insertframe_attach_parent_receive_event() {
            
    jQuery.receiveMessage(
      function(e){
        var eventParams = insertframe_get_params(e.data);    
        var helpFrame = jQuery("#" + eventParams["name"]);
        var a = document.createElement('a');
        a.href = helpFrame.attr('src');
        if (eventParams["event"] == "insertframe_return_height" && e.origin == a.protocol + "//" + a.hostname) {
            helpFrame.height((eventParams["height"] * 1) + (eventParams["offset"] *1));
        }
      },
      function(e) {return true;}

    );
}

function insertframe_receive_event(e) {
    var eventParams = insertframe_get_params(e.data);
    if (eventParams["event"] == "insertframe_get_height") {
        var height = $("body").height();
        eventParams["event"]="insertframe_return_height";
        eventParams["height"] = height;
        $.postMessage(eventParams,eventParams["url"]);
    }
}
