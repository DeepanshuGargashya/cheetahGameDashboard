var defaultToastrOptions = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-full-width",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
try {
    toastr.options = defaultToastrOptions;
} catch (e) {}
App = {
  web3Provider: null,
  contractAddress: '0xEFC8272ABEBB63b25382A5c15C5556bAab459AbE',
  contracts: {},
  account: '0x0',
init: async () => {
    await App.initWeb3();
  },
initWeb3: async () => {
    // TODO: refactor conditional
    // Modern DApp Browsers
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('https://eth.bd.evmos.org:8545');
      web3 = new Web3(App.web3Provider);
    }
    await App.initContract();
  },
initContract: async () => {

      var dp = await $.getJSON("./TheUnimpressedCheetah.json");
  console.log("balanceOf", App.web3Provider);
      // Instantiate a new contract from the artifact
      App.contracts.TheUnimpressedCheetah = new web3.eth.Contract(dp.abi, App.contractAddress);
      // Connect provider to interact with contract
      App.contracts.TheUnimpressedCheetah.setProvider(App.web3Provider);
      // await App.render();
      await App.render();
  },
 mintNFTS: async () => {
      // Load contract data

      var instance = await App.contracts.TheUnimpressedCheetah;
      var accountAddress = await web3.eth.getAccounts();
      if(accountAddress.length == 0) {
        showInfo("Error",'Wallet is not connected!!!');
        return false;
      }
      accountAddress = accountAddress[0];
      var totalToMint = $('#mint-now-count').val();
      var minted = await instance.methods.minted(accountAddress).call();
      if(minted == 5 || minted + totalToMint > 5) {
        showInfo("Error",'You can only mint 5 NFTs','Mint Priviledge error!!!');
        return false;
      }
      const nonce = await web3.eth.getTransactionCount(accountAddress, 'latest'); //get latest nonce
      const contractAddress = App.contractAddress;
      var costVal = await App.getSalePrice(totalToMint);
      //the transaction
      
      costVal = costVal * 10**18;
      costVal = costVal.toString();

      const txParams = {
        'from': accountAddress,
        'to': contractAddress,
        'nonce': web3.utils.toHex(nonce),
        'value': web3.utils.toHex(costVal),
        'data': instance.methods.mintNFTs(totalToMint).encodeABI()
      };      
      console.log("txParams",txParams);
      //sign transaction via Metamask
      try {
          const txHash = await window.ethereum
              .request({
                  method: 'eth_sendTransaction',
                  params: [txParams],
              });
              showInfo("Success", 'You can check your transaction on EVMOS explorer <a href="https://evm.evmos.org/' + txHash + ' ">View on Explorer</a>');
          return {
              success: true,
              status: "✅ Check your transaction on Etherscan" + txHash
          }
      } catch (error) {
          showInfo("Error",error.message);
          return {
              success: false,
              status: "Something went wrong: " + error.message
          }
      }
      console.log(`Transaction receipt: ${JSON.stringify(txHash)}`);
 },
 render: async () =>  {
    try {
      // Load account data
      var instance = await App.contracts.TheUnimpressedCheetah;
      var totalMinted = await instance.methods.totalSupply().call();
      var totalToMint = $('#mint-now-count').val();
      $(document).find('.total-minted').html(totalMinted);
      try {
        var salePrice = await App.getSalePrice(totalToMint);
        $('.total-mint-cost').html(salePrice + ' EVMOS'); 
      } catch (e) {
        if(window.web3._provider.chainId != 9001) {
          toastr["error"]("Not connected to EVMOS Mainnet",);
        }
      }
      var accountAddress = await web3.eth.getAccounts();
      if(accountAddress.length == 0) {
        console.log("Wallet is not connected");
        return false;
      }
      App.account = accountAddress[0];
      if(accountAddress[0]) {
       $(".connect_btn_txt").html(addressDisp(accountAddress[0]));
      }
      console.log("accounts",accountAddress);
      var balance = await web3.eth.getBalance(accountAddress[0]);

      balance = balance/10**18;
      balance = balance.toFixed(2);
      
      $(".eth-wallet-balance").html(balance + ' EVMOS');

      // Load contract data
    } catch(error) {
      toastr["error"]("Error occured in EVMOS mainnet. Reloading..")
      console.log("Error in Render",error);
      window.location.reload();
    }
  },
  getSalePrice: async (count) => {
      var instance = await App.contracts.TheUnimpressedCheetah;
      var preSale = await instance.methods.getPreSaleState().call();
      if(preSale) {
        let price = await instance.methods.NFT_PRICE_PRE().call();
        return count*(price/10**18);
      } else {
        let price = await instance.methods.NFT_PRICE().call();
        return count*(price/10**18);
      }
  },
  connectKeplr: async () => {
    if (!window.keplr) {
        alert("Please install keplr extension");
    } else {
      // let chainInfo = {
      //   "chainId": "evmos_9000-4",
      //   "chainName": "Evmos Testnet",
      //   "rpc": "https://tendermint.bd.evmos.dev:26657",
      //   "rest": "https://rest.bd.evmos.dev:1317",
      //   "stakeCurrency": {
      //       "coinDenom": "EVMOS",
      //       "coinMinimalDenom": "atevmos",
      //       "coinDecimals": 18
      //   },
      //   "bip44": {
      //       "coinType": 60
      //   },
      //   "bech32Config": {
      //       "bech32PrefixAccAddr": "evmos",
      //       "bech32PrefixAccPub": "evmospub",
      //       "bech32PrefixValAddr": "evmosvaloper",
      //       "bech32PrefixValPub": "evmosvaloperpub",
      //       "bech32PrefixConsAddr": "evmosvalcons",
      //       "bech32PrefixConsPub": "evmosvalconspub"
      //   },
      //   "currencies": [
      //       {
      //           "coinDenom": "EVMOS",
      //           "coinMinimalDenom": "atevmos",
      //           "coinDecimals": 18
      //       }
      //   ],
      //   "feeCurrencies": [
      //       {
      //           "coinDenom": "EVMOS",
      //           "coinMinimalDenom": "atevmos",
      //           "coinDecimals": 18
      //       }
      //   ],
      //   "gasPriceStep": {
      //       "low": 0,
      //       "average": 1000000000,
      //       "high": 2000000000
      //   },
      //   "features": [
      //       "stargate",
      //       "no-legacy-stdTx",
      //       "ibc-transfer",
      //       "ibc-go"
      //   ]
      // };
    //   let chainInfo = {
    //     "chainId": "evmos_9001-4"
    //     // "rpc": "https://tendermint.bd.evmos.org:26657"
    //   };
    // keplr.experimentalSuggestChain(chainInfo);
        const chainId = "evmos_9001-4";

        // // Enabling before using the Keplr is recommended.
        // // This method will ask the user whether to allow access if they haven't visited this website.
        // // Also, it will request that the user unlock the wallet if the wallet is locked.
        await window.keplr.enable(chainId);
    
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
    
        // // You can get the address/public keys by `getAccounts` method.
        // // It can return the array of address/public key.
        // // But, currently, Keplr extension manages only one address/public key pair.
        // // XXX: This line is needed to set the sender address for SigningCosmosClient.
        const accounts = await offlineSigner.getAccounts();
      console.log("accounts",accounts);
        // // Initialize the gaia api with the offline signer that is injected by Keplr extension.
        // const cosmJS = new SigningCosmosClient(
        //     "https://lcd-cosmoshub.keplr.app",
        //     accounts[0].address,
        //     offlineSigner,
        // );
    }
  },
