# xuehai-dict-exporter

Easily export data from the dictionary application and print to pdf, currently supporting the dictionary application of Xuehai Tablet. 

### Usage

**Step 1.** Fetch request `https://dict.yunzuoye.net/api/v1/pub/words/list?dictionaryType=ENG&updateTime=0` by yourself, then save the response as `data.json` file in the project root.

**Step 2.** Run `node src/index.js`, then a HTML file would be created in the root and automatically open in your browser. Press `Ctrl + P` to invoke the built-in print dialog of the browser, then do whatever you want.

<!-- **Step 2.** Run `yarn` to install dependencies. This only needs to be run the first time you launch or after upgrading the source code.

**Step 3.** Run `yarn start` or `node src/index.js`, then a HTML file would be created in the root and automatically open in your browser. Press `Ctrl + P` to invoke the built-in print dialog of the browser, then do whatever you want. -->

### Configuration

> TODO

### Feature: Custom Word Meanings

Sometimes the dictionary app provides imprecise or unnessary meanings, thus we need to modify them ourselves.

You just need to change the word meanings directly in `cache.json`, and these changes will not be overwritten and will be applied at the next runtime.

Use the configuration file to disable this default feature.
