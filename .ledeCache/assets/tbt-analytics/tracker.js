// TPC  Analytics for Features v1.1

(function() {

  var _global = this;

  var rvidCookie = 'rvid';
  var pageviewToken = createUUID();
  var adCount = 0;

  var siteInfo = {  // most specific to most general

    "tampabay.com": { "src": 1, "backend": "api" }
  };

  var sourceSite=1, backend = "api";

  // Find info for current site
  for( info in siteInfo) {
    if( window.location.href.indexOf(info) > -1) {
      sourceSite = siteInfo[info]["src"];
      backend = siteInfo[info]["backend"];
      break;
    }
  }

  var serviceBackend = "http://" + backend + ".tampabay.com/svc/analytics/v1";
  var rvid = getCookie( rvidCookie);

  checkSetRVID();
  tpca();

  // Public functions

  function tpca( ) {

    var d = new Date();

    xhrSend( serviceBackend + "/pageview",
      {
        'rvid': rvid,
        'udr_social_tb': '',
        'gig_llu': '',
        'sync_user_id': '',
        'sync_user_name': '',
        'width': window.screen.width,
        'height': window.screen.height,
        'innerWidth': window.innerWidth,
        'innerHeight': window.innerHeight,
        'tzOffset': d.getTimezoneOffset(),
        'time': Math.floor(d.getTime() / 1000),
        'url': window.location.href,
        'referrer': document.referrer,
        'source': sourceSite,
        'first':  '0',
        'pvt': pageviewToken
      },
      null);

    // Ad tracking

    installAdEventHandlers();

    // Scroll tracking

    var lastHeight, lastY, lastInnerHeight = 0;

    setTimeout( scrollHandler, 5000);

    // Dwell time tracking via scroll events
    setTimeout( function() { sendScroll(true) }, 30000);
    setTimeout( function() { sendScroll(true) }, 60000);
    setTimeout( function() { sendScroll(true) }, 120000);
    setTimeout( function() { sendScroll(true) }, 300000);


    function scrollHandler() {
      setTimeout( scrollHandler, 5000);
      sendScroll( false);
    }

    function sendScroll( forceSend) {
      var body = document.body,
        html = document.documentElement,
        yPos = window.pageYOffset || document.documentElement.scrollTop;
      var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

      if( forceSend || height != lastHeight || yPos != lastY || window.innerHeight != lastInnerHeight) {
        lastHeight = height;
        lastInnerHeight = window.innerHeight;
        lastY = yPos;

        scrollpos( yPos, window.innerWidth, window.innerHeight, height);
      }
    }

    function installAdEventHandlers() {
      if(typeof googletag === 'undefined' ||  typeof googletag.pubads !== 'function') {
        //console.log('googletag not yet defined, retrying...');
        if( adCount++ < 8) {
          setTimeout( installAdEventHandlers, 500);
        }
        return;
      }
      googletag.pubads().addEventListener('slotRenderEnded', function (e) {
        //console.log( "slotRenderEnded24: div = ", e.slot.l.m, ", creativeId = ", e.creativeId, ", lineItemId = ", e.lineItemId);
        var elem = document.getElementById(e.slot.getSlotElementId());
        if (elem != null) {
          var att = document.createAttribute("data-creative-id");
          var creativeId = e.creativeId != null ? e.creativeId : 0;
          var lineItemId = e.lineItemId != null ? e.lineItemId : 0;
          att.value = creativeId;
          elem.setAttributeNode(att);
          att = document.createAttribute("data-line-item-id");
          att.value = lineItemId;
          elem.setAttributeNode(att);

          var rect = elem.getBoundingClientRect();
        }
        adrendered(creativeId, lineItemId, e.slot.getSlotElementId(), rect.top, rect.right, rect.bottom, rect.left);
      });

      googletag.pubads().addEventListener('impressionViewable', function (e) {
        //var elem = document.getElementById( e.slot.l.m);
        var elem = document.getElementById(e.slot.getSlotElementId());
        if (elem != null) {
          var creativeId = elem.getAttribute("data-creative-id");
          var lineItemId = elem.getAttribute("data-line-item-id");
        }
        adviewable(creativeId, lineItemId, e.slot.getSlotElementId());
      });
    }
  }

  function adrendered( creativeId, lineItemId, div, top, right, bottom, left) {
    xhrSend( serviceBackend + "/adrender",
      {
        'rvid': rvid,
        'url': window.location.href,
        'creativeid': creativeId != null ? creativeId : 0,
        'lineitemid': lineItemId != null ? lineItemId : 0,
        'div': div !== undefined ? div : '',
        'top': Math.floor(top),
        'left': Math.floor(left),
        'bottom': Math.floor(bottom),
        'right': Math.floor(right),
        'pvt': pageviewToken,
        'source': sourceSite
      },
      null);
  }

  function adviewable( creativeId, lineItemId, div) {
    xhrSend( serviceBackend + "/advisible",
      {
        'rvid': rvid,
        'creativeid': creativeId != null ? creativeId : 0,
        'lineitemid': lineItemId != null ? lineItemId : 0,
        'div': div !== undefined ? div : '',
        'url': window.location.href,
        'pvt': pageviewToken,
        'source': sourceSite
      },
      null);
  }

  function msglog( message, data) {
    var d = new Date();

    xhrSend( serviceBackend + "/msglog",
      {
        'rvid': rvid,
        'url': window.location.href,
        'time': Math.floor(d.getTime() / 1000),
        'source': sourceSite,
        'message': message,
        'data': data
      },
      null);
  }

  function scrollpos( ypos, viswidth, visheight, pageheight) {
    var d = new Date();

    xhrSend( serviceBackend + "/scrollpos",
      {
        'rvid': rvid,
        'url': window.location.href,
        'time': Math.floor(d.getTime() / 1000),
        'source': sourceSite,
        'pvt': pageviewToken,
        'ypos': ypos,
        'viswidth': viswidth,
        'visheight': visheight,
        'pageheight': pageheight
      },
      null);
  }

  /*********************************************/

  _global.tpca = tpca;
  _global.tpca_msglog = msglog;
  _global.tpca_scrollpos = scrollpos;
  _global.tpca_adrendered = adrendered;
  _global.tpca_adviewable = adviewable;

  // Private functions

  function checkSetRVID() {
    if( rvid == null) {
      rvid = createUUID();
      console.log( 'generated new rvid: ' + rvid);
      var CookieDate = new Date;
      CookieDate.setFullYear(CookieDate.getFullYear( )+10);
      setCookie( rvidCookie, rvid, CookieDate, '/', '', false);
    }
  }

  function xhrSend( url, params, loadFunction) {
    var http = new XMLHttpRequest();

    checkSetRVID();

    if( false) {
      // POST
      http.open("POST", url, true);
      http.setRequestHeader("Content-type", "application/json");
      http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
          if( typeof loadFunction == 'function') {
            loadFunction(http.responseText);
          }
        }
      }
      http.send( JSON.stringify( params));
    } else {
      // GET
      var pstr = '';
      extension = '.gif';

      for (var name in params) {
        if (params.hasOwnProperty(name)) {
          pstr += name + "=" + encodeURIComponent(params[name]).replace(RegExp('-', 'g'), '%2D') + "&";
        }
      }

      http.open("GET", url + extension + "?" + pstr, true);
      http.onreadystatechange = function() {
        if(http.readyState == 4) {
          if( http.status >= 200 && http.status <= 299) {
            if( loadFunction != null) {
              loadFunction(http.responseText);
            }
          }
        }
      }
      http.send( null);
    }
  }

  // ref: Chirp Internet: www.chirp.com.au
  function getCookie(name)  {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }

  // ref: https://developer.mozilla.org/en-US/docs/Web/API/document/cookie
  function setCookie(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  }

  function createUUID() {
    var s = [];
    var charVals = "0123456789abcdefghijklmnopqrstuv";

    var _crypto = window.crypto || window.msCrypto;
    if (_crypto && _crypto.getRandomValues) {
      try {
        var _rnds8 = new Uint8Array(36);
        _crypto.getRandomValues(_rnds8);

        for (var i = 0; i < 36; i++) {
          s[i] = charVals.substr( (_rnds8[i] & 31), 1);
        }
      } catch(e) {}
    } else {  // fallback to Math.random()
      for (var i = 0; i < 36; i++) {
        s[i] = charVals.substr(Math.floor(Math.random() * 32), 1);
      }
    }
    return s.join("");
  }
}).call(this);
