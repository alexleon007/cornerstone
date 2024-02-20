class Expenses{
    constructor(){
        this.expenses = [];
        this.ChartExpenses = null;
    }

    create(description, amount, date){
        
        let info = {
            description: description,
            amount: amount,
            date: date
        }
        
        this.expenses.push(info)
    }
    
    read(){
        let records = document.querySelector('#records-list');
        records.innerHTML = ''

        let num = 0;
        this.expenses.forEach((item, index) => {
            num++; 

            const exItem = document.createElement('li');
            exItem.id = `ex-${index}`;
            //taskItem.innerHTML = `${task}`

            const span1 = document.createElement('span');
            span1.classList.add('expense-description');
            span1.innerHTML = item.description;

            const span2 = document.createElement('span');
            span2.classList.add('expense-amount');
            span2.innerHTML = `$${item.amount}`;

            const divButtons = document.createElement('div');
            divButtons.classList.add('actions');

            const updateButton = document.createElement('button')
            updateButton.classList.add('update-button');
            updateButton.innerText = 'Update';
            updateButton.onclick = () => {
                this.updateForm(index);
            }

            const deleteButton = document.createElement('button')
            deleteButton.classList.add('delete-button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => {
                this.delete(index);
            }
            
            exItem.appendChild(span1)
            exItem.appendChild(span2)
            exItem.appendChild(divButtons)
            divButtons.appendChild(updateButton)
            divButtons.appendChild(deleteButton)
            records.appendChild(exItem)
        });

        if(num == 0){
            document.querySelector(".container").classList.add('hidden');
        }else{
            document.querySelector(".container").classList.remove('hidden');
        }

        this.graph();
    }

    graph() {
        var isMobile = {
            Android: function () { return navigator.userAgent.match(/Android/i); },
            iOS: function () { return navigator.userAgent.match(/iPhone|iPod/i); },
            any: function () { return (isMobile.Android() || isMobile.iOS() || isMobile.Windows()); }
        };
        
        var colors = ['#D00000', '#FFBA08', '#3F88C5', '#032B43', '#0cb004', '#ff860d', '#136F63'];
        var colors2 = "#D00000|#FFBA08|#3F88C5|#032B43|#0cb004|#ff860d|#136F63";
    
        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: this.expenses.map(item => {
                        return item.amount;
                    }),
                    backgroundColor: colors
                }],
                labels: this.expenses.map(item => {
                    return item.description
                })
            },
            options: {
                responsive: true,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Expenses'
                },
                tooltips: {
                    callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = ((currentValue/888) * 100);
                
                        var options2 = { style: 'currency', currency: 'USD' };
                        var numberFormat2 = new Intl.NumberFormat('en-US', options2);
                        return numberFormat2.format(currentValue) + " | " + percentage.toFixed(2) + "%";
                    }
                    }
                } 
            }
        };

        if (this.ChartExpenses != null) {
            this.ChartExpenses.destroy();
        }
        var ctx = document.querySelector('canvas').getContext('2d');
        this.ChartExpenses = new Chart(ctx, config);
        this.ChartExpenses.update();
    }

    update(index){

        let description = document.querySelector('#expense-description');
        let amount = document.querySelector('#expense-amount');
        let date = document.querySelector('#expense-date');

        this.expenses[index].description = description.value;
        this.expenses[index].amount = amount.value;
        this.expenses[index].date = date.value;

        this.read();

        
        document.querySelector('.expense-list').classList.remove('hidden');
        document.querySelector('.chart-list').classList.remove('hidden');
        document.querySelector('#create-button').classList.remove('hidden');
        document.querySelector('#update-button').classList.add('hidden');

        description.value = '';
        amount.value = '';
        date.value = '';
    }

    updateForm(index){
        const expenseList = document.querySelector('.expense-list');
        expenseList.classList.add('hidden');
        const chartList = document.querySelector('.chart-list');
        chartList.classList.add('hidden');

        document.querySelector('#expense-description').value = this.expenses[index].description;
        document.querySelector('#expense-amount').value = this.expenses[index].amount;
        document.querySelector('#expense-date').value = this.expenses[index].date;

        document.querySelector('#create-button').classList.add('hidden');

        const updateButton = document.querySelector('#update-button');
        updateButton.classList.remove('hidden');
        updateButton.onclick = () => {
            this.update(index);
        }
    }

    delete(index){
        this.expenses.splice(index, 1)
        this.read();
    }

}

const expense = new Expenses();

document.querySelector('#create-button').addEventListener('click', (e) => {
    
    let description = document.querySelector('#expense-description');
    let amount = document.querySelector('#expense-amount');
    let date = document.querySelector('#expense-date');

    expense.create(description.value, amount.value, date.value);
    expense.read();

    description.value = '';
    amount.value = '';
    date.value = '';
});