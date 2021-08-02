import async from 'async';
import {
  GAS_PRICE_API,
  ZAPPER_GAS_PRICE_API,
  ERROR,
  STORE_UPDATED,
  CONFIGURE,
  ACCOUNT_CONFIGURED,
  GET_ACCOUNT_BALANCES,
  ACCOUNT_BALANCES_RETURNED,
  CONFIGURE_VAULTS,
  CONFIGURE_LENDING,
  CONFIGURE_CDP,
  LENDING_CONFIGURED,
  CDP_CONFIGURED,
  ACCOUNT_CHANGED,
  GET_GAS_PRICES,
  GAS_PRICES_RETURNED,
} from './constants';

import { ERC20ABI } from './abis';

import { bnDec } from '../utils';

import stores from './';

import { injected, walletconnect, walletlink, fortmatic, portis, network } from './connectors';

import BigNumber from 'bignumber.js';
import Web3 from 'web3';

class Store {
  constructor(dispatcher, emitter) {
    this.dispatcher = dispatcher;
    this.emitter = emitter;

    this.store = {
      account: null,
      chainInvalid: false,
      web3context: null,
      tokens: [],
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        // Ledger: ledger,
        // Trezor: trezor,
        // Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        // Squarelink: squarelink,
        // Torus: torus,
        // Authereum: authereum
      },
      gasPrices: {
        standard: 90,
        fast: 100,
        instant: 130,
      },
      gasSpeed: 'fast',
      currentBlock: 11743358,
    };

