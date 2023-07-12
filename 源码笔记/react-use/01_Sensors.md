## Sensors行为：

### useIdle

[useIdle docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fsensors-useidle--docs "https://streamich.github.io/react-use/?path=/story/sensors-useidle--docs") | [useIdle demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fsensors-useidle--demo "https://streamich.github.io/react-use/?path=/story/sensors-useidle--demo")

> tracks whether user is being inactive. 跟踪用户是否处于非活动状态。

主要是：监听用户行为的事件（默认的 `'mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'` ），指定时间内没有用户操作行为就是非活动状态。

```tsx
import { useEffect, useState } from 'react';
// 节流
import { throttle } from 'throttle-debounce';
// 事件解绑和监听函数
import { off, on } from './misc/util';
// 监听的函数
const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
// 闲置的时间
const oneMinute = 60e3;

const useIdle = (
  ms: number = oneMinute,
  initialState: boolean = false,
  events: string[] = defaultEvents
): boolean => {
  const [state, setState] = useState<boolean>(initialState);

  useEffect(() => {
    let mounted = true;
    let timeout: any;
    // 这里为什么需要localState？？？
    let localState: boolean = state;
    const set = (newState: boolean) => {
      if (mounted) {
        localState = newState;
        setState(newState);
      }
    };
    // 每次事件触发onEvent则会重新计时
    const onEvent = throttle(50, () => {
      if (localState) {
        set(false);
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => set(true), ms);
    });
    const onVisibility = () => {
      // 只有在标签页展示时才会计时间
      if (!document.hidden) {
        onEvent();
      }
    };

    for (let i = 0; i < events.length; i++) {
      // 遍历事件，查看事件是否有被触发
      on(window, events[i], onEvent);
    }
    // 监听页面是否被隐藏
    on(document, 'visibilitychange', onVisibility);
    // 开始计时
    timeout = setTimeout(() => set(true), ms);

    return () => {
      // 将状态设置为unmounted
      mounted = false;
      // 解绑事件
      for (let i = 0; i < events.length; i++) {
        off(window, events[i], onEvent);
      }
      off(document, 'visibilitychange', onVisibility);
    };
  }, [ms, events]);

  return state;
};

export default useIdle;
```

### **useLocation:**

[useLocation docs](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fsensors-uselocation--docs "https://streamich.github.io/react-use/?path=/story/sensors-uselocation--docs") | [useLocation demo](https://link.juejin.cn/?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fsensors-uselocation--demo "https://streamich.github.io/react-use/?path=/story/sensors-uselocation--demo")

> React sensor hook that tracks brower's location.主要获取 `window.location` 等对象信息。

```tsx
import { useEffect, useState } from 'react';
// 判断浏览器
import { isBrowser, off, on } from './misc/util';

const patchHistoryMethod = (method) => {
  const history = window.history;
  const original = history[method];

  history[method] = function (state) {
    // 原先函数
    const result = original.apply(this, arguments);
    // 自定义事件 new Event 、 dispatchEvent
    const event = new Event(method.toLowerCase());

    (event as any).state = state;

    window.dispatchEvent(event);

    return result;
  };
};

if (isBrowser) {
  patchHistoryMethod('pushState');
  patchHistoryMethod('replaceState');
}
// 省略 LocationSensorState 类型

const useLocationServer = (): LocationSensorState => ({
  trigger: 'load',
  length: 1,
});

const buildState = (trigger: string) => {
  const { state, length } = window.history;

  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = window.location;

  return {
    trigger,
    state,
    length,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
  };
};

const useLocationBrowser = (): LocationSensorState => {
  const [state, setState] = useState(buildState('load'));

  useEffect(() => {
    const onPopstate = () => setState(buildState('popstate'));
    const onPushstate = () => setState(buildState('pushstate'));
    const onReplacestate = () => setState(buildState('replacestate'));

    on(window, 'popstate', onPopstate);
    on(window, 'pushstate', onPushstate);
    on(window, 'replacestate', onReplacestate);

    return () => {
      off(window, 'popstate', onPopstate);
      off(window, 'pushstate', onPushstate);
      off(window, 'replacestate', onReplacestate);
    };
  }, []);

  return state;
};

const hasEventConstructor = typeof Event === 'function';

export default isBrowser && hasEventConstructor ? useLocationBrowser : useLocationServer;

```
