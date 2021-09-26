function onPaymentFormSubmit() {
    const formData = {};

    formData["fullname"]   = document.getElementById('paymentfullname').value;
    formData["address"]    = document.getElementById('paymentaddress').value;
    formData["amount"]     = parseInt(document.getElementById('paymentamount').value);
    formData["date"]       = document.getElementById('paymentdate').value;

    if (confirm('Are you sure you want to add this record to the database?')) {
        const options = {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json'
               },
            body: JSON.stringify(formData)
        }

        async function getCustomerData() {
            const response = await fetch('/AddCustomerPaymentRecord', options);
            const data     = await response.json();
            insertNewPaymentRecord(data);
        }
        getCustomerData();
    }
    paymentResetForm();
}

function onTipFormSubmit() {
    const formData = {};

    formData["fullname"]   = document.getElementById('tipfullname').value;
    formData["address"]    = document.getElementById('tipaddress').value;
    formData["amount"]     = parseInt(document.getElementById('tipamount').value);
    formData["date"]       = document.getElementById('tipdate').value;

    if (confirm('Are you sure you want to add this record to the database?')) {
        const options = {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json'
               },
            body: JSON.stringify(formData)
        }
        async function getCustomerData() {
            const response = await fetch('/AddCustomerTipRecord', options);
            const data     = await response.json();
            insertNewTipRecord(data);
        }
        getCustomerData();
    }
    tipResetForm();
}

function tipResetForm() {
    document.getElementById('tipfullname').value = '';
    document.getElementById('tipaddress').value  = '';
    document.getElementById('tipamount').value   = '';
    document.getElementById('tipdate').value     = '';
}

function paymentResetForm() {
    document.getElementById('paymentfullname').value = '';
    document.getElementById('paymentaddress').value  = '';
    document.getElementById('paymentamount').value   = '';
    document.getElementById('paymentdate').value     = '';
}

function insertNewPaymentRecord(data) {
    let table = document.getElementById('paymentrecordlist').getElementsByTagName('tbody')[0];
    let row   = table.insertRow(table.length);

    cell1 = row.insertCell(0);
    cell1.innerHTML = data.fullname;
    cell2 = row.insertCell(1);
    cell2.innerHTML = data.address;
    cell3 = row.insertCell(2);
    cell3.innerHTML = data.date;
    cell4 = row.insertCell(3);
    cell4.innerHTML = '$' + data.amount;
    cell5 = row.insertCell(4);
    cell5.innerHTML = '$' + data.oldbalance;
    cell6 = row.insertCell(5);
    cell6.innerHTML = '$' + data.newbalance;
    cell7 = row.insertCell(6);
    cell7.innerHTML = data.databaseeffected;
}

function insertNewTipRecord(data) {
    let table = document.getElementById('tiprecordlist').getElementsByTagName('tbody')[0];
    let row   = table.insertRow(table.length);

    console.log(data);

    cell1 = row.insertCell(0);
    cell1.innerHTML = data.fullname;
    cell2 = row.insertCell(1);
    cell2.innerHTML = data.address;
    cell3 = row.insertCell(2);
    cell3.innerHTML = data.date;
    cell4 = row.insertCell(3);
    cell4.innerHTML = '$' + data.amount;
    cell5 = row.insertCell(4);
    cell5.innerHTML = '$' + data.totaltipamount;
    cell6 = row.insertCell(5);
    cell6.innerHTML = data.databaseeffected;
}

// loading data
async function loadClientPaymentRecords() {
    const response = await fetch('/RetrieveFinancialRecords');
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
        insertNewPaymentRecord(data[i])
    }
}
loadClientPaymentRecords()

async function loadClientTipRecords() {
    const response = await fetch('/RetrieveTipRecords');
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
        insertNewTipRecord(data[i])
    }
}
loadClientTipRecords()