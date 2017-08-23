module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(16)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IdleJs"] = factory();
	else
		root["IdleJs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var bulkAddEventListener = function bulkAddEventListener(object, events, callback) {
	  events.forEach(function (event) {
	    object.addEventListener(event, function (event) {
	      callback(event);
	    });
	  });
	};
	
	var bulkRemoveEventListener = function bulkRemoveEventListener(object, events) {
	  events.forEach(function (event) {
	    object.removeEventListener(event);
	  });
	};
	
	var IdleJs = function () {
	  function IdleJs(options) {
	    _classCallCheck(this, IdleJs);
	
	    this.defaults = {
	      idle: 10000, // idle time in ms
	      events: ['mousemove', 'keydown', 'mousedown', 'touchstart'], // events that will trigger the idle resetter
	      onIdle: function onIdle() {}, // callback function to be executed after idle time
	      onActive: function onActive() {}, // callback function to be executed after back form idleness
	      onHide: function onHide() {}, // callback function to be executed when window become hidden
	      onShow: function onShow() {}, // callback function to be executed when window become visible
	      keepTracking: true, // set it to false of you want to track only once
	      startAtIdle: false, // set it to true if you want to start in the idle state
	      recurIdleCall: false
	    };
	    this.settings = _extends({}, this.defaults, options);
	    this.idle = this.settings.startAtIdle;
	    this.visible = !this.settings.startAtIdle;
	    this.visibilityEvents = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange'];
	    this.lastId = null;
	  }
	
	  _createClass(IdleJs, [{
	    key: 'resetTimeout',
	    value: function resetTimeout(id, settings) {
	      if (this.idle) {
	        settings.onActive.call();
	        this.idle = false;
	      }
	      clearTimeout(id);
	      if (this.settings.keepTracking) {
	        return this.timeout(this.settings);
	      }
	    }
	  }, {
	    key: 'timeout',
	    value: function timeout(settings) {
	      var timer = this.settings.recurIdleCall ? setInterval : setTimeout;
	      var id;
	      id = timer(function () {
	        this.idle = true;
	        this.settings.onIdle.call();
	      }.bind(this), this.settings.idle);
	      return id;
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      window.addEventListener('idle:stop', function (event) {
	        bulkRemoveEventListener(window, this.settings.events);
	        this.settings.keepTracking = false;
	        this.resetTimeout(this.lastId, this.settings);
	      });
	      this.lastId = this.timeout(this.settings);
	      bulkAddEventListener(window, this.settings.events, function (event) {
	        this.lastId = this.resetTimeout(this.lastId, this.settings);
	      }.bind(this));
	      if (this.settings.onShow || this.settings.onHide) {
	        bulkAddEventListener(document, this.visibilityEvents, function (event) {
	          if (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden) {
	            if (this.visible) {
	              this.visible = false;
	              this.settings.onHide.call();
	            }
	          } else {
	            if (!this.visible) {
	              this.visible = true;
	              this.settings.onShow.call();
	            }
	          }
	        }.bind(this));
	      }
	    }
	  }]);
	
	  return IdleJs;
	}();
	
	module.exports = IdleJs;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=idle.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(15)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(6),
  /* template */
  __webpack_require__(13),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idle_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idle_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_idle_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Idle__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Idle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_Idle__);





