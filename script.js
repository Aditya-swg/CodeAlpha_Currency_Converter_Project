// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    const dropList = document.querySelectorAll(".drop-list select");
    const fromCurrency = document.querySelector(".from select");
    const toCurrency = document.querySelector(".to select");
    const getButton = document.querySelector("form button");
    const exchangeIcon = document.querySelector("form .icon");

    // Sample country_list object (make sure you include this properly in your JS)
    const country_list = {
        "USD": "US",
        "NPR": "NP",
        "INR": "IN",
        "EUR": "EU",
        "GBP": "GB",
        "JPY": "JP",
        "AUD": "AU"
        // Add more if needed
    };

    // Populate currency select options
    dropList.forEach((select, i) => {
        for (let currency_code in country_list) {
            let selected = i === 0 ? (currency_code === "USD" ? "selected" : "") : (currency_code === "NPR" ? "selected" : "");
            let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
            select.insertAdjacentHTML("beforeend", optionTag);
        }
        select.addEventListener("change", e => loadFlag(e.target));
    });

    function loadFlag(element) {
        for (let code in country_list) {
            if (code === element.value) {
                let imgTag = element.parentElement.querySelector("img");
                imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
            }
        }
    }

    window.addEventListener("load", () => {
        getExchangeRate();
    });

    getButton.addEventListener("click", e => {
        e.preventDefault();
        getExchangeRate();
    });

    exchangeIcon.addEventListener("click", () => {
        let tempCode = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = tempCode;
        loadFlag(fromCurrency);
        loadFlag(toCurrency);
        getExchangeRate();
    });

    function getExchangeRate() {
        const amount = document.querySelector("form input");
        const exchangeRateTxt = document.querySelector("form .exchange-rate");
        let amountVal = amount.value;

        if (amountVal === "" || amountVal === "0") {
            amount.value = "1";
            amountVal = 1;
        }

        exchangeRateTxt.innerText = "Getting exchange rate...";

        const apiKey = "`https://v6.exchangerate-api.com/v6/37a7a46a42f0a4b8ca8c1760/latest/USD`"; // Replace with your actual API key
        const url = `https://v6.exchangerate-api.com/v6/37a7a46a42f0a4b8ca8c1760/latest/${fromCurrency.value}`;

        fetch(url)
            .then(response => response.json())
            .then(result => {
                if (result.result === "success") {
                    let exchangeRate = result.conversion_rates[toCurrency.value];
                    let totalExRate = (amountVal * exchangeRate).toFixed(2);
                    exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
                } else {
                    exchangeRateTxt.innerText = "Invalid currency or API error.";
                }
            })
            .catch(() => {
                exchangeRateTxt.innerText = "Something went wrong.";
            });
    }
});
