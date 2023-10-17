

class CanvasTable {
  constructor(options = {}) {
    this.options = options;
    // el ----> canvers
    const { el, slideWrap, slide, table: { rowHeight, columns, headerHight } } = options;
    this.el = el; // canvans dom
    this.ctx = el.getContext("2d"); // cannvans画布环境
    this.rowHeight = rowHeight; // 表col的高度
    this.headerHight = headerHight; // 表头高度
    this.slideWrap = slideWrap; // 自定义滑块容器
    this.slide = slide; // 自定义滑块
    this.columns = columns; // 表列
    this.tableData = []; // canvans渲染的数据
    this.startIndex = 0; // 数据起始位
    this.endIndex = 0; // 数据末尾索引
    this.init();
  }
  init() {
    // 初始化数据
    this.setDataByPage();
    // 纵向滚动条Y
    this.setScrollY();
  }

  setDataByPage() {
    const { el, rowHeight, options: { table: { tableData: sourceData = [] } } } = this;
    const limit = Math.floor((el.height - rowHeight) / rowHeight); // 最大限度展示可是区域条数
    const endIndex = Math.min(this.startIndex + limit, sourceData.length)
    this.endIndex = endIndex;
    this.tableData = sourceData.slice(this.startIndex, this.endIndex);
    if (this.tableData.length === 0 || this.startIndex + limit > sourceData.length) {
      console.log('到底了')
      return;
    }
    console.log(this.tableData, 'tableData')
    // 清除画布
    this.clearCanvans();
    // 绘制表头
    this.drawHeader();
    // 绘制body
    this.drawBody();
  }
  clearCanvans() {
    // 当宽高重新设置时，就会重新绘制
    const { el } = this;
    el.width = el.width;
    el.height = el.height;
  }

  drawHeader() {
    const { ctx, el: canvansDom, rowHeight } = this;
    // 第一条横线
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvansDom.width, 0);
    ctx.lineWidth = 0.5;
    ctx.closePath();
    ctx.stroke();
    // 第二条横线
    ctx.beginPath();
    ctx.moveTo(0, rowHeight);
    ctx.lineTo(canvansDom.width, rowHeight);
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.closePath();
    const colWidth = Math.ceil(canvansDom.width / columns.length);
    // 绘制表头文字内容
    for (let index = 0; index < columns.length + 1; index++) {
      if (columns[index]) {
        ctx.fillText(columns[index].label, index * colWidth + 10, 18);
      }
    }
  }

  drawBody() {
    const { ctx, el: canvansDom, rowHeight, tableData, columns } = this;
    const row = Math.ceil(canvansDom.height / rowHeight);
    const tableDataLen = tableData.length;
    const colWidth = Math.ceil(canvansDom.width / columns.length);// 列宽
    // 画横线
    for (let i = 2; i < row + 2; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * rowHeight);
      ctx.lineTo(canvansDom.width, i * rowHeight);
      ctx.stroke();
      ctx.closePath();
    }
    console.log(this.tableData, 'tableDataLen')
    // 绘制竖线
    for (let index = 0; index < columns.length + 1; index++) {
      ctx.beginPath();
      ctx.moveTo(index * colWidth, 0);
      ctx.lineTo(index * colWidth, (tableDataLen + 1) * rowHeight);
      ctx.stroke();
      ctx.closePath();
    }
    // 填充内容
    const columnsKeys = columns.map((v) => v.key);
    //   ctx.fillText(tableData[0].name, 10, 48);
    for (let i = 0; i < tableData.length; i++) {
      columnsKeys.forEach((keyName, j) => {
        const x = 10 + colWidth * j;
        const y = 18 + rowHeight * (i + 1);
        if (tableData[i][keyName]) {
          ctx.fillText(tableData[i][keyName], x, y);
        }
      });
    }
  }

  setScrollY() {
    const { slideWrap, slide, throttle, rowHeight, el, options } = this;
    const dom = options.touchCanvans ? el : slide;
    if (!options.touchCanvans) {
      slideWrap.style.opacity = 1;
    }
    let startY = 0; // 起始点
    let scrollEndIndex = -1; // 当滚动条滑到底部时，数据未完全加载完毕时
    const getSlideWrapStyleValue = () => {
      return slideWrap.style.transform ? slideWrap.style.transform.match(/\d/g).join('') * 1 : 0;
    }
    const move = (event) => {
      // console.log(event.clientY, 'event.clientY')
      let scrollY = event.clientY - startY;
      let transformY = getSlideWrapStyleValue();
      // console.log(transformY, 'transformY')
      if (scrollY < 0) {
        console.log('到顶了，不能继续上滑动了...')
        scrollY = 0;
        transformY = scrollY;
        scrollEndIndex = 0;
      } else {
        transformY = scrollY;
      }
      const limit = Math.floor((el.height - rowHeight) / rowHeight); // 最大限度展示可是区域条数
      // 如果拉到最低部了
      if (transformY >= rowHeight * limit - rowHeight * 2) {
        scrollEndIndex++
        transformY = rowHeight * limit - rowHeight * 2;
      }
      slideWrap.style.transform = `translateY(${transformY}px)`;
      // scrollEndIndex 滑到底部，数据还没有加载完毕
      this.startIndex = Math.floor(scrollY / rowHeight) + scrollEndIndex
      throttle(() => {
        this.setDataByPage()
      }, 500)();
    }
    const stop = (event) => {
      dom.onmousemove = null;
      dom.onmouseup = null;
      if (options.touchCanvans) {
        slideWrap.style.opacity = 0;
      }
    }
    dom.addEventListener("mousedown", (e) => {
      if (options.touchCanvans) {
        slideWrap.style.opacity = 1;
      }
      const transformY = getSlideWrapStyleValue();
      startY = e.clientY - transformY;
      dom.onmousemove = throttle(move, 200);
      dom.onmouseup = stop;
    });
  }


  throttle(callback, wait) {
    let timer = null;
    return function () {
      if (timer) return;
      timer = setTimeout(() => {
        callback.apply(this, arguments);
        timer = null;
      }, wait);
    };
  }
}
