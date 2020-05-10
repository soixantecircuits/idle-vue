idle-vue [![Build Status](https://travis-ci.org/soixantecircuits/idle-vue.svg?branch=master)](https://travis-ci.org/soixantecircuits/idle-vue)
========

`idle-vue` is a [Vue.js](http://vuejs.org/) plug-in, that detects when the user hasn't interacted with your app for a while. `idle-vue` is meant to be used with Vue, [Vuex](https://github.com/vuejs/vuex) and either [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/).

`idle-vue` is based on [idle-js](https://github.com/soixantecircuits/idle-js).

:earth_africa: Installation
---------------------------

    npm install --save idle-vue

:wave: Usage
------------

At the root of your project, just before creating your Vue application, import the `idle-vue` plug-in, and add it to the Vue global with the following code:

``` js
import Vue from 'vue'
import IdleVue from 'idle-vue'

const options = { ... }

Vue.use(IdleVue, options)
```

`Vue.use` is a Vue method that installs the given plugin (here, IdleVue), and passes it the given options.

The above code does two things:

* Add two hooks `onIdle` and `onActive` to all Vue objects

* Add a computed value `isAppIdle` to all Vue objects

### Hooks

The plug-in adds two hooks to Vue: `onIdle` and `onActive`; those functions may be defined in any Vue object (components included), and will be called by the plug-in when the window respectively starts and stops idling.

These hooks are not methods; they should be added directly at the Root of your component. These hooks will not be called if the `options` object has no `eventEmitter` field.

#### Example - `main.js`

``` js
import Vue from 'vue'
import IdleVue from 'idle-vue'

const eventsHub = new Vue()

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 10000
})

const vm = new Vue({
  el: '#app',
  data () {
    return {
      messageStr: 'Hello'
    }
  },
  onIdle() {
    this.messageStr = 'ZZZ'
  },
  onActive() {
    this.messageStr = 'Hello'
  }
})
```

#### Example - `index.html`

``` html
<div id=app>
  <p>
    {{ messageStr }}
  </p>
</div>
```

### `isAppIdle`

The plug-in adds a computed value `isAppIdle` to every Vue object.

It's a shorthand for the current value of `store.state.idleVue.isIdle`; this value will always be `undefined` if the `options` object has no `store` field.

Note that using `isAppIdle` or using the hooks `onIdle` and `onActive` are both different, valid ways of doing the same thing: detecting when your app is idle. You can use either or both of them depending on your needs.

#### Example - `main.js`

``` js
import Vue from 'vue'
import IdleVue from 'idle-vue'
import Vuex from 'vuex'

const store = new Vuex.Store({
  // ...
})

Vue.use(IdleVue, { store })

const vm = new Vue({
  el: '#app',
  store,
  computed: {
    messageStr() {
      return this.isAppIdle ? 'ZZZ' : 'Hello'
    }
  }
})
```

#### Example - `index.html`

``` html
<div id=app>
  <p>
    {{ messageStr }}
  </p>
</div>
```

### IdleView

The package comes with an example component named `IdleView` (or `idle-view`).

`idle-view` is not automatically included with the plugin. It can be imported as a global component or a dependency within your own component, however it serves best as a working example from which to base your own implementation.

This component is a default idle overlay with a small "touch the screen" sprite; it has no props and no slots. You may create your own idle overlay by exploiting `isAppIdle`.

#### Example - `main.js`

``` js
import IdleVue from 'idle-vue'
import IdleVueComponent from 'idle-vue/src/components/Idle.vue'
import Vuex from 'vuex'

const eventsHub = new Vue()
const store = new Vuex.Store({
  // ...
})

Vue.use(IdleVue, { eventEmitter: eventsHub, store })
Vue.component('idle-view', IdleVueComponent) // Required only to use idle-view component

const vm = new Vue({
  el: '#app',
  store,
  // ...
})
```

#### Example - `index.html`

``` html
<div id=app>
  <p>
    Hello world!
    ...
  </p>
  <idle-view />
</div>
```


#### Example - init with setting value

``` javascript

import Vue from 'vue'
import IdleVue from 'idle-vue'

const eventsHub = new Vue()

export default async ( { Vue, store } ) => {

  let idleTime = store.state.settings.idleTime
  if (idleTime === 0) {
    // No Lock, Set one year
    idleTime = 365 * 24 * 60 * 60 * 1000
  }
  Vue.use(IdleVue, { eventEmitter: eventsHub, idleTime })
}

```

#### Example - Change idle value

``` javascript

  let idleTime = this.settings.idleTime
  if (idleTime === 0) {
    // No Lock, Set one year
    idleTime = 365 * 24 * 60 * 60 * 1000
  }
  this.changeIdleTime( idleTime)

```

### Options

`idle-vue` accepts the following options when loaded; all of them are facultative, except `store` or `eventEmitter`; they cannot be both omitted:

* __eventEmitter__: The Vue instance through which the `idle-vue` plugin is to send events. The plugin will send `idleVue_onIdle` and `idleVue_onActive` events to this instance; all Vue objects created after the plugin is loaded will run their `onIdle` and `onActive` hooks when `idleVue_onIdle` and `idleVue_onActive` events are sent.

* __store__: The Vuex instance which stores the state of the app (idle or active); this store has a state `idleVue.isIdle` and a mutation `idleVue/IDLE_CHANGED(isIdle)`.

* __idleTime__: The time (in ms) without input before the program is considered idle. For instance, with `idleTime: 40000`, the module will emit idle events after 40 seconds of inactivity. Default value: `60000` (one minute).

* __events__: Events that "break" idleness. Default value: `['mousemove', 'keydown', 'mousedown', 'touchstart']`

* __keepTracking__: Whether you want to track more than once. Default value: `true`.

* __startAtIdle__: Start in idle state. Default value: `true`.

* __moduleName__: The name of the `vuex` module (if `store` is defined), and the prefix of the emitted events (if `eventEmitter` is defined). Default value: `idleVue`.


:heart: Contribute
------------------

Thanks for helping us!

Please follow the following standards when submitting a pull request:

* [JavaScript standard style](http://standardjs.com/)
* [This git branching model](nvie.com/posts/a-successful-git-branching-model/)
