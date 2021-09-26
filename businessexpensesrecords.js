function onFormSubmit() {
    const formData = {};

    formData["description"]   = document.getElementById('description').value;
    formData["amountpaid"]    = document.getElementById('amountpaid').value;
    formData["date"]          = document.getElementById('date').value;
    formData["loggedtime"]    = Date.now();


    if (selectedRow == null) {
        if (confirm("Are you sure you want to add this record to the database?:")) {
            insertNewRecord(formData);

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }
            fetch('/RetrieveBusinessExpensesRecords', options);
        }
    } else {
        if (confirm("Are you sure you want to edit this record?:")) {
            updateRecord(formData);
        }
    }
    resetForm();
}

function resetForm() {
    document.getElementById('description').value = '';
    document.getElementById('amountpaid').value  = '';
    document.getElementById('date').value        = '';
}

function insertNewRecord(data) {
    let table = document.getElementById('recordlist').getElementsByTagName('tbody')[0];
    let row = table.insertRow(table.length);

    cell1 = row.insertCell(0);
    cell1.innerHTML = data.description;
    cell2 = row.insertCell(1);
    cell2.innerHTML = data.amountpaid;
    cell3 = row.insertCell(2);
    cell3.innerHTML = data.date;

    cell4 = row.insertCell(3);
    cell4.innerHTML = "";


    cell5 = row.insertCell(4);
    cell5.innerHTML = data.loggedtime;
}

// loading data
async function loadClientRecords() {
    const response = await fetch('/RetrieveBusinessExpensesRecords');
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
        insertNewRecord(data[i])
    }
}
loadClientRecords()