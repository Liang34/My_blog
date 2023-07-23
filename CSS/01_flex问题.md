#### 前置文章：

[Flex 布局教程](https://ruanyifeng.com/blog/2015/07/flex-grammar.html)

```CSS
// 父属性
flex-direction: row | row-reverse | column | column-reverse; // 主轴方向
flex-wrap: nowrap | wrap | wrap-reverse; // 换行
flex-flow: <flex-direction> || <flex-wrap>; // 组合属性
justify-content: flex-start | flex-end | center | space-between | space-around; // 属性定义了项目在主轴上的对齐方式。
align-items: flex-start | flex-end | center | baseline | stretch; // 交叉轴上如何对齐。
align-content: flex-start | flex-end | center | space-between | space-around | stretch; // 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
```

```CSS
/*子属性*/
order: <integer>; // 属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
flex-grow: <number>; /* default 0 */ // 属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
flex-shrink: <number>; /* default 1 */ // 属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
flex-basis: <length> | auto; /* default auto */
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]// flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
align-self: auto | flex-start | flex-end | center | baseline | stretch; // 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性
```

问题一：用flex实现九宫格

直接让子元素的宽高为父元素的1/3，然后父元素设置flex-warp: warp即可

```html
<style>
        #container {
            display: flex;
            flex-wrap: wrap;
            width: 100vw;
            height: 100vh;
        }
        #container div {
            width: 30vw;
            height: 30vh;
        }
</style>
<div id="container">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
</div>
```
