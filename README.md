idle-vue
========

`idle-vue` is a [Vue.js](http://vuejs.org/) plug-in, that detects when the user hasn't interacted with your app for a while. `idle-vue` is meant to be used with Vue, [Vuex](https://github.com/vuejs/vuex) and either [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/).

`idle-vue` is based on [idle-js](https://github.com/soixantecircuits/idle-js).

:earth_africa: Installation
---------------------------

    npm install --save idle-vue

:wave: Usage
------------

In the root of your project, import the `idle-vue` plug-in, and add it to the Vue global with the following syntax:

    Vue.use(IdleVue, options)

### Hooks

The plug-in adds two hooks to Vue: `onIdle` and `onActive`; those methods may be defined in any Vue object (components included), and will be called by the plug-in when the window respectively starts and stops idling.

These hooks will not be called if the `options` object has no `eventEmitter` field.

#### Example - Js

    import IdleVue from 'idle-vue'

    const eventsHub = new Vue()

    Vue.use(IdleVue, { eventEmitter: eventsHub })

    const vm = new Vue({
      el: '#app',
      data: {
        messageStr: "Hello"
      }
      isIdle() {
        this.messageStr = "ZZZ"
      }
      isActive() {
        this.messageStr = "Hello"
      }
    })

#### Example - Html

    <div id=app>
      <p>
        {{ messageStr }}
      </p>
    </div>

### Computed

The plug-in adds a computed value `isAppIdle` to every Vue object.

This value will always be `undefined` if the `options` object has no `store` field.

#### Example - Js

    import IdleVue from 'idle-vue'

    const store = new Vuex.Store({
      // ...
    })

    Vue.use(IdleVue, { store })

    const vm = new Vue({
      el: '#app',
      store,
      computed: {
        messageStr() {
          return this.isAppIdle ? "ZZZ" : "Hello"
        }
      }
    })

#### Example - Html

    <div id=app>
      <p>
        {{ messageStr }}
      </p>
    </div>

### IdleView

The plug-in also adds a component named `IdleView` (or `idle-view`) to Vue.

This component is a default idle overlay with a small "touch the screen" sprite; it has no props and no slots. You may create your own idle overlay by exploiting `isAppIdle`.

#### Example - Js

    import IdleVue from 'idle-vue'

    const eventsHub = new Vue()
    const store = new Vuex.Store({
      // ...
    })

    Vue.use(IdleVue, { eventEmitter: eventsHub, store })

    const vm = new Vue({
      el: '#app',
      store,
      // ...
    })

#### Example - Html

    <div id=app>
      <p>
        Hello world!
        ...
      </p>
      <idle-view />
    </div>

### Options

`idle-vue` accepts the following options when loaded; all of them are facultative, except `store` or `eventEmitter`; they cannot be both omitted:

* __eventEmitter__: The Vue instance through which the `idle-vue` plugin is to send events. The plugin will send `idleVue_onIdle` and `idleVue_onActive` events to this instance; all Vue objects created after the plugin is loaded will run their `onIdle` and `onActive` hooks when `idleVue_onIdle` and `idleVue_onActive` events are sent. Default: `undefined`.

* __store__: The Vuex instance which stores the state of the app (idle or active); this store has a state `idleVue.isIdle` and a mutation `idleVue/IDLE_CHANGED(isIdle)`.

* __idleTime__: The time (in ms) without input before the program is considered idle. For instance, with `idleTime=60000`, the module will emit idle events after 60 seconds of inactivity. Default: `60000`.

* __events__: Events that "break" idleness. Default: `['mousemove', 'keydown', 'mousedown', 'touchstart']`

* __keepTracking__: Whether you want to track more than once. Default: `true`.

* __startAtIdle__: Start in idle state. Default: `true`.

* __moduleName__: The name of the `vuex` module (if `store` is defined), and the prefix of the emitted events (if `eventEmitter` is defined). Default: `idleVue`.


:heart: Contribute
------------------

Thanks for helping us!

Please follow the following standards when submitting a pull request:

* [JavaScript standard style](http://standardjs.com/)
* [This git branching model](nvie.com/posts/a-successful-git-branching-model/)
