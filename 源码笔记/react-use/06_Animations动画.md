### useUpdate

[useUpdate docs](https://link.juejin.cn?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fanimation-useupdate--docs "https://streamich.github.io/react-use/?path=/story/animation-useupdate--docs") | [useUpdate demo](https://link.juejin.cn?target=https%3A%2F%2Fstreamich.github.io%2Freact-use%2F%3Fpath%3D%2Fstory%2Fanimation-useupdate--demo "https://streamich.github.io/react-use/?path=/story/animation-useupdate--demo")

> React utility hook that returns a function that forces component to re-render when called.
> React 实用程序钩子返回一个函数，该函数在调用时强制组件重新渲染。

主要用了 `useReducer` 每次调用 `updateReducer` 方法，来达到强制组件重新渲染的目的。

```ts
import { useReducer } from 'react';

const updateReducer = (num: number): number => (num + 1) % 1_000_000;

export default function useUpdate(): () => void {
  const [, update] = useReducer(updateReducer, 0);

  return update;
}

```
