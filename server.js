// getting datastores
const datastore = require('nedb');
const customerRecordsdb = new datastore('CustomerRecords.db');
customerRecordsdb.loadDatabase();
const customerPaymentRecordsdb = new datastore("CustomerPaymentRecords.db")
customerPaymentRecordsdb.loadDatabase();
const customerTipRecordsdb = new datastore("CustomerTipRecords.db")
customerTipRecordsdb.loadDatabase();
const businessExpensesRecordsdb = new datastore("BusinessExpensesRecords.db")
businessExpensesRecordsdb.loadDatabase();

// importing express
const express = require('express');
const application = express();
application.listen(3000, () => console.log("Listening at 3000"));
application.use(express.static('public'));
application.use(express.json( {limit: '1mb'} ));

// CUSTOMER RECORDS FUNCTIONS
application.get('/RetrieveClientInformation', (request, response) => {
    customerRecordsdb.find({}, (error, data) => {
        if (error) {
            response.end();
            return;
        }
        response.json(data);
    })
})

application.post('/ReceiveNewClientInformation', (request, response) => {
    const data = request.body;
    customerRecordsdb.insert(data);
    response.json("Successfully added a new customer, get money!");
})

application.post('/DeleteClientRecord', (request, response) => {
    const data = request.body;
    customerRecordsdb.remove({fullname:data.name}, {}, (err, numRemoved) => {
        if (err) {
            console.log(err);
        }
    })
    response.json("Deleted a customer record...") 
})

// CUSTOMER FINANCIAL RECORD FUNCTIONS
application.get('/RetrieveFinancialRecords', (request, response) => {
    customerPaymentRecordsdb.find({}, (error, data) => {
        if (error) {
            response.end();
            return;
        }
        response.json(data);
    })
})

application.get('/RetrieveTipRecords', (request, response) => {
    customerTipRecordsdb.find({}, (error, data) => {
        if (error) {
            response.end();
            return;
        }
        response.json(data);
    })
})

application.post('/AddCustomerPaymentRecord', (request, response) => {
    const data = request.body;
    customerRecordsdb.find({ $or: [{ fullname: data.fullname }, { address: data.address }] }, (error, docs) => {
        let found = true;
        if (typeof docs !== 'undefined' && docs.length === 0) {
            found = false;
        }

        if (found) {
            let oldBalance = docs[0].moneyowed;
            data["oldbalance"] = oldBalance;
            let newBalance = oldBalance -= data.amount;
            data["newbalance"]       = newBalance;
            data["fullname"]         = docs[0].fullname;
            data["address"]          = docs[0].address;
            data["databaseeffected"] = "✔️";

        } else {
            data["databaseeffected"] = "❌";
            data["oldbalance"]       = "N/A";
            data["newbalance"]       = "N/A";
        }
        customerPaymentRecordsdb.insert(data);
        response.json(data);
    })
})

application.post('/AddCustomerTipRecord', (request, response) => {
    const data = request.body;
    customerRecordsdb.find({ $or: [{ fullname: data.fullname }, { address: data.address }] }, (error, docs) => {
        let found = true;
        if (typeof docs !== 'undefined' && docs.length === 0) {
            found = false;
        }

        if (found) {
            data["fullname"]         = docs[0].fullname;
            data["address"]          = docs[0].address;
            data["databaseeffected"] = "✔️";
            data["tipamount"]        = data.tipamount;
            data["totaltipamount"]   = docs[0].totaltipamount + data.tipamount;
        } else {
            data["totaltipamount"]   = "N/A";
            data["databaseeffected"] = "❌";
        }
        customerTipRecordsdb.insert(data);
        response.json(data);
    })
})

// BUSINESS EXPENSES RECORD FUNCTIONS
application.get('/RetrieveBusinessExpensesRecords', (request, response) => {
    businessExpensesRecordsdb.find({}, (error, data) => {
        if (error) {
            response.end();
            return;
        }
        response.json(data);
    })
})

application.post('/AddBusinessExpenseRecord', (request, response) => {
    const data = request.body;
    businessExpensesRecordsdb.insert(data);
    response.json("Successfully added a new business expense record!");
})