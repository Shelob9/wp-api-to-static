const unified = require('unified')
const createStream = require('unified-stream')
const parse = require('rehype-parse')
const rehype2remark = require('rehype-remark')
const stringify = require('remark-stringify')

const processor = unified()
  .use(parse)
  .use(rehype2remark)
  .use(stringify)


module.exports = async function htmlToMarkdown(content: String){
  return new Promise( (resolve,reject) => {
    processor.process(content, (err: Error,file:{
      contents: String
    }) => {
        if( err ){
          reject(err);
        }
        resolve(file.contents);

    });
  });
   
}
