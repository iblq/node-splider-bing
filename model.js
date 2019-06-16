const rp = require('request-promise');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { localPath } = require('./config');

module.exports = {
  // 异步方法下，请求拿到的url，并返回了请求结果
  async getPageData(url) {
    let res = null;
    try {
      res = await rp({ url: url });
      console.log('req success');
    } catch (err) {
      console.log('request error ', err);
    }
    return res;
  },

  //  将请求到的pages通过 cheerio 解析，转化成可操作节点
  getCurrentPage(data) {
    let list = [];
    const $ = cheerio.load(data);

    // 一页的图片
    $('.container img').each(async (i, e) => {
      let src = e.attribs.src;

      let imgObj = {
        path: src,
        name: src.split('/')[src.split('/').length - 1]
      };
      list.push(imgObj);
    });

    return list;
  },

  //  判断并创建储存爬取到内容的文件夹
  newDir(num) {
    // 文件夹路径预设
    let targetPath = `${localPath}${num}`;
    if (!fs.existsSync(targetPath)) {
      //查看是否存在这个文件夹
      fs.mkdirSync(targetPath);
      console.log(`${targetPath} 文件夹创建成功`);
      return true;
    }
  },

  //下载图片
  async downloadImage(imgList, num) {
    console.log('downloading.. ', num);
    for (i of imgList) {
      let filePath = `${localPath}${num}/${i.name}`;
      if (!fs.existsSync(filePath)) {
        try {
          await rp({
            url: i.path,
            resolveWithFullResponse: true
            // headers
          }).pipe(fs.createWriteStream(`${localPath}${num}/${i.name}`));
          console.log(`${i.name} 下载成功`);
        } catch (err) {
          console.log('request error', err); //下载
        }
      }
    }
  },

  async down(url, name) {
    try {
      await rp({
        url: url,
        resolveWithFullResponse: true
        // headers
      }).pipe(fs.createWriteStream(`${path.join(__dirname, 'down/')}${name}`));
      console.log(`${name} 下载成功`);
    } catch (err) {
      console.log('request error', err); //下载
    }
  }
};
