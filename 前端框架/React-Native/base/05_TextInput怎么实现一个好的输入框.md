### 输入框的文字

非受控组件：

```jsx
const UncontrolledTextInput = () => <TextInput />
```

对于非受控组件来说，存储跨域两次 render 的可行方案是 ref。ref 的值不会因为组件刷新而重新声明，它是专门用来存储组件级别的信息的。React 官方推荐有三种场景我们
可以用它：

* 存储 setTimeout/setInterval 的 ID；
* 存储和操作宿主组件（在 Web 中是 DOM 元素）；
* 存储其他不会参与 JSX 计算的对象。

```jsx
function UncontrolledTextInput2() {
  const textRef = React.useRef('');
  return <TextInput onChangeText={text => textRef.current = text}/>
}
```

非受控组件的原理是最简单的，用户输入的“文本原件”是存在宿主组件上的，JavaScript中的只是用textRef复制了一份 “文本的副本”而已。

但正是因为非受控组件使用的是副本，一些复杂的操作是做不了的，比如将用户输入的字母由大写强制改为小写，等等。在新架构 Fabric 之前，React Native 还提供了直接修改宿
主组件属性的setNativeProps方法，但是 Fabric 之后（包括 Fabric 预览版），setNativeProps就不能用了。因此我们要操作文本原件，必须得用受控（Controlled）组件。

受控的意思说的是使用 JavaScript 中的 state 去控制宿主组件中的值。一个受控的ControlledTextInput 组件示例如下：

```jsx
function ControlledTextInput() {
const [text, setText] = React.useState('');
return <TextInput value={text} onChangeText={setText} />
}
```

现在如果要我给个处理输入框的文本建议，那我的建议就是使用受控组件，并且使用异步的文字改变事件，这也符合大部分人的代码习惯。

### 输入框的焦点

自动对焦：

```html
<TextInput autoFocus/>
```

比如，在购物 App 中填写收货地址时，你每完成一项填写，点击键盘中的下一项按钮，焦点就会自动转移一次，从姓名到电话再到地址。我们以前讲过，React/React Native 是声明式的，但是在操作自带状态的宿主属性时，比如焦点转移，声明式就不管用了，还得用给宿主组件下命令。

那怎么下命令呢？我们先从最简单的控制 TextInput 焦点讲起，示例代码如下：

```jsx
function AutoNextFocusTextInputs() {
  const ref1 = React.useRef<TextInput>(null);
  useEffect(()=>{
    ref1.current?.focus()
  },[])
  return (
    <TextInput ref={ref1} />
  )
}
```

在这段代码中，先声明了一个ref1用于保存 TextInput 宿主组件。在该宿主组件上封装了 Native/C++ 层暴露给 JavaScript 的命令，比如对焦focus()、失焦blur()、控制选中文字的光标setSelection。

AutoNextFocusTextInputs组件在挂载完成后，程序会调用ref1.current.focus()，将焦点对到 TextInput 元素上，这就是使用focus()实现对焦的原理。

使用focus()命令对焦和使用autoFocus属性对焦，在原生应用层面的实现原理是一样的，只不过在 JavaScript 层面，前者是命令式的，后者是声明式的。对自带状态的宿主组件而言，命令式的方法能够进行更复杂的操作。

那要实现每点一次键盘的“下一项”按钮，将焦点对到下一个 TextInput 元素上，怎么实现呢？具体的示例代码如下：

```js
function AutoNextFocusTextInputs() {
const ref1 = React.useRef<TextInput>(null);
const ref2 = React.useRef<TextInput>(null);
const ref3 = React.useRef<TextInput>(null);
return (
<>
<TextInput ref={ref1} onSubmitEditing={ref2.current?.focus} /> // 姓名输入
<TextInput ref={ref2} onSubmitEditing={ref3.current?.focus} /> // 电话输入
<TextInput ref={ref3} /> // 地址输入框
</>
);
}
```

### 联动键盘的体验

你需要关注的第三件事是，输入键盘的体验细节。
我们前面提到过，输入框和键盘是联动的，键盘的很多属性都可以用 TextInput 组件来设置。因此，除了输入框的值、输入框的焦点，我们还需要关心如何控制键盘。我们一起来
看看那些优秀的 App 都是怎么处理这个细节的。

先来看第一个体验细节，iOS 微信搜索框的键盘右下角按钮有一个“置灰置蓝”的功能。默认情况下，键盘右下角的按钮显示的是置灰的“搜索”二字，当你在搜索框输入文字后，置灰的“搜索”按钮会变成蓝色背景的“搜索”二字。置灰的作用是提示用户，没有输入文字不能进行搜索，按钮变蓝提示的是有内容了，可以搜索了。控制键盘右下角按钮置灰置蓝的，是 TextInput 的enablesReturnKeyAutomatically属性，这个属性是 iOS 独有的属性，默认是false，也就是任何使用键盘右下角的按钮，都可以点击。你也可以通过将其设置为true，使其在输入框中没有文字时置灰.

第二个体验细节是，键盘右下角按钮的文案是可以变化的，你可以根据不同的业务场景进
行设置。

有两个属性可以设置这些文案，包括 iOS/Android 通用的returnKeyType 和 Android独有的returnKeyLabel。全部的属性你可以查一下文档，我这里只说一下通用属性：

* default：显示的文案是换行；
* done：显示的文案是“完成”，它适合作为最后一个输入框的提示文案；
* go：显示的文案是“前往”，它适合作为浏览器网站输入框或页面跳出的提示文案；
* next：显示的文案是“下一项”，它适合作为转移焦点的提示文案；
* search：显示的文案是“搜索”，它适合作为搜索框的提示文案；
* send：显示的文案是“发送”，它比较适合聊天输入框的提示文案。

第三个体验细节是，登录页面的自动填写账号密码功能。虽然现在有了二维码登录，但传统的账号密码登录场景还是非常多的。每次登录的时候，要输入一遍账号密码，就很麻烦了。


当你知道这些键盘细节后，你就可以利用这些系统的特性，帮你的 App 体验变得更好。现在，我们回过头，再来改善一下，我们之前实现的自动聚焦组件AutoNextFocusTextInputs吧。示例代码如下：

```js
function AutoNextFocusTextInputs() {
const ref1,ref2,ref3 ...
return (
<>
<TextInput ref={ref1} placeholder="姓名" textContentType="name" returnKey />
<TextInput ref={ref2} placeholder="电话" keyboardType="phone-pad" returnKey />
<TextInput ref={ref3} placeholder="地址" returnKeyType="done" />
</>
);
}
```
