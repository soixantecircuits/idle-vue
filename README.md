idle-vue
========

Vue component wrapper for idle-js

:earth_africa: Installation
---------------------------

    npm install --save idle-vue

:wave: Usage
------------

`idle-vue` is a Vue component meant to be used with Vue, vuex and webpack or
browserify. It can't be run as a node module (e.g. by running `node idle-vue`).

### Example

    import IdleVue from 'idle-vue'

    const eventsHub = new Vue()

    const vm = new Vue({
      el: '#app',
      data: {
        eventsHub,
        ...
      },
      components: {
        IdleVue
      }
    })

    eventsHub.$on('idle_onIdle', () => {
      ...
    })

Html:

    <div id=app>
      Things
      ...
      <idle-vue
        :eventEmitter='eventsHub'
        :idleTime=60000
        @active='...'
      ></idle-vue>
    </div>

### Side effects

When created, `idle-vue` adds a module named `idle` to the global vuex store.
This module has a state `idle.isIdle` and a mutation `idle/IDLE_CHANGED(isIdle)`.
The module's name (and the state and mutation's prefix) can be changed with the
prop `moduleName`.

### Props

`idle-vue` accepts the following optional props:

* __moduleName__: The name of the `vuex` module, and the prefix of the emitted
events. Default: `idle`.

* __eventEmitter__: A Vue instance which receives `${moduleName}_onIdle` and
`${moduleName}_onActive` events. Default: `undefined`.

* __idleTime__: The time (in ms) without input before the program is considered
idle. For instance, with `idleTime=60000`, the module will emit idle events after
60 seconds of inactivity. Default: `60000`.

* __events__: Events that "break" idleness.
Default: `['mousemove', 'keydown', 'mousedown', 'touchstart']`

* __keepTracking__: Whether you want to track more than once. Default: `true`.

* __startAtIdle__: Start in idle state. Default: `true`.

### Events

`idle-vue` emits two events: `idle` and `active`.
