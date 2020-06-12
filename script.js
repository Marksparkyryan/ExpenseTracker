
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const message = document.getElementById('message');
const notice = document.getElementById('noTransactions');


const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
    );

let transactions = localStorage.getItem('transactions') !== null ?
    localStorageTransactions : [];

// Message
function showMessage(m) {
    message.innerHTML = `
        <p><i class="fas fa-info-circle"></i> ${m}</p>
    `
    console.log('in message')
    message.classList.add('show');
    setTimeout(function() {
        message.classList.remove('show');
    }, 5000)
}


// Add transaction
function addTransaction(e) {
    e.preventDefault()

    if (text.value.trim() === '' || amount.value.trim() === '') {
        showMessage('Please add text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
    }
}

// Generate random ID (Don't use this in production!)
function generateID() {
    return Math.floor(Math.random() * 1000000000)
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    //Get sign
    const sign = transaction.amount < 0 ? '-' : '+';
    
    const item = document.createElement('li');

    //Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text}
        <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
        <i class="far fa-trash-alt fa-xs"></i>
        </button>
    `;

    list.appendChild(item)
} 

// Update balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount)

    const total = amounts.reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = ( 
        amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText  = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;

    if (transactions.length > 0) {
        notice.style.display = 'none';
    } else {
        notice.style.display = 'block';
    }
}

// Remove transaction by id
function removeTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );
    updateLocalStorage();
    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init()

// Event Listeners
form.addEventListener('submit', addTransaction);
