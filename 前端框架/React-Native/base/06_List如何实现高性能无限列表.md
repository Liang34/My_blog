### ScrollView：渲染所有内容的滚动组件

ScrollView 组件类似于 Web 中的 `<html/>`或 `<body/>`标签，浏览器中的页面之所以能上下滚动，就是因为 html 或 body 标签默认有一个 overflow-y: scroll 的属性，如果你把标签的属性设置为 overflow-y: hidden，页面就不能滚动了。

React Native 的 ScrollView 组件在 Android 的底层实现用的是 ScrollView 和 HorizontalScrollView，在 iOS 的底层实现用的是 UIScrollView。
使用 ScrollView 组件时，我们通常并不直接给 ScrollView 设置固定高度或宽度，而是给其父组件设置固定高度或宽度。一般而言，我们会使用安全区域组件 SafeAreaView 组件作为 ScrollView 的父组件，并给SafeAreaView 组件设置布局属性 flex:1，让内容自动撑高 SafeAreaView。使用SafeAreaView 作为最外层组件的好处是，它可以帮我们适配 iPhone 的刘海屏，节约我们
的适配成本，示例代码如下：

```js
<SafeAreaView style={{flex: 1}}>
  <ScrollView>
    <Text>1</Text>
  <ScrollView/>
</SafeAreaView>
```

性能测试：

```js
// 10 个 item 就能填满整个屏幕，渲染很快
// 1000 个 item 相当于 100+ 个屏幕的高度，渲染很慢
const NUM_ITEMS = 1000;
const makeContent = (nItems: number, styles: any) => {
  return Array(nItems)
         .fill(1)
         .map((_, i) => (
            <Pressable
              key={i}
              style={styles}
             >
                 <Text>{'Item ' + i}</Text>
            </Pressable>
          ));
 };
const App = () => {
    </SafeAreaView>
  );
};

```

上面这段代码，说的就是使用 ScrollView 组件一次性直接渲染 1000 个子视图，这里没有做任何懒加载优化。

使用 ScrollView 组件时，ScrollView 的所有内容都会在首次刷新时进行渲染。内容很少的情况下当然无所谓，内容多起来了，速度也就慢下来了

优化方案

用 React Native 开发的、类似抖音的视频流页面，用的就是按需渲染。用户始终只会看到当前屏幕显示的视频、下一个视频和上一个视频，我们只需要用ScrollView 渲染 3 个视频就能满足用户的所有操作。这样做，无论用户怎么翻页，内存中就只有 3 个视频，当然也不会卡了。刚刚说的视频流按需加载，做起来是相对容易一些的，因为只用控制 3 个视频就可以了。但类似微信朋友圈、京东首页这种一屏有多条信息内容的复杂列表页，手动按需加载就麻烦很多。那有没有“自动"的按需加载方案呢？有。

### FlatList：按需渲染的列表组件

FlatList 列表组件就是 “自动”按需渲染的。FlatList 是 React Native 官方提供的第二代列表组件。FlatList 组件底层使用的是虚拟列表 VirtualizedList，VirtualizedList 底层组件使用的是 ScrollView 组件。因此VirtualizedList 和 ScrollView 组件中的大部分属性，FlatList 组件也可以使用。关于我们要知道，列表组件和滚动组件的关键区别是，列表组件把其内部子组件看做由一个个
列表项组成的集合，每一个列表项都可以单独渲染或者卸载。而滚动组件是把其内部子组件看做一个整体，只能整体渲染。而自动按需渲染的前提就是每个列表项可以独立渲染或卸载。

简单地讲，FlatList 性能比 ScrollView 好的原因是， FlatList 列表组件利用按需渲染机制减少了首次渲染的视图，利用空视图的占位机制回收了原有视图的内存，你可以对比一下
二者的区别：

```
// 从上到下滚动时的渲染方式
// SrcollView 渲染方式：一次渲染所有视图
SrcollView0_9 = [{👁},{ },{ },{ }] // 浏览0~9条列表项
SrcollView10_19 = [{ },{👁},{ },{ }] // 浏览10~19条列表项
SrcollView20_29 = [{ },{ },{👁},{ }] // 浏览20~29条列表项
SrcollView30_39 = [{ },{ },{ },{👁}] // 浏览30~39条列表项
// FlatList 渲染方式：按需渲染，看不见的地方用 $empty 占位
FlatList0_9 = [{👁},{ }] // 浏览0~9条列表项
FlatList10_19 = [{ },{👁},{ }] // 浏览10~19条列表项
FlatList20_29 = [$empty,{},{👁},{}] // 浏览20~29条列表项
FlatList30_39 = [$empty,$empty,{ },{👁}]// 浏览30~39条列表项
```

