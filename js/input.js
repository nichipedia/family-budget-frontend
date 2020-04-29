let getRecentTransactions = () => {
    let date = new Date();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    if (month < 10) {
        month = `0${month}`;
    }
    let baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${baseUrl}/family-budget/rest/receipt/${month}/${year}`,
            method: 'GET',
            success: (resp) => {
                resolve(resp);
            },
            error: (err) => {
                reject(err);
            }
        });
    });
}

let deleteReceipt = (id) => {
    let baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${baseUrl}/family-budget/rest/receipt/${id}`,
            method: 'DELETE',
            success: (resp) => {
                resolve(resp);
            },
            error: (err) => {
                reject(err);
            }
        });
    });
};

let submitReceipt = () => {
    console.log('Submitting Receipt');
    postReceipt()
    .then(resp => {
        console.log(resp);
        let form = document.getElementById('receiptForm');
        form.reset();
        updateRecentReceipts();
    })
    .catch(err => {
        console.error(err);
    });
};

let postReceipt = () => {
    return new Promise((resolve, reject) => {
        let date = new Date();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let valid = true;
        if (month < 10) {
            month = `0${month}`;
        }
        let inputs = $('form').serializeArray();
        if (!inputs[0]) {
            valid = false;
            let typeFeedback = document.getElementById('typeFeedback');
            typeFeedback.innerHTML = 'Please Select a Type';
            let typeSelector = document.getElementById('receiptTypeSelect');
            typeSelector.classList.add('is-invalid');
        }
        if (inputs[1] == undefined || inputs[1]['value'].length == 0) {
            valid = false;
            let companyFeedback = document.getElementById('companyFeedback');
            companyFeedback.innerHTML = 'Company cannot be empty :<';
            let companyField = document.getElementById('companyInput');
            companyField.classList.add('is-invalid');
        } else if (inputs[1]['value'].length > 60) {
            valid = false;
            let companyFeedback = document.getElementById('companyFeedback');
            companyFeedback.innerHTML = 'Company name is to long!';
            let companyField = document.getElementById('companyInput');
            companyField.classList.add('is-invalid');
        }
        if (inputs[2] == undefined || inputs[2]['value'].length == 0) {
            valid = false;
            let descriptionFeedback = document.getElementById('descriptionFeedback');
            descriptionFeedback.innerHTML = 'Description cannot be empty :<';
            let descriptionField = document.getElementById('descriptionInput');
            descriptionField.classList.add('is-invalid');
        } else if (inputs[2]['value'].length > 255) {
            valid = false;
            let descriptionFeedback = document.getElementById('descriptionFeedback');
            descriptionFeedback.innerHTML = 'Description is to long!';
            let descriptionField = document.getElementById('descriptionInput');
            descriptionField.classList.add('is-invalid');
        }
        if (inputs[3] == undefined || inputs[3]['value'].length == 0) {
            valid = false;
            let amountFeedback = document.getElementById('amountFeedback');
            amountFeedback.innerHTML = 'Amount cannot be 0';
            let amountField = document.getElementById('amountInput');
            amountField.classList.add('is-invalid');
        } else if (isNaN(parseFloat(inputs[3]['value']))) {
            console.log(parseFloat(inputs[3]['value']))
            valid = false;
            let amountFeedback = document.getElementById('amountFeedback');
            amountFeedback.innerHTML = 'Amount must be a number!';
            let amountField = document.getElementById('amountInput');
            amountField.classList.add('is-invalid');
        } 
        if (inputs[4] == undefined || inputs[4]['value'].length == 0) {
            valid = false;
            let amountFeedback = document.getElementById('dateFeedback');
            amountFeedback.innerHTML = 'Please Select a Date';
            let amountField = document.getElementById('datepicker');
            amountField.classList.add('is-invalid'); 
        } else if (inputs[4]['value'].split("/").length != 3) {

        }
        if (valid) {
            let formData = {
                type: inputs[0]['value'],
                company: inputs[1]['value'],
                description: inputs[2]['value'],
                amount: inputs[3]['value'],
                date: inputs[4]['value']
            };
            let companyField = document.getElementById('companyInput');
            companyField.classList.remove('is-invalid');
            let descriptionField = document.getElementById('descriptionInput');
            descriptionField.classList.remove('is-invalid');
            let amountField = document.getElementById('amountInput');
            amountField.classList.remove('is-invalid');
            let day = formData.date.split("/")[1];
            let baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`
            $.ajax({
                url: `${baseUrl}/family-budget/rest/receipt/${month}/${day}/${year}`,
                method: 'POST',
                data: formData, 
                success: (resp) => {
                    resolve(resp);
                },
                error: (err) => {
                    reject(err);
                }
            });
        } else {

        }
    }); 
}

let updateRecentReceipts = () => {
    getRecentTransactions()
    .then((resp) => {
        let receiptTableBody = document.getElementById('recentReceiptTableBody');
        let newReceiptTableBody = document.createElement('tbody');
        newReceiptTableBody.setAttribute('id', 'recentReceiptTableBody');
        let totalSpent = 0;
        resp
        .sort((a, b) => {
            let timeA = new Date(a.date).getTime();
            let timeB = new Date(b.date).getTime();
            return timeB-timeA;
        })
        .forEach(receipt => {
            console.log(receipt);
            let row = document.createElement('tr');
            let company = document.createElement('td');
            let type = document.createElement('td');
            let description = document.createElement('td');
            let amount = document.createElement('td');
            let date = document.createElement('td');
            let deleteCol = document.createElement('td');
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('btn')
            deleteButton.classList.add('btn-danger')
            deleteButton.innerHTML = 'Delete'
            deleteButton.onclick = () => {
                deleteReceipt(receipt.id)
                .then(resp => {
                    console.log(resp);
                    updateRecentReceipts();
                })
                .catch(err => {
                    console.error(err);
                });
            };
            deleteCol.appendChild(deleteButton);
            company.innerHTML = receipt.company;
            type.innerHTML = receipt.type;
            description.innerHTML = receipt.description;
            amount.innerHTML = `$${receipt.amount}`;
            date.innerHTML = receipt.date;
            row.appendChild(type);
            row.appendChild(company);
            row.appendChild(description);
            row.appendChild(amount);
            row.appendChild(date);
            row.appendChild(deleteCol);
            newReceiptTableBody.appendChild(row);
            totalSpent += receipt.amount;
        });
        let parent = receiptTableBody.parentNode;
        parent.replaceChild(newReceiptTableBody, receiptTableBody);
        let totalSpentDiv = document.getElementById('spentDiv');
        totalSpentDiv.innerHTML = `Total Spent: $${Math.round(totalSpent*100)/100}`;
    })
    .catch(err => {
        console.log(err);
        // Do some error stuff here!
    });
}

(() => {
   $( "#datepicker" ).datepicker();
   updateRecentReceipts();
   console.log('Updated the stuff');
})();