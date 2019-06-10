import * as lib from '../lib/companero'

describe(`When initializing`, () => {
  test(`with empty Lifecycle EXPECT error`, () => {
    expect(() => { lib.default({})}).toThrowError(/No lifecycles/)
  })

  test(`with empty Lifecycle THEN error callback called`, () => {
    const mockErrorCallback = jest.fn()

    lib.default({}, {onerror: mockErrorCallback})

    expect(mockErrorCallback.mock.calls.length).toBe(1)
  })

  test(`Lifecycle method has yet not been called`, () => {
    const mockLifecycleMethod = jest.fn()
    const lifecycle: lib.Lifecycle = () => mockLifecycleMethod
    
    lib.default({lifecycle: lifecycle})

    expect(mockLifecycleMethod).not.toHaveBeenCalled()
  })

  test(`Lifecycle has been called with LifecycleConfig`, () => {
    const mockLifecycleConfigCallback = jest.fn()
    const lifecycleName = `lifecycleName`
    const lifecycle: lib.Lifecycle =
      (config: lib.LifecycleConfig) => {
        mockLifecycleConfigCallback(config)

        return () => {}
      }
    const lifecycleConfig: lib.LifecycleConfig = {
      activeLifecycles: [],
      componentsRegister: {},
      lifecycleName: lifecycleName,
      shared: {}
    }

    lib.default({ [lifecycleName]: lifecycle })

    expect(mockLifecycleConfigCallback.mock.calls.length).toBe(1)
    expect(mockLifecycleConfigCallback).toHaveBeenCalledWith(lifecycleConfig)
  })

  test(`LifecycleConfig carry the same references but different lifecycleNames`, () => {
    const lifecycleName1 = `lifecycleName1`
    const lifecycleName2 = `lifecycleName2`
    let receivedConfig1: lib.LifecycleConfig
    let receivedConfig2: lib.LifecycleConfig
    const lifecycle1: lib.Lifecycle =
      (config: lib.LifecycleConfig) => {
        receivedConfig1 = config

        return () => {}
      }
    const lifecycle2: lib.Lifecycle =
      (config: lib.LifecycleConfig) => {
        receivedConfig2 = config

        return () => {}
      }
    lib.default({ [lifecycleName1]: lifecycle1, [lifecycleName2]: lifecycle2})

    expect(receivedConfig1.activeLifecycles).toStrictEqual(receivedConfig2.activeLifecycles)
    expect(receivedConfig1.componentsRegister).toStrictEqual(receivedConfig2.componentsRegister)
    expect(receivedConfig1.lifecycleName).not.toStrictEqual(receivedConfig2.lifecycleName)
    expect(receivedConfig1.shared).toStrictEqual(receivedConfig2.shared)
  })
})

describe(`When initialized without LifecycleCallbacks`, () => {
  test(`'run' called with non-existent lifecycle THEN error callback called`, () => {
    const mockErrorCallback = jest.fn()
    const lifecycle = jest.fn()
    const instance: lib.Instance = lib.default({ lifecycle }, {onerror: mockErrorCallback})

    instance.run(`other`)
    expect(mockErrorCallback.mock.calls.length).toBe(1)
  })

  test(`'run' called with lifecycle THEN arguments passed to lifecycle`, () => {
    const mockLifecycle = jest.fn()
    const lifecycleName = `lifecycleName`
    const lifecycle: lib.Lifecycle = () => mockLifecycle
    const instance: lib.Instance = lib.default({ [lifecycleName]: lifecycle })
    const args = [1, 2, 3]

    instance.run(lifecycleName, ...args)

    expect(mockLifecycle.mock.calls.length).toBe(1)
    expect(mockLifecycle).toHaveBeenCalledWith(...args)
  })

  test(`'run' called with different lifecycles THEN arguments passed to lifecycle`, () => {
    const mockLifecycle1 = jest.fn()
    const mockLifecycle2 = jest.fn()
    const lifecycleName1 = `lifecycleName1`
    const lifecycleName2 = `lifecycleName2`
    const lifecycle1: lib.Lifecycle = () => mockLifecycle1
    const lifecycle2: lib.Lifecycle = () => mockLifecycle2

    const instance: lib.Instance = lib.default(
      {
        [lifecycleName1]: lifecycle1,
        [lifecycleName2]: lifecycle2
      }
    )
    const args1 = [1, 2, 3]
    const args2 = [4, 5, 6]

    instance.run(lifecycleName1, ...args1)
    instance.run(lifecycleName2, ...args2)

    expect(mockLifecycle1.mock.calls.length).toBe(1)
    expect(mockLifecycle1).toHaveBeenCalledWith(...args1)
    expect(mockLifecycle2.mock.calls.length).toBe(1)
    expect(mockLifecycle2).toHaveBeenCalledWith(...args2)
  })
})

describe(`When initialized with LifecycleCallbacks`, () => {
  test(`'run' called with lifecycle THEN arguments passed to lifecycle`, () => {
    const mockLifecycle = jest.fn()
    const mockLifecycleCallback = jest.fn()
    const lifecycleName = `lifecycleName`
    const lifecycle: lib.Lifecycle = () => mockLifecycle
    const instance: lib.Instance = lib.default(
      { [lifecycleName]: lifecycle },
      { onbeforelifecycle: mockLifecycleCallback }
    )
    const args = [1, 2, 3]

    instance.run(lifecycleName, ...args)

    expect(mockLifecycleCallback.mock.calls.length).toBe(1)
    expect(mockLifecycle).toHaveBeenCalledWith(...args)
  })
})