40 条列表只是一个假设的例子，实现 FlatList 自动按需渲染的思路具体可以分为三步：

* 通过滚动事件的回调参数，计算需要按需渲染的区域；
* 通过需要按需渲染的区域，计算需要按需渲染的列表项索引；
* 只渲染需要按需渲染列表项，不需要渲染的列表项用空视图代替。

第一步，计算按需渲染区域。具体地说，每次你滚动页面，都会触发滚动组件 ScrollView 组件的一个“异步”回调 onScroll 事件。

在 onScroll 事件中，我们可以获取到当前滚动的偏移量 offset 等信息。以当前滚动的偏移量为基础，默认向上数 10 个屏幕的高度，向下数 10 个屏幕的高度，这一共 21 个屏幕的内容就是需要按需渲染的区域，其他区域都是无需渲染的区域。这样，即便是异步渲染，我们也不能保证所有 JavaScript 执行的渲染任务都实时地交由 UI 线程处理，立刻展示出来。但因为有这 10 个屏幕的内容作为缓冲，用户无论是向上滚动还是向下滚动，都不至于一滚动就看到白屏。

现在我们知道了按需渲染的区域，接着要计算的就是按需渲染列表项的索引。FlatList 内部实现就是通过 setState 改变按需渲染区域第一个索引和最后一个索引的值，来实现按需渲染的 。

怎么计算按需渲染列表项的索引呢？接着我们继续看第二步。这里我们分两种情况，第一种是列表项的高度是确定的情况，另外一种是列表项的高度是不确定的情况。

如果设计师给的列表项的高度是确定的，那么我们在写代码的时候，就可以通过获取列表项布局属性 getItemLayout 告诉 FlastList。在列表项高度确定，且知道按需渲染区域的情况下，“求按需渲染列表项的索引”就是一个简单的四则运算的问题，程序能够准确地计算出来。

在这种列表项高度不确定，而且给定按需渲染区域的情况下，我们可以通过列表项的平均高度，把按需渲染列表项的索引大致估算出来了。即便有误差，比如预计按需渲染区域为上下 10 个屏幕，实际渲染时只有上下 7、8 个屏幕也是能接受的，大部分情况下用户是感知不到的屏幕外内容渲染的。

但是，实际生产中，如果你不填 getItemLayout 属性，不把列表项的高度提前告诉 FlastList，让 FlastList 通过 onLayout 的布局回调动态计算，用户是可以感觉到滑动变卡的。因此，如果你使用 FlastList，又提前知道列表项的高度，我建议你把 getItemLayout 属性填上。

第三步，渲染需要按需渲染列表项。有了索引后，渲染列表项就变得很简单，用 setState 即可。

假设 1 个屏幕高度的内容由 10 个列表项组成。在首次渲染的时候，按需渲染的列表项索引是 0  -  110 ，这时会渲染 11 个屏幕高度的内容。当用户滑到第 11 个屏幕时，索引就是 0~210，这时再在后面渲染 10 个屏幕高度的内容。当用户滑到第 21 个屏幕时，索引是 100~310，又会再在后面渲染 10 个屏幕高度的内容，同时把前面 10 个屏幕高的内容用空视图代替。当然这个过程是顺滑的，列表项是一个个渲染的，而不是 1 个屏幕或 10 个屏幕渲染的。

### RecyclerListView：可复用的列表组件

聊完 FlastList，我们再来看下 RecyclerListView。

RecyclerListView 是开源社区提供的列表组件，它的底层实现和 FlatList 一样也是ScrollView，它也要求开发者必须将内容整体分割成一个个列表项。

在首次渲染时，RecyclerListView 只会渲染首屏内容和用户即将看到的内容，所以它的首次渲染速度很快。在滚动渲染时，只会渲染屏幕内的和屏幕附近 250 像素的内容，距离屏
幕太远的内容是空的。

