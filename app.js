// التخزين المحلي تحت مفتاح "أبو ناصر ماركت"
const STORAGE_KEY = 'abu_nasser_market_customers';
let customers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentCustomerId = null;

// عناصر DOM
const addCustomerForm = document.getElementById('addCustomerForm');
const customersList = document.getElementById('customersList');
const connectionStatus = document.getElementById('connectionStatus');
const transactionModal = document.getElementById('transactionModal');
const closeModal = document.getElementById('closeModal');
const addTransactionForm = document.getElementById('addTransactionForm');

// مراقبة الاتصال بالإنترنت
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    if (navigator.onLine) {
        connectionStatus.textContent = '📡 متصل بالإنترنت';
        connectionStatus.className = 'badge online';
    } else {
        connectionStatus.textContent = '⚡ يعمل بدون إنترنت (أوفلاين)';
        connectionStatus.className = 'badge offline';
    }
}

// حفظ البيانات
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    renderCustomers(customers);
}

// إضافة زبون جديد
addCustomerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();

    if (name) {
        const newCustomer = {
            id: Date.now(),
            name: name,
            phone: phone,
            transactions: []
        };
        customers.push(newCustomer);
        saveData();
        addCustomerForm.reset();
    }
});

// عرض الزبائن
function renderCustomers(listToRender) {
    customersList.innerHTML = '';
    
    if (listToRender.length === 0) {
        customersList.innerHTML = '<p style="text-align:center; color:#64748b; padding:1rem;">لا يوجد زبائن مطابقين للبحث.</p>';
        return;
    }

    listToRender.forEach(customer => {
        const balance = calculateBalance(customer.transactions);
        const item = document.createElement('div');
        item.className = 'customer-item';
        item.innerHTML = `
            <div>
                <strong>👤 ${customer.name}</strong>
                <br><small style="color:#64748b;">📱 ${customer.phone || 'بدون رقم'}</small>
            </div>
            <div>
                <span class="balance ${balance > 0 ? 'positive' : 'negative'}">
                    ${balance > 0 ? 'عليه: ' + balance : 'له: ' + Math.abs(balance)} شيكل
                </span>
            </div>
        `;
        item.addEventListener('click', () => openCustomerModal(customer.id));
        customersList.appendChild(item);
    });
}

// بحث عن زبون
function searchCustomers() {
    const query = document.getElementById('searchCustomer').value.toLowerCase();
    const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(query) || c.phone.includes(query)
    );
    renderCustomers(filtered);
}

// حساب المجموع
function calculateBalance(transactions) {
    return transactions.reduce((acc, t) => {
        return t.type === 'debit' ? acc + t.amount : acc - t.amount;
    }, 0);
}

// فتح كشف حساب
function openCustomerModal(id) {
    currentCustomerId = id;
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    document.getElementById('modalCustomerName').textContent = `كشف حساب: ${customer.name}`;
    renderTransactions(customer);
    transactionModal.style.display = 'flex';
}

// إغلاق النافذة
closeModal.addEventListener('click', () => {
    transactionModal.style.display = 'none';
});

// إضافة معاملة (طلبية / دفعة)
addTransactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('transType').value;
    const amount = parseFloat(document.getElementById('transAmount').value);
    const note = document.getElementById('transNote').value.trim();

    const customer = customers.find(c => c.id === currentCustomerId);
    if (customer && amount) {
        customer.transactions.push({
            id: Date.now(),
            date: new Date().toLocaleDateString('ar-EG'),
            type: type,
            amount: amount,
            note: note || '-'
        });
        saveData();
        renderTransactions(customer);
        addTransactionForm.reset();
    }
});

// عرض المعاملات
function renderTransactions(customer) {
    const tbody = document.getElementById('transactionsTableBody');
    const balanceEl = document.getElementById('modalCustomerBalance');
    tbody.innerHTML = '';

    const total = calculateBalance(customer.transactions);
    balanceEl.textContent = total;

    customer.transactions.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.date}</td>
            <td>${t.type === 'debit' ? '🛒 طلبية (عليه)' : '💵 دفعة (له)'}</td>
            <td style="color: ${t.type === 'debit' ? '#dc2626' : '#16a34a'}; font-weight:bold;">${t.amount} شيكل</td>
            <td>${t.note}</td>
        `;
        tbody.appendChild(tr);
    });
}

// التشغيل الابتدائي
updateOnlineStatus();
renderCustomers(customers);
