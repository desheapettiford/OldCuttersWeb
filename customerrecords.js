// global variables
let selectedRow = null;

function onFormSubmit() {
    let formData = readFormData();
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
            fetch('/ReceiveNewClientInformation', options);
        }
    } else {
        if (confirm("Are you sure you want to edit this record?:")) {
            updateRecord(formData);
        }
    }
    resetForm();
}

function readFormData() {
    let formData = {};
    formData["fullname"]           = document.getElementById("fullname").value;
    formData["address"]            = document.getElementById("address").value;
    formData["phonenumber"]        = document.getElementById("phonenumber").value;
    formData["cutamount"]          = parseInt(document.getElementById("cutamount").value);
    formData["preferredcutday"]    = document.getElementById("preferredcutday").value;
    formData["totaltipamount"]     = 0;
    formData["moneyowed"]          = parseInt(document.getElementById('moneyowed').value);
    formData["specialinformation"] = document.getElementById("specialinformation").value;
    return formData;
}

function insertNewRecord(data) {
   let table = document.getElementById('customerlist').getElementsByTagName('tbody')[0]; 
   let row = table.insertRow(table.length);

   cell1 = row.insertCell(0);
   cell1.innerHTML = data.fullname;
   cell2 = row.insertCell(1);
   cell2.innerHTML = data.address;
   cell3 = row.insertCell(2);
   cell3.innerHTML = data.phonenumber;
   cell4 = row.insertCell(3);
   cell4.innerHTML = '$' + data.cutamount;
   cell5 = row.insertCell(4);
   cell5.innerHTML = data.preferredcutday;
   cell6 = row.insertCell(5);
   cell6.innerHTML = '$' + 0;
   cell7 = row.insertCell(6)
   cell7.innerHTML = '$' + data.moneyowed;
   cell8 = row.insertCell(7);
   cell8.innerHTML = data.specialinformation;
   cell9 = row.insertCell(8);
   cell9.innerHTML = `<a onClick="editClientRecord(this)">Edit</a>
                      <a onClick="deleteClientRecord(this)">Delete</a>`;
}

function editClientRecord(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById('fullname').value           = selectedRow.cells[0].innerHTML;
    document.getElementById('address').value            = selectedRow.cells[1].innerHTML;
    document.getElementById('phonenumber').value        = selectedRow.cells[2].innerHTML;
    document.getElementById('cutamount').value          = selectedRow.cells[3].innerHTML;
    document.getElementById('preferredcutday').value    = selectedRow.cells[4].innerHTML;
    document.getElementById('moneyowed').value          = selectedRow.cells[5].innerHTML;
    document.getElementById('specialinformation').value = selectedRow.cells[6].innerHTML;
}

function resetForm() {
    document.getElementById('fullname').value           = '';
    document.getElementById('address').value            = '';
    document.getElementById('phonenumber').value        = '';
    document.getElementById('cutamount').value          = '';
    document.getElementById('preferredcutday').value    = '';
    document.getElementById('moneyowed').value          = '';
    document.getElementById('specialinformation').value = '';
    selectedRow=null;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.fullname;
    selectedRow.cells[1].innerHTML = formData.address;
    selectedRow.cells[2].innerHTML = formData.phonenumber;
    selectedRow.cells[3].innerHTML = formData.cutamount;
    selectedRow.cells[4].innerHTML = formData.preferredcutday;
    selectedRow.cells[5].innerHTML = formData.moneyowed;
    selectedRow.cells[6].innerHTML = formData.specialinformation;
}

function deleteClientRecord(td) {
    row = td.parentElement.parentElement;
    let name = document.getElementById('customerlist').rows[row.rowIndex].cells[0].innerText;
    if (confirm(`Are you sure you want to delete ${name}'s record from the database?:`)) {
        document.getElementById('customerlist').deleteRow(row.rowIndex);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name})
        }
        fetch('/DeleteClientRecord', options);
        resetForm();
    }
}

// loading data
let numberRecords = 0;
async function loadClientRecords() {
    const response = await fetch('/RetrieveClientInformation');
    const data = await response.json();

    console.log("ran");

    for (let i = 0; i < data.length; i++) {
        numberRecords++;
        insertNewRecord(data[i])
        console.log("test");
    }

    console.log(numberRecords);
}
loadClientRecords()