/* harmony default export */ __webpack_exports__["default"] = ({
  IdleView: __WEBPACK_IMPORTED_MODULE_1__components_Idle___default.a,
  install(Vue, options) {
    const {
      eventEmitter,
      store,
      moduleName = 'idleVue',
      idleTime = 60 * 1000,
      events = ['mousemove', 'keydown', 'mousedown', 'touchstart'],
      keepTracking = true,
      startAtIdle = true
    } = options || {};

    if (!eventEmitter && !store) {
      throw Error('Either `eventEmitter` or `store` must be passed in options');
    }

    store && store.registerModule(moduleName, {
      state: { isIdle: startAtIdle },
      mutations: {
        [`${moduleName}/IDLE_CHANGED`]: function (state, isIdle) {
          state.isIdle = isIdle;
        }
      }
    });

    const onIdleStr = `${moduleName}_onIdle`;
    const onActiveStr = `${moduleName}_onActive`;

    const idle = new __WEBPACK_IMPORTED_MODULE_0_idle_js___default.a({
      idle: idleTime,
      events,
      keepTracking,
      startAtIdle,

      onIdle() {
        eventEmitter && eventEmitter.$emit(onIdleStr);
        store && store.commit(`${moduleName}/IDLE_CHANGED`, true);
      },
      onActive() {
        eventEmitter && eventEmitter.$emit(onActiveStr);
        store && store.commit(`${moduleName}/IDLE_CHANGED`, false);
      }
    });
    idle.start();

    Vue.component('IdleView', __WEBPACK_IMPORTED_MODULE_1__components_Idle___default.a);

    Vue.mixin({
      data() {
        return {
          [onIdleStr]: null,
          [onActiveStr]: null
        };
      },
      created() {
        if (eventEmitter && this.$options.onIdle) {
          this[onIdleStr] = this.$options.onIdle.bind(this);
          eventEmitter.$on(onIdleStr, this[onIdleStr]);
        }
        if (eventEmitter && this.$options.onActive) {
          this[onActiveStr] = this.$options.onActive.bind(this);
          eventEmitter.$on(onActiveStr, this[onActiveStr]);
        }
      },
      destroyed() {
        if (eventEmitter && this[onIdleStr]) {
          eventEmitter.$off(onIdleStr, this[onIdleStr]);
        }
        if (eventEmitter && this[onActiveStr]) {
          eventEmitter.$off(onActiveStr, this[onActiveStr]);
        }
      },
      computed: {
        isAppIdle() {
          return store && store.state[moduleName].isIdle;
        }
      }
    });
  }
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Sprite__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Sprite___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Sprite__);
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    Sprite: __WEBPACK_IMPORTED_MODULE_0__Sprite___default.a
  },
  onIdle() {
    this.$refs.sprite.play();
  },
  onActive() {
    this.$refs.sprite.stop();
  }
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'sprite',
  props: {
    spriteSrc: {
      type: String,
      default: ''
    },
    spriteId: {
      type: String,
      default: 'sprite'
    },
    spriteW: {
      type: Number,
      default: 1
    },
    spriteH: {
      type: Number,
      default: 1
    },
    spriteSpeed: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      visible: true,
      frameIndex: 0,
      tickCount: 0,
      frameLength: 0,
      ticksPerFrame: 0,
      numberOfFrames: 0,
      frameRate: 20,
      ctx: '',
      canvas: '',
      mySprite: '',
      animationFrameId: -1
    };
  },
  mounted() {
    let vm = this;
    this.$nextTick(() => {
      vm.mySprite = new Image();
      vm.mySprite.onload = e => {
        vm.spriteInit(e.target);
      };
      vm.mySprite.src = vm.spriteSrc;
    });
  },
  methods: {
    spriteInit(img) {
      this.canvas = this.$el.querySelector(`#${this.spriteId}`);
      this.ctx = this.canvas.getContext('2d');
      this.ticksPerFrame = this.spriteSpeed;
      this.frameLength = img.width;
      this.numberOfFrames = img.width / this.spriteW;
      this.spriteLoop();
    },
    spriteUpdate() {
      this.tickCount++;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        // If the current frame index is in range
        if (this.frameIndex < this.numberOfFrames - 1) {
          // Go to the next frame
          this.frameIndex++;
        } else {
          this.frameIndex = 0;
        }
      }
    },
    spriteRender() {
      this.ctx.clearRect(0, 0, this.spriteW, this.spriteH);
      // Draw the animation
      const toDraw = this.frameIndex * this.spriteW;
      this.ctx.drawImage(this.mySprite, toDraw, 0, this.spriteW, this.spriteH, 0, 0, this.spriteW, this.spriteH);
    },
    spriteLoop() {
      this.animationFrameId = window.requestAnimationFrame(this.spriteLoop);
      this.spriteUpdate();
      this.spriteRender();
    },
    stop() {
      window.cancelAnimationFrame(this.animationFrameId);
    },
    play() {
      this.spriteLoop();
    }
  }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"Sprite.vue","sourceRoot":""}]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, ".idle-view{position:fixed;top:0;width:100vw;height:100vh;z-index:8888;pointer-events:none;display:none}.idle-view.isIdle{pointer-events:all;display:block}.idle-view .sprite{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);height:10px;width:180px;z-index:9999;-webkit-transform:scale(.7)}.idle-view .overlay{width:100%;height:100%;position:absolute;z-index:8888;background:#000;opacity:0;-webkit-transition:opacity .8s cubic-bezier(.77,0,.175,1)}.idle-view.isIdle .overlay{opacity:.6}@-webkit-keyframes SlowMo{0%{background-position:0 50%}50%{background-position:100% 50%}to{background-position:0 50%}}", "", {"version":3,"sources":["/home/hugohil/sources/js/oss/idle-vue/src/components/Idle.vue"],"names":[],"mappings":"AACA,WACE,eAAgB,AAChB,MAAO,AACP,YAAa,AACb,aAAc,AACd,aAAc,AAEd,oBAAqB,AACrB,YAAc,CACf,AACD,kBACE,mBAAoB,AACpB,aAAe,CAChB,AACD,mBACE,kBAAmB,AACnB,QAAS,AACT,SAAU,AACV,4CAA6C,AAE7C,YAAa,AACb,YAAa,AACb,aAAc,AACd,2BAA8B,CAC/B,AACD,oBACE,WAAY,AACZ,YAAa,AACb,kBAAmB,AACnB,aAAc,AAEd,gBAAiB,AACjB,UAAW,AAEX,yDAAkE,CACnE,AACD,2BACE,UAAa,CACd,AACD,0BACA,GAAG,yBAA0B,CAC5B,AACD,IAAI,4BAA4B,CAC/B,AACD,GAAK,yBAA0B,CAC9B,CACA","file":"Idle.vue","sourcesContent":["\n.idle-view {\n  position: fixed;\n  top: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: 8888;\n\n  pointer-events: none;\n  display: none;\n}\n.idle-view.isIdle {\n  pointer-events: all;\n  display: block;\n}\n.idle-view .sprite {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n\n  height: 10px;\n  width: 180px;\n  z-index: 9999;\n  -webkit-transform: scale(0.7);\n}\n.idle-view .overlay {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 8888;\n\n  background: #000;\n  opacity: 0;\n  /*-webkit-animation: SlowMo 5s cubic-bezier(0.77, 0, 0.175, 1) infinite;*/\n  -webkit-transition: opacity 800ms cubic-bezier(0.77, 0, 0.175, 1);\n}\n.idle-view.isIdle .overlay {\n  opacity: 0.6;\n}\n@-webkit-keyframes SlowMo {\n0%{background-position:0% 50%\n}\n50%{background-position:100% 50%\n}\n100%{background-position:0% 50%\n}\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/touch.ba3be66.png";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(14)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(7),
  /* template */
  __webpack_require__(12),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "sprite"
  }, [_c('canvas', {
    attrs: {
      "id": _vm.spriteId,
      "width": _vm.spriteW,
      "height": _vm.spriteH
    }
  })])
},staticRenderFns: []}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "idle-view",
    class: {
      isIdle: _vm.isIdle
    }
  }, [_c('div', {
    staticClass: "overlay"
  }), _vm._v(" "), _c('sprite', {
    ref: "sprite",
    attrs: {
      "spriteId": "touch",
      "spriteSrc": __webpack_require__(10),
      "spriteW": 180,
      "spriteH": 215
    }
  })], 1)
},staticRenderFns: []}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("b6696284", content, true);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("25b5ba8a", content, true);

/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ })
/******/ ]);
//# sourceMappingURL=build.js.map