const express = require('express');
const BalanceService = require('./service/BalanceService');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);

const app = express();
const port = process.env.PORT;

// 支持json请求
app.use(express.json());

app.get('/', async (req, res) => {
    return res.sendFile(appDir + '/views/index.html');
});

app.get('/accountList', async (req, res) => {
    let accountList = JSON.parse(fs.readFileSync(appDir + '/config/account.json')).accountList;
    res.send(JSON.stringify(accountList));
});

app.get('/getBalance', async (req, res) => {
    let { account, password } = req.query;
    let result = await BalanceService.getBalance(account, password);
    res.send(JSON.stringify(result));
});

app.post('/getBalance', async (req, res) => {
    let { accountList } = req.body;
    let result = {};
    for (let i in accountList) {
        let { account, password } = accountList[i];
        result[account] = await BalanceService.getBalance(account, password);
    }
    res.send(JSON.stringify(result));
});

// app.get('/startQuery', async (req, res) => {
//     let { account, password } = req.query;
//     let result = await BalanceService.getBalance(account, password);
//     res.send(JSON.stringify(result));
// });

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
