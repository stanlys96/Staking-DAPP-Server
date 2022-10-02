const express = require('express');
const app = express();
const cors = require('cors');
const { ethers } = require('ethers');
const CronJob = require('cron').CronJob;
const TokenFarm = require('./chain-info/contracts/TokenFarm.json');
const networkMapping = require('./networkMapping.json');

require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(
  process.env.GOERLI_INFURA
);
const private = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(private, provider);

const tokenFarmAddress =
  networkMapping['5']['TokenFarm'][networkMapping['5']['TokenFarm'].length - 1];

const tokenFarmContract = new ethers.Contract(
  tokenFarmAddress,
  TokenFarm.abi,
  wallet
);

const job = new CronJob(
  '* * * * *',
  () => {
    tokenFarmContract
      .issueRewards()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error, '<<<<');
      });
  },
  null,
  true
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}...`);
});