connectMetaMask: async () =>  {
  const addNetwork = () => {
  const params = [{
    chainId: '0x2329',
    chainName: 'EVMOS Mainnet',
    nativeCurrency: {
      name: 'EVMOS',
      symbol: 'EVMOS',
      decimals: 18
    },
    rpcUrls: ['https://eth.bd.evmos.org:8545'],
    blockExplorerUrls: ['https://evm.evmos.org/blocks']
  }]

  window.ethereum.request({ method: 'wallet_addEthereumChain', params })
    .then(() => console.log('Successfully added EVMOS to Metamask'))
    .catch((error) => console.log("Error in adding EVMOS to metamask", error.message))
  }
  await addNetwork();
  if (window.ethereum) {
     window.web3 = new Web3(window.ethereum);
     try {
       await window.ethereum.request({method: 'eth_requestAccounts'});
       var accAddr = await getAccAddr();
       $(".connect_btn_txt").html(addressDisp(accAddr));
       var balance = await web3.eth.getBalance(accAddr);
       balance = balance/10**18;
       balance = balance.toFixed(2);      

        $(".eth-wallet-balance").html(balance + ' EVMOS');
        $("#connectModal").modal('hide');
       toastr['success']("Wallet Connected");
       return true;
      } catch(e) {
        toastr['error']("Access denied!! " + e);
         return false;
      }
  }
  // Non-DApp Browsers
  else {
      alert('You have to install MetaMask !');
  }
},
changePrice: async () => {
      showLoader();
      var totalToMint = $('#mint-now-count').val();
      var salePrice = await App.getSalePrice(totalToMint);
      $('.total-mint-cost').html(salePrice + ' EVMOS'); 
      console.log("Price change",salePrice);
      hideLoader();
},
checkWhiteList: async ()=> {
    try {
      var accountAddress = await web3.eth.getAccounts();
      if(accountAddress.length == 0) {
        showInfo("Error","Wallet is not connected");
        return false;
      }
      showLoader();
      var instance = await App.contracts.TheUnimpressedCheetah;
      accountAddress = accountAddress[0];
      var whiteList = await instance.methods.verifyUser(accountAddress).call();
      hideLoader();
      if(whiteList) {
        showInfo("Success","You are whitelisted for NFT minting");
      } else {
        showInfo("Error","You are not whitelisted for NFT minting");
      }
    } catch(err) {
      console.log("Error in checking for whitelist",err);
      hideLoader();
    }
},
addToWhiteList: async (addressList) => {
  var instance = await App.contracts.TheUnimpressedCheetah;
  var accountAddress = await web3.eth.getAccounts();
  if(accountAddress.length == 0) {
    showInfo("Error",'Wallet is not connected!!!');
    return false;
  }
  accountAddress = accountAddress[0];
  const nonce = await web3.eth.getTransactionCount(accountAddress, 'latest'); //get latest nonce
  const contractAddress = App.contractAddress;
  try {
    const txParams = {
        'from': accountAddress,
        'to': contractAddress,
        'nonce': web3.utils.toHex(nonce),
        'data': instance.methods.whiteListUsers(addressList).encodeABI()
      };      
      console.log("txParams",txParams);
      // return;
          const txHash = await window.ethereum
              .request({
                  method: 'eth_sendTransaction',
                  params: [txParams],
              });
              showInfo("Success", 'You can check your transaction on EVMOS explorer <a href="https://evm.evmos.org/tx/' + txHash + ' ">View on Explorer</a>');
          return {
              success: true,
              status: "Check your transaction on EVM explorer" + txHash
          }
      } catch (error) {
          showInfo("Error",error.message);
          return {
              success: false,
              status: "Something went wrong: " + error.message
          }
      }
      console.log(`Transaction receipt: ${JSON.stringify(txHash)}`);
}

}
async function getAccAddr() {
  var accountAddress = await web3.eth.getAccounts();
  accountAddress = accountAddress[0];
  return accountAddress;
}
function addressDisp(addr) {
  return addr.substr(0,3) + '...' + addr.substr(38,42);
}
function hideInfo() {
  var modal = $("#alertModal");
  modal.modal('hide');
}
function showInfo(type,msg) {
  var modal = $("#alertModal");
  modal.find('.modal-title').html(type);
  modal.find('.modal-body').html(msg);
  modal.modal('show');
  if(type == 'Success') {
    modal.find('.success-symbol').show();
    modal.find('.error-symbol').hide();
    modal.find('.modal-header').attr('style','background:#8aef7f;color:#14ad04');
  } else if(type == 'Error') {
    modal.find('.modal-header').attr('style','background:#f5b4b4;color:#cf1919e8');
    modal.find('.error-symbol').show();
    modal.find('.success-symbol').hide();
  }
}
function showLoader() {
  $("#loader").show();
}
function hideLoader() {
  $("#loader").hide();
}

