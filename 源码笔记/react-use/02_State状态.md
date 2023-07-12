## State状态

### useFirstMountState

[useFirstMountState docs](https://github.com/streamich/react-use/blob/master/docs/useFirstMountState.md "https://streamich.github.io/react-use/?path=/story/state-usefirstmountstate--docs") | [useFirstMountState demo](https://streamich.github.io/react-use/?path=/story/state-usefirstmountstate--demo "https://streamich.github.io/react-use/?path=/story/state-usefirstmountstate--demo")

> Returns true if component is just mounted (on first render) and false otherwise. 若组件刚刚加载（在第一次渲染时），则返回 `true`，否则返回 `false`。

```tsx
import { useRef } from 'react';

export function useFirstMountState(): boolean {
  // useRef在重新渲染值不会更改
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

```

### usePrevious

[usePrevious docs](https://streamich.github.io/react-use/?path=/story/state-useprevious--docs "https://streamich.github.io/react-use/?path=/story/state-useprevious--docs") | [usePrevious demo](https://streamich.github.io/react-use/?path=/story/state-useprevious--demo "https://streamich.github.io/react-use/?path=/story/state-useprevious--demo")

> React state hook that returns the previous state as described in the React hooks FAQ. 保留上一次的状态。

利用 `useRef` 的不变性。

```tsx
import { useEffect, useRef } from 'react';

export default function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    // ref改变并不会触发页面render，即函数不会重新运行，此时虽然值更新了，但是返回的值还是先前的值
    ref.current = state;
  });

  return ref.current;
}

```

### useSet

[useSet docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fstate-useset--docs "https://streamich.github.io/react-use/?path=/story/state-useset--docs") | [useSet demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fstate-useset--demo "https://streamich.github.io/react-use/?path=/story/state-useset--demo")

> React state hook that tracks a Set.

`new Set` 的 hooks 用法。 useSet 可以用来列表展开、收起等其他场景。 返回 `[set ,{add, remove, toggle, reset, has }]`

```tsx
import { useCallback, useMemo, useState } from 'react';

export interface StableActions<K> {
  add: (key: K) => void; // 添加
  remove: (key: K) => void; // 移除
  toggle: (key: K) => void; // 切换
  reset: () => void; // 重置
}

export interface Actions<K> extends StableActions<K> {
  has: (key: K) => boolean; // 判断是否存在某元素
}
// 接收Set，返回set集合和操作方法
const useSet = <K>(initialSet = new Set<K>()): [Set<K>, Actions<K>] => {
  const [set, setSet] = useState(initialSet);

  const stableActions = useMemo<StableActions<K>>(() => {
    const add = (item: K) => setSet((prevSet) => new Set([...Array.from(prevSet), item]));
    const remove = (item: K) =>
      setSet((prevSet) => new Set(Array.from(prevSet).filter((i) => i !== item)));
    const toggle = (item: K) =>
      setSet((prevSet) =>
        prevSet.has(item)
          ? new Set(Array.from(prevSet).filter((i) => i !== item))
          : new Set([...Array.from(prevSet), item])
      );

    return { add, remove, toggle, reset: () => setSet(initialSet) };
  }, [setSet]);

  const utils = {
    has: useCallback((item) => set.has(item), [set]),
    ...stableActions,
  } as Actions<K>;

  return [set, utils];
};

export default useSet;

```

### useToggle

[useToggle docs](https://streamich.github.io/react-use/?path=/story/state-usetoggle--docs "https://streamich.github.io/react-use/?path=/story/state-usetoggle--docs") | [useToggle demo](https://streamich.github.io/react-use/?path=/story/state-usetoggle--demo "https://streamich.github.io/react-use/?path=/story/state-usetoggle--demo")

> tracks state of a boolean. 跟踪布尔值的状态。 切换 false => true => false

```tsx
import { Reducer, useReducer } from 'react';

const toggleReducer = (state: boolean, nextValue?: any) =>
  typeof nextValue === 'boolean' ? nextValue : !state;

const useToggle = (initialValue: boolean): [boolean, (nextValue?: any) => void] => {
  return useReducer<Reducer<boolean, any>>(toggleReducer, initialValue);
};

export default useToggle;

```