React Native 的 RecyclerListView 复用灵感来源于 Native 的可复用列表组件。在 iOS 中，表单视图 UITableView，实际就是可以上下滚动、左右滚动的可复用列表组件。它可以通过复用唯一标识符 reuseIdentifier，标记表单中的复用单元 cell，实现单元cell 的复用。

在 Android 上，动态列表 RecyclerView 在列表项视图滚出屏幕时，不会将其销毁，相反会把滚动到屏幕外的元素，复用到滚动到屏幕内的新的列表项上。这种复用方法可以显著提高性能，改善应用响应能力，并降低功耗。

如果你只开发过 Web，你可以这样理解复用：原来你要销毁一个浏览器中 DOM，再重新创建一个新的 DOM，现在你只改变了原有 DOM 的属性，并把原有的 DOM 挪到新的位置上。

RecyclerListView 的复用机制是这样的，你可以把列表比作数组 list，把列表项类比成数组的元素。用户移动 ScrollView 时，相当于往数组 list 后面 push 新的元素对象，而 RecyclerListView 相当于把 list 的第一项挪到了最后一项中。挪动对象位置用到的计算资源少，也不用在内存中开辟一个新的空间。而创建新的对象，占用计算资源多，同时占用新的内存空间。

简而言之，RecyclerListView 在滚动时复用了列表项，而不是创建新的列表项，因此性能好。

#### 从使用方式看底层原理

接下来，我们从 RecyclerListView 使用方式的角度，进一步地剖析其底层原理。

RecyclerListView 有三个必填参数：

* 列表数据：dataProvider(dp)；
* 列表项的布局方法：layoutProvider；
* 列表项的渲染函数：rowRenderer。

第一个必填参数列表数据 dataProvider（dp）。为了区分列表数据 dataProvider（第一个字母小写）和列表数据类 DataProvider（第一个字母大写），后面我会用缩写 dp 来代替列表数据，其使用方法如下：

```js
const listData = Array(300).fill(1).map( (_,i) => i)
const dp = new DataProvider((r1, r2) => {
  this.state = {
    dataProvider: dp.cloneWithRows(listData),
  };
this.setState({
  dataProvider: dp.cloneWithRows(newListData),
})
```

在上面代码中，我们首先通过 Array(300) 创建了一个长度为 300 的数组 listData，其内容是 0~299 的数字，我们通过它来模拟 300 条信息数据。

接着，dp 是列表数据类 DataProvider new 出来的对象，它是一个存放 listData 的数据容器。它有一个必填参数，就是对比函数。在列表项复用时，对比函数会频繁地调用，因此我们只推荐对更新数据进行 r1 !== r2 的浅对比，不推荐深对比。

第三部分代码，是我们调用 dp.cloneWithRow 方法，该方法接收 listData 数组作为参数，这时我们正式把 listData 装到了 dp 容器中。其返回值 dataProvider，就是 React 的列表状态。

第四部分代码，是我们调用 setState 方法，该方法接收 dp.cloneWithRows()  的返回的 dp 对象作为参数，dp 列表数据对象更新了，整个列表也就更新了。

**第二个必填参数，列表项的布局方法 layoutProvider。**

```js
const _layoutProvider = new LayoutProvider(
  (index) => {
    if (index % 3 === 0) {
      return ViewTypes.FULL;
    } else {
      return ViewTypes.HALF_RIGHT;
    }
  },
  (type, dimension) => {
    switch (type) {
      case ViewTypes.HALF_RIGHT:
        dimension.width = width / 2;
        dimension.height = 160;
        break;
        break;
    }
  }
);

```

layoutProvider 类初始化时，有两个函数入参。第一个入参函数是通过索引 index 获取类型 type，对应的是类型可枚举。第二个入参函数是通过类型 type 和布局尺寸 dimension
获取每个类型的宽高 width 和 height，对应的是确定宽高。

用起来很简单，但这两个入参为什么要这么设计，它们有什么用？

使用列表组件 RecyclerListView 有两个前提：首先是列表项的宽高必须是确定的，或者是大致确定的；第二是列表项的类型必须是可枚举的。这两个前提，都体现在了列表项的布局方法 layoutProvider 中了。
