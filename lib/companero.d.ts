/* eslint-disable */

export type LifecycleCallback = (...args: any[]) => void;

// "on<before|after>[lifecycleCallbackName]"
// e.g. "onbeforeregister", "onafterregister"
export interface LifecycleCallbacks { [lifecycleCallbackName: string] : LifecycleCallback }

type Component = object;

export type ComponentConstructorFunction = (...args: any[]) => void;

export type ComponentConstructorClass = { new (): any };

export type ComponentConstructor = ComponentConstructorClass | ComponentConstructorFunction

export interface ComponentRegisterEntry {
  ComponentConstructor: ComponentConstructor;
  componentName: string;
  componentOptions?: any;
}

export interface ComponentsRegister { [componentName: string] : ComponentRegisterEntry }

export type LifecycleName = string;

export type ComponentCallback = (...args: any[]) => void;

export interface Instance {
  register(componentName: string, componentConstructor: ComponentConstructor, componentOptions: any): void;
  run(lifecycleName: string, ...lifecycleParams: any[]): any;
  unregister(componentName: string): void;
}

export interface ConstructorOptions {
  // if not passed occuring errors will be thrown
  onerror?(message: string): void;
  onbeforelifecycle?: LifecycleCallback;
  onafterlifecycle?: LifecycleCallback;
  onbeforeregister?(...args: any[]): void;
  onafterregister?(...args: any[]): void;
  onbeforeunregister?(...args: any[]): void;
  onafterunregister?(...args: any[]): void;
}

export interface LifecycleConfig {
  activeLifecycles: object;
  componentsRegister: ComponentsRegister;
  lifecycleName: LifecycleName;
  onafter?: LifecycleCallback;
  onbefore?: LifecycleCallback;
  shared: object;
}

export type LifecycleMethod = (...args: any[]) => void;

export type Lifecycle = (config: LifecycleConfig) => LifecycleMethod

declare function Constructor(lifecycles: { [lifecycleName: string] : Lifecycle }, options?:ConstructorOptions) : Instance;

export default Constructor;
