const model = require('./model');
const path = require('path');

const config = require('./config');

const { startPage, maxPage, basicPath, localPath } = config;

let pages = [];
for (let i = startPage; i < maxPage + 1; i++) {
  pages.push(i === 0 ? '' : `?p=${i}`);
}

// 执行函数
const exec = async param => {
  // 拼接页面 url
  let portalPath = basicPath + param;

  param = param === '' ? '0' : param.substr(3);

  console.log('开始新的页面');

  // request 页面 dom 数据
  const data = await model.getPageData(portalPath);
  if (!data) return;

  // 新建文件夹，以编号命名
  model.newDir(param);

  // 获取页面图片 path、name 的 list，和 下几页的 a 标签 href 属性数组
  let list = model.getCurrentPage(data);

  // 下载图片
  await model.downloadImage(list, param);
};

let main = async () => {
  for (let i of pages) {
    exec(i);
  }
};

main();
