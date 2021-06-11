# Yearn.Finance UI Update

## TODO:
- [x] Made a bunch of changes
- [ ] List those changes
- [x] Landing page added
- [x] Restyled Invest (Light & Dark)
- [x] Restyled Vault Detail (Light & Dark)
- [x] Restyled Lend (Light & Dark)
- [x] Restyled CDP (Light & Dark)
- [x] Restyled LTV Lookup (Light & Dark)
- [x] Restyled Stats (Light & Dark)
- [ ] Broke TOP APY Tooltips somehow, need to find the issue
- [ ] Clean up breakpoints
- [ ] Conditional CTA links on the landing page (Connected vs Not Connected)
- [ ] Display 'Connect Wallet' CTA on landing page when not connected.
- [x] Fix VaultActionCard styling issue


## Getting started
- Make sure to have nodejs installed. This app is built using [Next.js](https://nextjs.org/learn/basics/create-nextjs-app) and [react](https://reactjs.org/docs/getting-started.html).
- Run `npm install`
- Create an account on [etherscan](https://etherscan.io/) then go to [your API keys](https://etherscan.io/myapikey) page and add a new API key there.
- Create an account on [infura](https://infura.io/dashboard) and create an [ethereum project](https://infura.io/dashboard/ethereum) there. This will give you an endpoint url that looks like `https://mainnet.infura.io/v3/some_key`. Alternatively, you can also run your own [ethereum rpc server](https://geth.ethereum.org/docs/rpc/server) instead of infura.
- You can now run the nextjs app this way: `NEXT_PUBLIC_ETHERSCAN_KEY=your_etherscan_key NEXT_PUBLIC_PROVIDER=your_infura_endpoint_url npm run dev`
- That's it! You can now start hacking and submit PRs. Some of us are in [discord](http://discord.yearn.finance/) in the #dev channel if you have questions.
