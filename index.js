const model = require('./model');
const path = require('path');

const config = require('./config');

const { start, end, basicPath, type } = config;

// 套图首页页面编号数组 ['955', '956', ...]
let pages = [];
for (let i = start; i < end + 1; i++) {
  pages.push(i);
}

// 执行函数
const exec = async i => {
  let portal = i + type;

  // 拼接页面 url
  let portalPath = basicPath + 'rosi_' + portal;

  console.log('开始新的套图');

  // request 页面 dom 数据
  const data = await model.getPageData(portalPath);
  if (!data) return;

  // 新建文件夹，以编号命名
  model.newDir(i);

  // 获取页面图片 path、name 的 list，和 下几页的 a 标签 href 属性数组
  let { list, nextHrefs } = model.getCurrentPage(data);

  // 下载图片
  await model.downloadImage(list, i);

  // 循环下载套图其他分页图片
  if (nextHrefs) {
    for (let n of nextHrefs) {
      let res = await model.getPageData(basicPath + n);

      let { list } = model.getCurrentPage(res);
      await model.downloadImage(list, i);
    }
  }
};

let main = async () => {
  for (let i of pages) {
    exec(i);
  }
};

main();
