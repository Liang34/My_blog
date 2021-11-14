### Hook的使用注意事项

- Hook只能在函数组件中使用, 不能在类组件，或者函数组件之外的地方使用
- Hook只能在函数最外层调用, 不要在循环、条件判断或者子函数中调用

### useState使用：

```jsx
/*
useState:
参数: 保证状态的初始值
返回值: 是一个数组, 这个数组中有两个元素
       第一个元素: 保存的状态
       第二个元素: 修改保存状态的方法
* */  
function App() {
    const arr = useState(666);
    // 注意点: 在同一个函数式组件中, 是可以多次使用同名的Hook的
    const [state, setState] = arr;
    const [nameState, setNameState] = useState('lnj');
    return (
        <div>
            <p>{state}</p>
            <button onClick={()=>{setState(state + 1)}}>增加</button>
            <button onClick={()=>{setState(state - 1)}}>减少</button>
        </div>
    )
}
```

### useEffect使用：

可以把` useEffect Hook `看做`componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount`这三个生命周期函数的组合

作用： 可以设置依赖，只有依赖发生变化的时候才执行。

```js
function Home() {
    const [nameState, setNameState] = useState('lnj');
    const [ageState, setAgeState] = useState(0);
    useEffect(()=>{
        // componentDidMount
        // componentDidUpdate
        console.log('组件被挂载或者组件更新完成');
        return ()=>{
            // componentWillUnmount
            console.log('组件即将被卸载');
        }
    });
    // 作用
     useEffect(()=>{
        // 组件被挂载
        console.log('修改DOM');
    });
    useEffect(()=>{
        // 组件被挂载
        console.log('注册监听');
        return ()=>{
            console.log('移出监听');
        }
    });
    useEffect(()=>{
        console.log('发送网络请求');
    });
    return (
        <div>
            <p>{nameState}</p>
            <button onClick={()=>{setNameState('it666')}}>修改</button>
            <p>{ageState}</p>
            <button onClick={()=>{setAgeState(ageState + 1)}}>增加</button>
            <button onClick={()=>{setAgeState(ageState - 1)}}>减少</button>
            <hr/>
        </div>
    )
}
```

### useContext

```js
// 用于数据传递
import React, {createContext, useContext} from 'react';
const UserContext = createContext({});
const ColorContext = createContext({});
function Home() {
    const user = useContext(UserContext);
    const color = useContext(ColorContext);
    return (
        <div>
            <p>{user.name}</p>
            <p>{user.age}</p>
            <p>{color.color}</p>
        </div>
    )
}
function App() {
    return (
        <UserContext.Provider value={{name:'lnj', age:18}}>
            <ColorContext.Provider value={{color:'red'}}>
                <Home/>
            </ColorContext.Provider>
        </UserContext.Provider>
    )
}
```

### useReducer

`useReducer`是`useState`的一种替代方案, 可以让我们很好的复用操作数据的逻辑代码

`useReducer`接收的参数:

- 第一个参数: 处理数据的函数
- 第二个参数: 保存的默认值

 ` useReducer`返回值:会返回一个数组, 这个数组中有两个元素

- 第一个元素: 保存的数据
- 第二个元素: dispatch函数

```js
function reducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return {...state, num: state.num + 1};
        case 'SUB':
            return {...state, num: state.num - 1};
        default:
            return state;
    }
}
function Home() {
    const [state, dispatch] = useReducer(reducer, {num: 0});
    return (
        <div>
            <p>{state.num}</p>
            <button onClick={()=>{dispatch({type:'ADD'})}}>增加</button>
            <button onClick={()=>{dispatch({type:'SUB'})}}>减少</button>
        </div>
    )
}
function About() {
    // 复用reducer
    const [state, dispatch] = useReducer(reducer, {num: 5});
    return (
        <div>
            <p>{state.num}</p>
            <button onClick={()=>{dispatch({type:'ADD'})}}>增加</button>
            <button onClick={()=>{dispatch({type:'SUB'})}}>减少</button>
        </div>
    )
}
function App() {
    return (
        <div>
            <Home/>
            <About/>
        </div>
        )
}
```

