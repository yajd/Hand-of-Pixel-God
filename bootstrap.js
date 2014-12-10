const {interfaces: Ci, utils: Cu, classes: Cc} = Components;
const self = {
	name: 'Hand of Pixel God',
	id: 'Hand-of-Pixel-God@jetpack',
	path: {
		chrome: 'chrome://hand-of-pixel-god/content/',
		locale: 'chrome://hand-of-pixel-god/locale/',
	}
};

const BreakException = {};
const myServices = {};

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');
XPCOMUtils.defineLazyGetter(myServices, 'stringBundle', function () { return Services.strings.createBundle(self.path.locale + 'bootstrap.properties?' + Math.random()) /* Randomize URI to work around bug 719376 */ });
Cu.import('resource:///modules/CustomizableUI.jsm');

const uri_cuiCss = Services.io.newURI(self.path.chrome + 'cui.css', null, null);


/*start - windowlistener*/
var windowListener = {
	//DO NOT EDIT HERE
	onOpenWindow: function (aXULWindow) {
		// Wait for the window to finish loading
		var aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
		aDOMWindow.addEventListener('load', function () {
			aDOMWindow.removeEventListener('load', arguments.callee, false);
			windowListener.loadIntoWindow(aDOMWindow);
		}, false);
	},
	onCloseWindow: function (aXULWindow) {},
	onWindowTitleChange: function (aXULWindow, aNewTitle) {},
	register: function () {
		// Load into any existing windows
		var DOMWindows = Services.wm.getEnumerator(null);
		while (DOMWindows.hasMoreElements()) {
			var aDOMWindow = DOMWindows.getNext();
			windowListener.loadIntoWindow(aDOMWindow);
		}
		// Listen to new windows
		Services.wm.addListener(windowListener);
	},
	unregister: function () {
		//Stop listening so future added windows dont get this attached
		Services.wm.removeListener(windowListener);
		
		// Unload from any existing windows
		var DOMWindows = Services.wm.getEnumerator(null);
		while (DOMWindows.hasMoreElements()) {
			var aDOMWindow = DOMWindows.getNext();
			windowListener.unloadFromWindow(aDOMWindow);
		}		
	},
	//END - DO NOT EDIT HERE
	loadIntoWindow: function (aDOMWindow) {
		if (!aDOMWindow) {
			return;
		}
		
		var domWinUtils = aDOMWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
		domWinUtils.loadSheet(uri_cuiCss, domWinUtils.AUTHOR_SHEET); 
	},
	unloadFromWindow: function (aDOMWindow) {
		if (!aDOMWindow) {
			return;
		}
		
		var domWinUtils = aDOMWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
		domWinUtils.removeSheet(uri_cuiCss, domWinUtils.AUTHOR_SHEET); 
	}
};
/*end - windowlistener*/


// start bootstrap hook ins
function startup(aData, aReason) {
	
	//wm watcher more
	windowListener.register();
	//end wm watcher more
	
	CustomizableUI.createWidget({
		id: 'hopg_cui',
		defaultArea: CustomizableUI.AREA_NAVBAR,
		label: myServices.stringBundle.GetStringFromName('inject-cheat'),
		tooltiptext: myServices.stringBundle.GetStringFromName('after-injecting-hold-mouse-down-for-one-second-and-the-pixel-god-will-begin-to-draw'),
		onCommand: function(aEvent) {
			var win = aEvent.target.ownerDocument.defaultView;
			var cWin = win.gBrowser.selectedBrowser.contentWindow;
			var cDoc = cWin.document;
			if (cWin.location.host.toLowerCase() == 'pixact.ly') {
				cWin.alert(myServices.stringBundle.GetStringFromName('succesfully-injected'));
				
				Cu.import('resource://gre/modules/ctypes.jsm');

				/*start getcursorpos*/
				var lib = ctypes.open("user32.dll");

				/* Declare the signature of the function we are going to call */
				var struct_lpPoint = new ctypes.StructType("lpPoint",
										[ { "x": ctypes.int },
										  { "y": ctypes.int } ]);
				var GetCursorPos = lib.declare('GetCursorPos', ctypes.winapi_abi, ctypes.bool, struct_lpPoint.ptr);
				/*end getcursorpos*/

				/*start setcursorpos*/
				//var lib = ctypes.open("user32.dll"); //already called on line 4
				var SetCursorPos = lib.declare('SetCursorPos', ctypes.winapi_abi, ctypes.bool, ctypes.int, ctypes.int)
				/*end setcursorpos*/

				var mouseX0;
				var mouseX1;
				var mouseY0;
				var mouseY1;
				var can = cDoc.querySelector('section[id=canvas]');

				function trackPageXY(e) {
				  mouseX1 = e.pageX;
				  mouseY1 = e.pageY;
				}
				var moveTillPageXRight;
				var moveTillPageYRight;
				var delayIt;

				can.addEventListener('mouseup', function(e) {
				  
				  can.removeEventListener('mousemove', trackPageXY, false);
				  try {
				   cWin.clearTimeout(delayIt);
				   cWin.clearInterval(moveTillPageXRight);
				   cWin.clearInterval(moveTillPageYRight);
				  } catch (ignore) {}
					mouseX1 = e.pageX;
					mouseY1 = e.pageY;
				  //console.log('mouseX1:', e.pageX);
				  //console.log('mouseY1:', e.pageY);
					var width = parseInt(cDoc.querySelector('.width-copy .value').textContent);
					var height = parseInt(cDoc.querySelector('.height-copy .value').textContent);
				  
				  //console.log('mouseXDiff:', mouseX1-mouseX0, 'failWidth:', mouseX1-mouseX0-width);
				  //console.log('mouseYDiff:', mouseY1-mouseY0, 'failHeight:', mouseY1-mouseY0-height);
				  
				}, false);
				can.addEventListener('mousedown', function(e) {
				  can.addEventListener('mousemove', trackPageXY, false);
				  delayIt = cWin.setTimeout(function() {
					var width = parseInt(cDoc.querySelector('.width-copy .value').textContent);
					var height = parseInt(cDoc.querySelector('.height-copy .value').textContent);
					var utils = cWin.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
					utils.sendMouseEvent('mousemove',e.pageX + width,e.pageY + height, 0, 1, 0);
				  }, 1000);
				}, false)
				
			} else {
				cWin.alert(myServices.stringBundle.GetStringFromName('not-on-pixact-ly-game-page-cannot-inject'));
			}
		}
	});
	
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	
	CustomizableUI.destroyWidget('hopg_cui');
	
	//wm watcher more
	windowListener.unregister();
	//end wm watcher more
}

function install(aData, aReason) {}

function uninstall(aData, aReason) {}
// end bootstrap hook ins
