## Side-effect

### useAsyncFn

[useAsyncFn docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-useasyncfn--docs "https://streamich.github.io/react-use/?path=/story/side-effects-useasyncfn--docs") | [useAsyncFn demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-useasyncfn--demo "https://streamich.github.io/react-use/?path=/story/side-effects-useasyncfn--demo")

> React hook that returns state and a callback for an async function or a function that returns a promise. The state is of the same shape as useAsync.
>
> 为异步函数或返回promise的函数返回状态和回调的React钩子。状态与useAsync的形状相同。

主要函数传入 `Promise` 函数 `fn`，然后执行函数 fn.then()。 返回 state、callback(fn.then)。

```tsx
/**
 * 
 * @param fn 接收的函数或者异步函数
 * @param deps 返回函数的依赖，依赖改变，返回函数会重新生成
 * @param initialState 初始state
 * @returns [state, callback as unknown as T]
 */
export default function useAsyncFn<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false }
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  // useMountedState: 判断组件是否加载
  const isMounted = useMountedState();
  const [state, set] = useState<StateFromFunctionReturningPromise<T>>(initialState);

  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    // 保证最后一次回调的结果能匹配上最后的回调，竞态问题
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState) => ({ ...prevState, loading: true }));
    }

    return fn(...args).then(
      (value) => {
        // 保证最后一次回调的结果能匹配上最后的回调，竞态问题
        isMounted() && callId === lastCallId.current && set({ value, loading: false });

        return value;
      },
      (error) => {
        isMounted() && callId === lastCallId.current && set({ error, loading: false });

        return error;
      }
    ) as ReturnType<T>;
  }, deps);

  return [state, callback as unknown as T];
}
```

### useAsync

[useAsync docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-useasync--docs "https://streamich.github.io/react-use/?path=/story/side-effects-useasync--docs") | [useAsync demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-useasync--demo "https://streamich.github.io/react-use/?path=/story/side-effects-useasync--demo")

> React hook that resolves an async function or a function that returns a promise; 解析异步函数或返回 `promise` 的函数的 `React` 钩子；

```tsx
import { DependencyList, useEffect } from 'react';
import useAsyncFn from './useAsyncFn';
import { FunctionReturningPromise } from './misc/types';

export { AsyncState, AsyncFnReturn } from './useAsyncFn';

export default function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}

```

### useAsyncRetry

[useAsyncRetry docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-useasyncretry--docs "https://streamich.github.io/react-use/?path=/story/side-effects-useasyncretry--docs") | [useAsyncRetry demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-useasyncretry--demo "https://streamich.github.io/react-use/?path=/story/side-effects-useasyncretry--demo")

> Uses useAsync with an additional retry method to easily retry/refresh the async function; 使用useAsync额外·1返回支持重试/刷新的函数

主要就是变更依赖，次数（attempt），变更时会执行 `useAsync` 的 `fn` 函数。

```tsx
const useAsyncRetry = <T>(fn: () => Promise<T>, deps: DependencyList = []) => {
  const [attempt, setAttempt] = useState<number>(0);
  const state = useAsync(fn, [...deps, attempt]);

  const stateLoading = state.loading;
  const retry = useCallback(() => {
    if (stateLoading) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'You are calling useAsyncRetry hook retry() method while loading in progress, this is a no-op.'
        );
      }

      return;
    }

    setAttempt((currentAttempt) => currentAttempt + 1);
  }, [...deps, stateLoading]);

  return { ...state, retry };
};
```

### useDebounce

防抖：**就是指触发事件后 n 秒后才执行函数，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。**

[useDebounce docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-usedebounce--docs "https://streamich.github.io/react-use/?path=/story/side-effects-usedebounce--docs") | [useDebounce demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-usedebounce--demo "https://streamich.github.io/react-use/?path=/story/side-effects-usedebounce--demo")

> React hook that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.
>
> 防抖

```tsx
import { DependencyList, useEffect } from 'react';
// 在指定的毫秒数后调用给定的函数。
import useTimeoutFn from './useTimeoutFn';

export type UseDebounceReturn = [() => boolean | null, () => void];

export default function useDebounce(
  fn: Function,
  ms: number = 0,
  deps: DependencyList = []
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);
  // 取消上一次执行的函数
  useEffect(reset, deps);

  return [isReady, cancel];
}

```


### useThrottle

节流：连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率

[useThrottle docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-usethrottle--docs "https://streamich.github.io/react-use/?path=/story/side-effects-usethrottle--docs") | [useThrottle demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fside-effects-usethrottle--demo "https://streamich.github.io/react-use/?path=/story/side-effects-usethrottle--demo")

> React hooks that throttle. 节流

```tsx
const useThrottle = <T>(value: T, ms: number = 200) => {
  const [state, setState] = useState<T>(value);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const nextValue = useRef(null) as any;
  const hasNextValue = useRef(0) as any;

  useEffect(() => {
    if (!timeout.current) {
      setState(value);
      const timeoutCallback = () => {
        // 是否存在新的值， 存在则更新，不存在则清除定时器，让下一次值走更新
        if (hasNextValue.current) {
          hasNextValue.current = false;
          // 更新值
          setState(nextValue.current);
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      // 如果当前还在运行定时器，则记录新的value，写一次赋值给state
      nextValue.current = value;
      // 存在新值
      hasNextValue.current = true;
    }
  }, [value]);

  useUnmount(() => {
    // 清除定时器
    timeout.current && clearTimeout(timeout.current);
  });

  return state;
};
```
