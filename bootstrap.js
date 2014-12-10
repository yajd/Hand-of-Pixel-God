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
Cu.import('resource://gre/modules/osfile.jsm');

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
				
				if (getWinMacNix(true) == 2) {
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
						 mouseX0 = e.pageX;
						mouseY0 = e.pageY;
						 //console.log('mouseX0:',e.pageX);
						 //console.log('mouseY0', e.pageY);
						
						 var point = new struct_lpPoint;
						 var ret = GetCursorPos(point.address());
						if (!ret) {
						  //console.warn('failed to get cursor pos')
						  return;
						}
						//console.log('point:', point.x, point.y);
	
						var width = parseInt(cDoc.querySelector('.width-copy .value').textContent);
						var height = parseInt(cDoc.querySelector('.height-copy .value').textContent);
						
						//console.log('width:', width, 'height:', height);
						
						var xOffset = 0;
						moveTillPageXRight = cWin.setInterval(function() {
						  if (xOffset > 0 && mouseX1-mouseX0-width >= 0) {
							cWin.clearInterval(moveTillPageXRight);
							//console.log('reached proper width')
							//now move to get y right
							var yOffset = 0;
							moveTillPageYRight = cWin.setInterval(function() {
							  if (yOffset > 0 && mouseY1-mouseY0-height >= 0) {
								//console.log('reached proper height');
								cWin.clearInterval(moveTillPageYRight);
								return;
							  }
							  yOffset++;
							  var ret = SetCursorPos(point.x + xOffset, point.y + yOffset);
							  if (!ret) {
								//console.warn('failed to set cursor pos');
								return;
							  }
							}, 10);
							//end nw move to get y right
							return;
						  }
						  xOffset++;
						  var ret = SetCursorPos(point.x + xOffset, point.y);
						  if (!ret) {
							//console.warn('failed to set cursor pos');
							return;
						  }
						}, 10);
						
	
	
						
						/*
						//for some reason this is offset so not accurate
						//console.log('move to:', point.x + width, point.y + height)
						var ret = SetCursorPos(point.x + width, point.y + height);
						if (!ret) {
						  //console.warn('failed to set cursor pos');
						  return;
						}
						*/
					  }, 1000);
					}, false);
				} else {
				  	//mac or nix					
					var can = cDoc.querySelector('section[id=canvas]');

					var moveTillPageXRight;
					var moveTillPageYRight;
					var delayIt;
	
					can.addEventListener('mouseup', function(e) {
					  
					  try {
					   cWin.clearTimeout(delayIt);
					   cWin.clearInterval(moveTillPageXRight);
					   cWin.clearInterval(moveTillPageYRight);
					  } catch (ignore) {}
					  
					}, false);
					
					var utils = cWin.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
						
					can.addEventListener('mousedown', function(e) {
					  delayIt = cWin.setTimeout(function() {
	
						var width = parseInt(cDoc.querySelector('.width-copy .value').textContent);
						var height = parseInt(cDoc.querySelector('.height-copy .value').textContent);
						
						//console.log('width:', width, 'height:', height);
						
						var xOffset = 0;
						moveTillPageXRight = cWin.setInterval(function() {
						  if (xOffset > 0 && (e.pageX + xOffset)-e.pageX-width >= 0) {
							cWin.clearInterval(moveTillPageXRight);
							//console.log('reached proper width')
							//now move to get y right
							var yOffset = 0;
							moveTillPageYRight = cWin.setInterval(function() {
							  if (yOffset > 0 && (e.pageY + yOffset)-e.pageY-height >= 0) {
								//console.log('reached proper height');
								cWin.clearInterval(moveTillPageYRight);
								return;
							  }
							  yOffset++;
							  utils.sendMouseEvent('mousemove',e.pageX + xOffset,e.pageY + yOffset, 0, 1, 0);
							  //console.log('ymove');
							}, 10);	
							//end nw move to get y right
							return;
						  }
						  xOffset++;
						  utils.sendMouseEvent('mousemove',e.pageX + xOffset,e.pageY, 0, 1, 0);
						  //console.log('xmove');
						}, 10);
						
	
	
						
						/*
						//for some reason this is offset so not accurate
						//console.log('move to:', point.x + width, point.y + height)
						var ret = SetCursorPos(point.x + width, point.y + height);
						if (!ret) {
						  //console.warn('failed to set cursor pos');
						  return;
						}
						*/
					  }, 1000);
					}, false);
					
				}
				
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

//library functions
function getWinMacNix(throwOnUnrecognized) {
	//returns 0 for mac, 1 for nix, 2 for win, string of name on error
	//requires Cu.import('resource://gre/modules/osfile.jsm');
	switch (OS.Constants.Sys.Name.toLowerCase()) {
		case 'winnt':
		case 'winmo':
		case 'wince':
			return 2;
			break;
		case 'linux':
		case 'freebsd':
		case 'openbsd':
		case 'sunos':
		case 'webos': // Palm Pre
		case 'android': //profilist doesnt support android (i dont think android has profiles, im not sure) but i include here anyways as its linux
			return 1;
			break;
		case 'darwin':
			return 0;
			break;
		default:
			if (throwOnUnrecognized) {
				throw new Error('OS not recognized, OS: "' + OS.Constants.Sys.Name + '"');
			} else {
				return OS.Constants.Sys.Name;
			}
	}
}
//end library functions
