<img src="logo.png" alt="Compañero Logo" width="700"/>

`compañero` is a highly flexible component registry and lifecycle launcher.
Through hooks and shared references it is thought to lay the groundwork for component managers.

## Install

```
npm install companero --save
```

## Basic example

Note: The example is written in Typescript for a better understanding of the library.
The library itself is exposed as zero-dependency vanilla Javascript.
Typescript type definitions are also part of the package.

```ts
import lib from 'companero'

function init(config: lib.LifecycleConfig):lib.LifecycleMethod { 
    let { componentsRegister } = config

    console.log(`'init' Lifecycle initialized with ${JSON.stringify(config)}`);
    return (options:any) => { 
        console.log(`'init' LifecycleMethod called with ${JSON.stringify(options)}`);
        console.log(`var 'componentsRegister': ${JSON.stringify(componentsRegister)}`);
    } 
}

const companero:lib.Instance = lib({ init }

// =>
// 'init' Lifecycle initialized with 
// {"activeLifecycles":[],"componentsRegister":{},"lifecycleName":"init","shared":{}}

companero.run('init', 'a param')

// =>
// 'init' LifecycleMethod called with '"a param"'
// `var 'componentsRegister': {}

companero.register(
  `componentA`,
  () => {}
)

companero.run('init')

// =>
// 'init' LifecycleMethod called with '"a param"'
// var 'componentsRegister': {"componentA":{"componentName":"componentA","componentOptions":{}}}
```

## Compatibility

Browser and node environment. Target code is ES5 which should support close to any browser on the market. 
Exposed as an [UMD](https://github.com/umdjs/umd#umd-universal-module-definition) module.

## Run Sandbox with a basic component loader based on DOM nodes 

Full code: [`sandbox/sandbox.ts`](sandbox/sandbox.ts).

```
npm run sandbox
```

## Contributors

* Thanks to [Adria Marti Blasco](https://www.linkedin.com/in/amartib/) for the fancy project logo!

## Formerly `companerojs`

After some significant changes under the hood rename to `companero`.