### useCallback

`useCallback`用于优化代码, 可以让对应的函数只有在依赖发生变化时才重新定义。

```js
function Home(props) {
    console.log('Home被渲染了');
    return (
        <div>
            <p>Home</p>
            <button onClick={()=>{props.handler()}}>增加</button>
        </div>
    )
}
function About(props) {
    console.log('About被渲染了');
    return (
        <div>
            <p>About</p>
            <button onClick={()=>{props.handler()}}>减少</button>
        </div>
    )
}

const MemoHome = memo(Home);
const MemoAbout = memo(About);
function App() {
    console.log('App被渲染了');
    const [numState, setNumState] = useState(0);
    const [countState, setCountState] = useState(0);
    function increment() {
        setNumState(numState + 1);
    }
    // 以下代码的作用: 只要countState没有发生变化, 那么useCallback返回的永远都是同一个函数
    const decrement = useCallback(()=>{
        setCountState(countState - 1);
    }, [countState]);
    return (
        <div>
            <p>numState = {numState}</p>
            <p>countState = {countState}</p>
            <MemoHome handler={increment}/>
            <MemoAbout handler={decrement}/>
        </div>
    )
}
```

### useMemo

useMemo用于优化代码, 可以让对应的函数只有在依赖发生变化时才返回新的值.可以看成`useCallback`底层的实现。

```js
// 以下代码的作用: 只要countState没有发生变化, 那么useMemo返回的永远都是同一个值
const decrement = useMemo(()=>{
    return ()=>{
        setCountState(countState - 1);
    };
}, [countState]);
```

useCallback和useMemo区别:

- useCallback返回的永远是一个函数

-  useMemo返回的是return返回的内容

useMemo解决耗时操作

```js
// 定义一个函数, 模拟耗时耗性能操作
function calculate() {
    console.log('calculate被执行了');
    let total = 0;
    for(let i = 0; i < 999; i++){
        total += i;
    }
    return total;
}
function App() {
    console.log('App被渲染了');
    const [numState, setNumState] = useState(0);
    // const total = calculate();
    // 这样不会重新进行操作
    const total = useMemo(()=>{
        return calculate();
    }, []);
    return (
        <div>
            <p>{total}</p>
            <p>{numState}</p>
            <button onClick={()=>{setNumState(numState + 1)}}>增加</button>
        </div>
    )
}
```

### useRef

用于获取元素

```jsx
function App() {
    const pRef = useRef();
    const homeRef = useRef();
    function btnClick() {
        console.log(pRef.current);
        console.log(homeRef.current);
    }
    return (
        <div>
            <p ref={pRef}>我是段落</p>
            <Home ref={homeRef}/>
            <About/>
            <button onClick={()=>{btnClick()}}>获取</button>
        </div>
    )
}
function App() {
    /*
    const pRef = createRef();
    // createRef和useRef区别:
    // useRef除了可以用来获取元素以外, 还可以用来保存数据
    const homeRef = useRef();
    function btnClick() {
        console.log(pRef); // {current: p}
        console.log(homeRef); // {current: Home}
    }
     */
    /*
    useState和useRef区别:
    useRef中保存的数据, 除非手动修改, 否则永远都不会发生变化
    * */
    const [numState, setNumState] = useState(0);
    // const age = useRef(18); // {current: 18}
    const age = useRef(numState); // {current: 0}
    useEffect(()=>{
        age.current = numState;
    }, [numState]);
    return (
        <div>
            {/*
            <p ref={pRef}>我是段落</p>
            <Home ref={homeRef}/>
            <About/>
            <button onClick={()=>{btnClick()}}>获取</button>
            */}
            <p>上一次的值: {age.current}</p>
            <p>当前的值  :{numState}</p>
            <button onClick={()=>{setNumState(numState + 1)}}>增加</button>
        </div>
    )
}
```



