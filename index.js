const express = require('express');
const BalanceService = require('./service/BalanceService');

const app = express();
const port = 3000;

app.get('/getBalance', async (req, res) => {
    let { account, password } = req.query;
    let result = await BalanceService.getBalance(account, password);
    res.send(result);
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