(function countdown() {
  // Set the date we're counting down to
var countDownDate = new Date("July 25, 2022 18:30:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  var disPlayData = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";
  $(document).find('.days').html(days + '<span>D</span>');
  $(document).find('.hours').html(hours + '<span>H</span>');
  $(document).find('.minutes').html(minutes + '<span>M</span>');
  $(document).find('.seconds').html(seconds + '<span>S</span>');
  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    disPlayData = "MINT IS LIVE";
    $(document).find('.mint_live_circle_sect').show();
    $(document).find('.buthu_mint1_body_right_timer').remove();
  }
}, 1000);
})();

$(document).on('click', "#connect-wallet-home" ,async () => {
    await App.connectMetaMask();
});
$(document).on('click', "#connect-keplr-home" ,async () => {
    await App.connectKeplr();
});
$(document).on('click', "#check-whitelist" ,async () => {
    await App.checkWhiteList();
});
$(document).on('click',"#mint-now-count", async () => {
    await App.mintNFTS();
});

$(document).on('click',".counter.up", async () => {
    await App.mintNFTS();
});

$(document).on('click',"#add-to-whitelist", async () => {
    var users = [];
    if(users.length){
      await App.addToWhiteList(users);
    } else {
      alert("No users");
    }
});

var x = 0, max = 5;
$(document).on('click',"#count-up", async () => {
    // increment & set new value 
    x = $('#mint-now-count').val();
    if(x < max) {
      $('#mint-now-count').val( ++x );
      await App.changePrice();
    }
});
$(document).on('click',"#count-down", async () => {
    // decrement & set new value 
    x = $('#mint-now-count').val();
    if(x > 1) {
      $('#mint-now-count').val( --x );
      await App.changePrice();
    }
});
$(document).on('click',"#go-to-dashboard", async () => {
    // decrement & set new value 
    var accountAddress = await web3.eth.getAccounts();
    if(accountAddress.length == 0) {
      showInfo("Error","Wallet is not connected");
      return false;
    }
    window.location.href = "/dashboard";
});

$(document).on('ready',async () => {
  await App.init(); 
});

