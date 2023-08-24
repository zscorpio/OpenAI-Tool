const express = require('express');
const BalanceService = require('./service/BalanceService');

const app = express();
const port = 3000;

// 支持json请求
app.use(express.json());

app.get('/getBalance', async (req, res) => {
    let { account, password } = req.query;
    let result = await BalanceService.getBalance(account, password);
    res.send(JSON.stringify(result));
});

app.post('/getBalance', async (req, res) => {
    let { accountList } = req.body;
    let result = {};
    for(let i in accountList){
        let {account, password } = accountList[i];
        result[account] = await BalanceService.getBalance(account, password);
    }
    console.log(result);
    res.send(JSON.stringify(result));
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