    dispatcher.register(
      function (payload) {
        console.log('running, payload info here ---->', payload)
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_ACCOUNT_BALANCES:
            this.getBalances(payload);
            break;
          default: {
          }
        }
      }.bind(this),
    );
  }

  getStore(index) {
    return this.store[index];
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj };
    // console.log(this.store);
    return this.emitter.emit(STORE_UPDATED);
  }

  configure = async () => {
    this.getGasPrices();
    this.getCurrentBlock();
     injected.isAuthorized().then((isAuthorized) => {
      console.log('connected', isAuthorized);
      console.log('injected contract=', injected)
      const { supportedChainIds } = injected;
      // fall back to ethereum mainnet if chainId undefined
      const { chainId = 1 } = window.ethereum || {};
      const parsedChainId = parseInt(chainId, 16);
      const isChainSupported = supportedChainIds.includes(parsedChainId);
      console.log('isAuth- ', isAuthorized, 'issupportchain', isChainSupported);
      if (isAuthorized && isChainSupported) {
        injected
          .activate()
          .then((a) => {
            console.log('account info',a);
            this.setStore({
              account: { address: a.account },
              web3context: { library: { provider: a.provider } },
            });
            // console.log('provier found. ',a.provider);
            // console.log('account found. ',a.account);
            // console.log('account store', this.store)
            // console.log('----------------------------');
            this.emitter.emit(ACCOUNT_CONFIGURED);

            this.dispatcher.dispatch({
              type: CONFIGURE_VAULTS,
              content: { connected: true },
            });
            this.dispatcher.dispatch({
              type: CONFIGURE_LENDING,
              content: { connected: true },
            });
            this.dispatcher.dispatch({
              type: CONFIGURE_CDP,
              content: { connected: true },
            });
          })
          .catch((e) => {
            this.emitter.emit(ERROR, e);
            this.emitter.emit(ACCOUNT_CONFIGURED);

            this.dispatcher.dispatch({
              type: CONFIGURE_VAULTS,
              content: { connected: false },
            });
            this.dispatcher.dispatch({
              type: CONFIGURE_LENDING,
              content: { connected: false },
            });
            this.dispatcher.dispatch({
              type: CONFIGURE_CDP,
              content: { connected: false },
            });
          });
      } else {
        //we can ignore if not authorized.

         this.emitter.emit(ACCOUNT_CONFIGURED);
        this.emitter.emit(LENDING_CONFIGURED);
        this.emitter.emit(CDP_CONFIGURED);

        this.dispatcher.dispatch({
          type: CONFIGURE_VAULTS,
          content: { connected: false },
        });

        if (!isChainSupported) {
          this.setStore({ chainInvalid: true });
        }

      }
    });

    // console.log('content not connected');
    // this.dispatcher.dispatch({
    //   type: CONFIGURE_VAULTS,
    //   content: { connected: false },
    // });

    if (window.ethereum) {
      this.updateAccount();
    } else {
      window.removeEventListener('ethereum#initialized', this.updateAccount);
      window.addEventListener('ethereum#initialized', this.updateAccount, {
        once: true,
      });
    }
  };


  disconnectAccount = async (add) =>{    //connection - string hex , disR = 'all' , 'wallet'
    const that = this;
    // const account = this.getStore('account');
    // if (!account) {
    //   return false;
    //   //maybe throw an error
    // }

    // const web3 =  this.getWeb3Provider();
    // if (!web3) {  thank you Zee,  making me realise who i really am, and through the grace of God he chose you too show me the way , very much appriciated . love Zunaid.
    //   return false;
    //   //maybe throw an error
    // }
console.log('injected',injected,add,"------", this.store.web3context, web3 );

console.log('removing account');

 injected.deactivate()
// this.store.web3context.deactivate();
injected.handleClose();
this.setStore({ account: null, web3context: null });

this.dispatcher.dispatch({
  type: CONFIGURE_VAULTS,
  content: { connected: false },
});

this.setStore({ chainInvalid: true });

window.removeEventListener('ethereum#initialized', this.updateAccount);
window.addEventListener('ethereum#initialized', this.updateAccount, {
  once: true,
});


this.emitter.emit(ACCOUNT_CONFIGURED);
this.emitter.emit(LENDING_CONFIGURED);
this.emitter.emit(CDP_CONFIGURED);



  }

  updateAccount = () => {
    const that = this;
   window.ethereum.on('accountsChanged', function (accounts) {
      console.log('account change updated. ',accounts);
      that.setStore({
        account: { address: accounts[0] },
        web3context: { library: { provider: window.ethereum } },
      });
      that.emitter.emit(ACCOUNT_CHANGED);
      that.emitter.emit(ACCOUNT_CONFIGURED);

      that.dispatcher.dispatch({
        type: CONFIGURE_VAULTS,
        content: { connected: true },
      });
      that.dispatcher.dispatch({
        type: CONFIGURE_LENDING,
        content: { connected: true },
      });
      that.dispatcher.dispatch({
        type: CONFIGURE_CDP,
        content: { connected: true },
      });
    });

    window.ethereum.on('chainChanged', function (chainId) {
      const supportedChainIds = [1];
      const parsedChainId = parseInt(chainId, 16);
      const isChainSupported = supportedChainIds.includes(parsedChainId);
      console.log('changes requested',chainId);
      that.setStore({ chainInvalid: !isChainSupported });

      that.emitter.emit(ACCOUNT_CHANGED);
    });




  };

  getBalances = async (payload) => {
    const account = this.getStore('account');
    if (!account) {
      return false;
      //maybe throw an error
    }

    const web3 = await this.getWeb3Provider();
    if (!web3) {
      return false;
      //maybe throw an error
    }

    const vaults = stores.investStore.getStore('vaults');

    const vaultTokens = vaults.map((v) => {
      return {
        address: v.tokenAddress,
        decimals: v.tokenMetadata.decimals,
        symbol: v.tokenMetadata.symbol,
        displayName: v.tokenMetadata.displayName,
        name: v.tokenMetadata.name,
        icon: v.tokenMetadata.icon,
      };
    });
    //get lelnding assets, append them to this
    async.map(
      vaultTokens,
      async (token, callback) => {
        try {
          const erc20Contract = new web3.eth.Contract(ERC20ABI, token.address);
          const balanceOf = await erc20Contract.methods.balanceOf(account.address).call();

          token.balance = BigNumber(balanceOf).div(bnDec(token.decimals)).toFixed(token.decimals, BigNumber.ROUND_DOWN);

          if (callback) {
            callback(null, token);
          } else {
            return token;
          }
        } catch (ex) {
          console.log(ex);
        }
      },
      (err, tokensBalanced) => {
        if (err) {
          return this.emitter.emit(ERROR, err);
        }

        const tokens = this.setStore({ tokens: tokensBalanced });
      },
    );
  };

  getCurrentBlock = async (payload) => {
    try {
      var web3 = new Web3(process.env.NEXT_PUBLIC_PROVIDER);
      const block = await web3.eth.getBlockNumber();
      this.setStore({ currentBlock: block });
    } catch (ex) {
      console.log(ex);
    }
  };

  getGasPrices = async (payload) => {
    const gasPrices = await this._getGasPrices();
    let gasSpeed = localStorage.getItem('yearn.finance-gas-speed');

    if (!gasSpeed) {
      gasSpeed = 'fast';
      localStorage.getItem('yearn.finance-gas-speed', 'fast');
    }

    this.setStore({ gasPrices: gasPrices, gasSpeed: gasSpeed });
    this.emitter.emit(GAS_PRICES_RETURNED);
  };

  _getGasPrices = async () => {
    try {
      const url = ZAPPER_GAS_PRICE_API;
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json();

      if (priceJSON) {
        return priceJSON;
      }
    } catch (e) {
      console.log(e);
      const web3 = await this._getWeb3Provider();
      const gasPrice = await web3.eth.getGasPrice();
      const gasPriceInGwei = web3.utils.fromWei(gasPrice, "gwei");
      return {
        standard: gasPriceInGwei,
        fast: gasPriceInGwei,
        instant: gasPriceInGwei,
      };
    }
  };

  getGasPrice = async (speed) => {
    let gasSpeed = speed;
    if (!speed) {
      gasSpeed = this.getStore('gasSpeed');
    }

    try {
      const url = ZAPPER_GAS_PRICE_API;
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json();

      if (priceJSON) {
        return priceJSON[gasSpeed].toFixed(0);
      }
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  getWeb3Provider = async () => {
    let web3context = this.getStore('web3context');
    let provider = null;

    if (!web3context) {
      provider = network.providers['1'];
    } else {
      provider = web3context.library.provider;
    }

    if (!provider) {
      return null;
    }
    return new Web3(provider);
  };
}

export default Store;
