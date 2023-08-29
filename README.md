# OpenAI-Tool

OpenAI-Tool, 目前只支持查询余额

## 更新记录

8.29 请求之后会缓存http头部的authorization到本地文件cache, 下次如果这个没有失效, 会直接http请求来获取余额加快请求速度.
考虑再加个利用github action定时获取余额推送邮件或者企业微信.

## 实现逻辑

其实之前有好多余额查询的代码, 但是现在应该都挂掉了, 因为各种原因, 有些场景还是比较依赖OpenAI的余额查询, 所以最后还是考虑自己再写一个.
因为近期一直折腾爬虫相关逻辑, 所以就基于 Node.js + Puppeteer实现了一个模拟登录批量查询余额的接口.

## tips

- 因为利用的是模拟登录查询需要账号密码, 所以三方部署不可信, 仅当你绝对信任三方搭建的平台的时候, 才去调用
- 因为用的puppeteer, 所以对机器要求还是有一点的, 有人需要的话, 我可以部署个docker, 不支持并发, 否则低配置机器CPU扛不住.

## Live Demo

刚用阿里云 云函数搭建了一个, 腾讯云 云函数比较简单, 华为云太折腾了, 搞不定.
耗时大概5s左右, 还不算太慢.

```shell
curl  'https://htmlpng-puppetetest-sxg-sacjhvqgdv.us-east-1.fcapp.run/?account=-pd8umqoa@hvtp50.szww.uk&password=1lEzsR94'
```

## 使用姿势

```shell
git clone git@github.com:zscorpio/OpenAI-Tool.git
cd OpenAI-Tool
npm install
node index.js
```

启动成功之后, 就可以查询了.

```shell
单个查询 : curl  'http://127.0.0.1:3000/getBalance?account=账号&password=密码'
```

```shell
批量查询 : 
curl --location --request POST 'http://127.0.0.1:3000/getBalance' \
--data-raw '{
    "accountList": [
        {
            "account": "账号1",
            "password": "密码1"
        },
        {
            "account": "账号2",
            "password": "密码2"
        }
    ]
}'
```
