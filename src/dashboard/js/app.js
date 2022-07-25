$(document).ready(function () {
  // nav item list
      $(".right_panel").hide();
      $(".middle_area,.cards_area").show();
  $('.refreshers').click(function() {
    window.location.reload();
  });
  $(".nav_link").click(function (e) {
    $(".nav_link").removeClass("active_nav_link");
    var el = $(this);
    el.addClass("active_nav_link");
    $(".right_panel").hide();

    // if target item load different data
    if (el.hasClass('nft_li')) {
      $(".nft_img_collection").show();
      // $(window).resize(function () {
      //   $(".middle_area").show();
      // });
    } else if (el.hasClass('dash_li')) {
      $(".right_panel").hide();
      $(".middle_area,.cards_area").show();
      
      $(window).resize(function () {
        if ($(window).width() <= 861) {
          $(".middle_area").hide();
        } else {
          $(".middle_area").show();
        }
      });
    } else if (el.hasClass('play_li')) {
      $(".play_collection").show();
      // $(window).resize(function () {
      //   $(".middle_area").hide();
      // });
    } else if (el.hasClass('pool_li')) {
      $(".price_pool").show();      
      // $(window).resize(function () {
      //   $(".middle_area").hide();
      // });
    } else if(el.hasClass('htp_li')) {
      $(".how_to_play").show();  
    }
  });
});

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

      var dp = await $.getJSON("/TheUnimpressedCheetah.json");
      console.log("balanceOf", App.web3Provider);
        // Instantiate a new contract from the artifact
      App.contracts.TheUnimpressedCheetah = new web3.eth.Contract(dp.abi, App.contractAddress);
      // Connect provider to interact with contract
      App.contracts.TheUnimpressedCheetah.setProvider(App.web3Provider);
      // await App.render();
      await App.render();
  },
 showMintedNFTs: async () => {

   var accountAddress = await web3.eth.getAccounts();
   if(accountAddress.length == 0) {
      alert("Wallet is not connected");
      return false;
   }
   accountAddress = accountAddress[0];
   var instance = await App.contracts.TheUnimpressedCheetah;
   var balance = await instance.methods.balanceOf(accountAddress).call();
   balance = parseInt(balance);
   var tokenURIArr = [];
   $(document).find('.nft_img_list').empty();
   for(let i = 0; i < balance; i++) {
     $(document).find('.nft_img_list').append('<div class="img_test _img_frame"><img src= "'+ window.location.origin +'/assets/images/nft/about_us_img1.png" alt="" width="303" height="303"/></div>');
     let tokenId = await instance.methods.tokenOfOwnerByIndex(accountAddress,i).call();
     let tokenURI = await instance.methods.tokenURI(tokenId).call();
     tokenURIArr.push(tokenURI);
     let metaUrl = 'https://ipfs.io/ipfs/' + tokenURI.substr(7,);
     console.log("file:",tokenURI);
     let fileJson = await $.getJSON(metaUrl);
     console.log("file:",fileJson);

     //to uncomment let url = 'https://ipfs.io/ipfs/' + fileJson.image.substr(7,);

     //to uncomment var a = '<div class="img_frame hidden nft_images"><div class="card" style="width: 18rem;">\
     //           <img class="card-img-top" src="'+ url +'" alt="'+ fileJson.name +'" />\
     //           <div class="card-body">\
     //              <h5 class="card-title">'+ fileJson.name +'</h5>\
     //          </div>\
     //        </div></div>';
     var a = '<div class="img_frame hidden nft_images"><div class="card" style="width: 18rem;">\
               <img class="card-img-top" src="'+ window.location.origin +'/assets/images/nft/about_us_img1.png" alt="'+ fileJson.name +'" width="303" height="303"/>\
               <div class="card-body">\
                  <h5 class="card-title">'+ fileJson.name +'</h5>\
              </div>\
            </div></div>';
   $(document).find('.nft_img_list').append(a);
   }
   console.log("All NFTS",tokenURIArr);
   
   setTimeout(function() {
      $(document).find('.nft_img_list').find('.img_test').remove();
      $(document).find('.nft_img_list').find('.nft_images').removeClass('hidden');
   }, 5000);
 },
 render: async () =>  {
    try {
      // Load account data
      var instance = await App.contracts.TheUnimpressedCheetah;
      var totalMinted = await instance.methods.totalSupply().call();
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
    } catch(error) {
      console.log("Error in Render",error);
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
  // await addNetwork();
  if (window.ethereum) {
     window.web3 = new Web3(window.ethereum);
     try {
       await window.ethereum.request({method: 'eth_requestAccounts'});
       var accAddr = await getAccAddr();
       $(".connect_btn_txt").html(addressDisp(accAddr));
       alert("Wallet Connected");
       return true;
      } catch(e) {
         console.log("Access denied",e);
         return false;
      }
  }
  // Non-DApp Browsers
  else {
      alert('You have to install MetaMask !');
  }
}

}

$(document).on('ready',async () => {
  await App.init();
  await App.showMintedNFTs();
  // $("#connect-wallet-home").click(async () => {
  //   alert('Minting has not started yet...');
  // });
});

$(document).on('click', '.connect_btn', async () => {
 await App.connectMetaMask();
});
function addressDisp(addr) {
  return addr.substr(0,3) + '...' + addr.substr(38,42);
}

async function getAccAddr() {
  var accountAddress = await web3.eth.getAccounts();
  accountAddress = accountAddress[0];
  return accountAddress;
}