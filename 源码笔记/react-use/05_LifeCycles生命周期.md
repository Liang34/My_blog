## LiseCycles生命周期

### useLifecycles

[useLifecycles docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Flifecycle-uselifecycles--docs "https://streamich.github.io/react-use/?path=/story/lifecycle-uselifecycles--docs") | [useLifecycles demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Flifecycle-uselifecycles--demo "https://streamich.github.io/react-use/?path=/story/lifecycle-uselifecycles--demo")

> React lifecycle hook that call mount and unmount callbacks, when component is mounted and un-mounted, respectively.
>
> React 生命周期挂钩，分别在组件安装和卸载时调用。

```tsx
import { useEffect } from 'react';

const useLifecycles = (mount, unmount?) => {
  useEffect(() => {
    if (mount) {
      mount();
    }
    return () => {
      if (unmount) {
        unmount();
      }
    };
  }, []);
};

export default useLifecycles;

```


### useCustomCompareEffect

[useCustomCompareEffect docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Flifecycle-usecustomcompareeffect--docs "https://streamich.github.io/react-use/?path=/story/lifecycle-usecustomcompareeffect--docs") | [useCustomCompareEffect demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Flifecycle-usecustomcompareeffect--demo "https://streamich.github.io/react-use/?path=/story/lifecycle-usecustomcompareeffect--demo")

> A modified useEffect hook that accepts a comparator which is used for comparison on dependencies instead of reference equality.
>
> 一个经过修改的useEffect钩子，它接受一个比较器，该比较器用于对依赖项进行比较，而不是对引用相等进行比较。


```ts
import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const isPrimitive = (val: any) => val !== Object(val);

type DepsEqualFnType<TDeps extends DependencyList> = (prevDeps: TDeps, nextDeps: TDeps) => boolean;

const useCustomCompareEffect = <TDeps extends DependencyList>(
  effect: EffectCallback,
  deps: TDeps,
  depsEqual: DepsEqualFnType<TDeps>
) => {
  // 省略一些开发环境的警告提示

  const ref = useRef<TDeps | undefined>(undefined);

  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps;
  }

  useEffect(effect, ref.current);
};

export default useCustomCompareEffect;

```


### useDeepCompareEffect

[useDeepCompareEffect docs](https://link.juejin.cn?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Flifecycle-usedeepcompareeffect--docs "https://streamich.github.io/react-use/?path=/story/lifecycle-usedeepcompareeffect--docs") | [useDeepCompareEffect demo](https://link.juejin.cn?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Flifecycle-usedeepcompareeffect--demo "https://streamich.github.io/react-use/?path=/story/lifecycle-usedeepcompareeffect--demo")

> A modified useEffect hook that is using deep comparison on its dependencies instead of reference equality.
> 一个修改后的 `useEffect` 钩子，它对其依赖项使用深度比较，而不是引用相等

```ts
import { DependencyList, EffectCallback } from 'react';
import useCustomCompareEffect from './useCustomCompareEffect';
import isDeepEqual from './misc/isDeepEqual';

const isPrimitive = (val: any) => val !== Object(val);

const useDeepCompareEffect = (effect: EffectCallback, deps: DependencyList) => {
  // 省略若干开发环境的警告提示

  useCustomCompareEffect(effect, deps, isDeepEqual);
};

export default useDeepCompareEffect;

```
