"use strict";

const _pin = new WeakMap();
class Account {
  #movement = [];
  constructor(user, pin) {
    this.user = user;
    _pin.set(this, pin);
  }

  deposit(val) {
    this.#movement.push(val);
  }

  withdraw(val) {
    this.deposit(-val);
  }

  saving() {
    return this.#movement.reduce((accumulater, current) => {
      return accumulater + current;
    }, 0);
  }
}

let account;

document
  .getElementById("createAccountButton")
  .addEventListener("click", function () {
    const accountNameInput = document.getElementById("userInput");
    const pinInput = document.getElementById("pinInput");

    const accountName = accountNameInput.value;
    const pin = pinInput.value;

    if (!accountName || !pin) {
      alert("Please put pin and name together!");
      return;
    }

    if (pin === "") {
      alert("Pin is empty!");
      return;
    }
    if (accountName === "") {
      alert("Name is empty!");
      return;
    }

    const pinAsNumber = Number(pin);
    if (isNaN(pinAsNumber)) {
      alert("Pin is not a number!");
      return;
    }
    if (typeof accountName !== "string") {
      alert("Name should be a string!");
      return;
    }

    account = new Account(accountName, pin);
    document.getElementById("userName").textContent = account.user;
    document.getElementById("userSaving").textContent = "0";
    accountNameInput.value = "";
    pinInput.value = "";
  });

document.getElementById("depositButton").addEventListener("click", function () {
  const depositAmountInput = document.getElementById("depositInput");
  const depositAmount = parseInt(depositAmountInput.value, 10);

  if (isNaN(depositAmount) || depositAmount <= 0) {
    alert("Please enter a valid deposit amount!");
    return;
  }
  if (!account) {
    alert("There is no account! Create an account!");
    return;
  }

  account.deposit(depositAmount);
  depositAmountInput.value = "";
  let currentSaving = account.saving();
  document.getElementById("userSaving").textContent = currentSaving.toString();
});

document
  .getElementById("withdrawButton")
  .addEventListener("click", function () {
    const withdrawAmountInput = document.getElementById("withdrawInput");
    const withdrawAmount = parseInt(withdrawAmountInput.value, 10);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert("Please enter a valid withdraw amount!");
      return;
    }
    if (!account) {
      alert("There is no account! Create an account!");
      return;
    }

    account.withdraw(withdrawAmount);
    withdrawAmountInput.value = "";
    let currentSaving = account.saving();
    document.getElementById("userSaving").textContent =
      currentSaving.toString();
  });
