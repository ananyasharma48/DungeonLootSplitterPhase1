 const loot = [];

const partyInput = document.getElementById("party-size");
const nameInput = document.getElementById("loot-name");
const valueInput = document.getElementById("loot-value");
const addMessage = document.getElementById("add-message");
const splitMessage = document.getElementById("split-message");
const memberShare = document.getElementById("member-share");

let splitActive = false;

function formatMoney(cents) {
    return "$" + (cents / 100).toFixed(2);
}

function calculateTotal() {
    let total = 0;

    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value;
    }

    return total;
}

function renderLoot() {
    const list = document.getElementById("loot-list");
    list.replaceChildren();

    for (let i = 0; i < loot.length; i++) {
        const item = document.createElement("li");
        item.textContent = loot[i].name + " — " + formatMoney(loot[i].value);
        list.appendChild(item);
    }

    document.getElementById("empty-message").hidden = loot.length > 0;

    // Both displays use the same total calculated from the array.
    const total = formatMoney(calculateTotal());
    document.getElementById("list-total").textContent = total;
    document.getElementById("split-total").textContent = total;
}

function addLoot() {
    const name = nameInput.value.trim();
    const value = valueInput.valueAsNumber;

    if (name === "") {
        addMessage.textContent = "Enter a name for the loot item.";
        nameInput.focus();
        return;
    }

    if (!Number.isFinite(value)) {
        addMessage.textContent = "Enter a number for the loot value.";
        valueInput.focus();
        return;
    }

    if (value < 0) {
        addMessage.textContent = "Loot value must be zero or greater.";
        valueInput.focus();
        return;
    }

    if (valueInput.validity.stepMismatch) {
        addMessage.textContent = "Use no more than two decimal places.";
        valueInput.focus();
        return;
    }

    // Store whole cents so values such as 0.10 and 0.20 add up exactly.
    const cents = Math.round(value * 100);
    if (!Number.isSafeInteger(calculateTotal() + cents)) {
        addMessage.textContent = "This value is too large to total accurately.";
        valueInput.focus();
        return;
    }

    loot.push({ name: name, value: cents });
    renderLoot();

    addMessage.textContent = name + " added to the loot list.";
    nameInput.value = "";
    valueInput.value = "";
    nameInput.focus();

    if (splitActive) {
        splitLoot();
    } else {
        splitMessage.textContent = "";
    }
}

function splitLoot() {
    const partySize = partyInput.valueAsNumber;

    if (!Number.isSafeInteger(partySize) || partySize < 1) {
        splitMessage.textContent = "Enter a whole number of party members, at least 1.";
        partyInput.focus();
        return;
    }

    if (loot.length === 0) {
        splitMessage.textContent = "Add at least one loot item before splitting.";
        return;
    }

    const shareInCents = Math.round(calculateTotal() / partySize);
    memberShare.textContent = formatMoney(shareInCents);
    splitMessage.textContent = "Each member's share is " +
        formatMoney(shareInCents) + ", rounded to the nearest cent.";

    splitActive = true;
}

document.getElementById("add-button").addEventListener("click", addLoot);
document.getElementById("split-button").addEventListener("click", splitLoot);

// A share calculated for the old party size no longer applies.
partyInput.addEventListener("input", function () {
    splitActive = false;
    memberShare.textContent = "—";
    splitMessage.textContent = "";
});