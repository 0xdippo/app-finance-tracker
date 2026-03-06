// Finance Tracker Application
class FinanceTracker {
    constructor() {
        this.currentDate = new Date();
        this.monthlyIncome = 1000;
        this.expenses = [];
        this.categories = {
            food: { name: 'Food & Dining', color: '#FF6B6B', budget: 200 },
            housing: { name: 'Housing & Rent', color: '#4ECDC4', budget: 400 },
            transportation: { name: 'Transportation', color: '#45B7D1', budget: 100 },
            entertainment: { name: 'Entertainment', color: '#96CEB4', budget: 50 },
            shopping: { name: 'Shopping', color: '#FFEAA7', budget: 100 },
            utilities: { name: 'Utilities', color: '#DDA0DD', budget: 80 },
            health: { name: 'Health & Wellness', color: '#98D8C8', budget: 70 },
            education: { name: 'Education', color: '#F7DC6F', budget: 0 },
            other: { name: 'Other', color: '#BB8FCE', budget: 0 }
        };
        
        this.categoryChart = null;
        this.budgetChart = null;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.setupCharts();
        this.updateDateInput();
    }
    
    loadData() {
        const savedData = localStorage.getItem('scribbler-finance-data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.expenses = data.expenses || [];
            this.monthlyIncome = data.monthlyIncome || 1000;
            
            // Convert date strings back to Date objects
            this.expenses.forEach(expense => {
                expense.date = new Date(expense.date);
            });
        }
    }
    
    saveData() {
        const data = {
            expenses: this.expenses,
            monthlyIncome: this.monthlyIncome
        };
        localStorage.setItem('scribbler-finance-data', JSON.stringify(data));
    }
    
    setupEventListeners() {
        // Expense form
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });
        
        // Month navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateUI();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateUI();
        });
        
        // Search and filter
        document.getElementById('search-expense').addEventListener('input', () => {
            this.updateExpenseList();
        });
        
        document.getElementById('filter-category').addEventListener('change', () => {
            this.updateExpenseList();
        });
        
        // Export and reset buttons
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('reset-data').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                this.resetData();
            }
        });
    }
    
    updateDateInput() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expense-date').value = today;
        document.getElementById('expense-date').max = today;
    }
    
    addExpense() {
        const name = document.getElementById('expense-name').value.trim();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = new Date(document.getElementById('expense-date').value);
        
        if (!name || isNaN(amount) || amount <= 0 || !category) {
            alert('Please fill in all fields with valid values.');
            return;
        }
        
        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };
        
        this.expenses.push(expense);
        this.saveData();
        this.updateUI();
        
        // Reset form
        document.getElementById('expense-form').reset();
        this.updateDateInput();
        
        // Show success message
        this.showNotification('Expense added successfully!', 'success');
    }
    
    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.saveData();
        this.updateUI();
        this.showNotification('Expense deleted!', 'warning');
    }
    
    getCurrentMonthExpenses() {
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        return this.expenses.filter(expense => {
            return expense.date.getMonth() === currentMonth && 
                   expense.date.getFullYear() === currentYear;
        });
    }
    
    getExpensesByCategory(expenses) {
        const categoryTotals = {};
        
        expenses.forEach(expense => {
            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;
        });
        
        return categoryTotals;
    }
    
    updateUI() {
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[this.currentDate.getMonth()];
        const year = this.currentDate.getFullYear();
        document.getElementById('current-month').textContent = `${monthName} ${year}`;
        
        // Get current month expenses
        const currentExpenses = this.getCurrentMonthExpenses();
        const totalExpenses = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const balance = this.monthlyIncome - totalExpenses;
        
        // Update summary cards
        document.getElementById('income-amount').textContent = `$${this.monthlyIncome.toFixed(2)}`;
        document.getElementById('expenses-amount').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('balance-amount').textContent = `$${balance.toFixed(2)}`;
        
        // Update expense list
        this.updateExpenseList();
        
        // Update charts
        this.updateCharts();
        
        // Update insights
        this.updateInsights(totalExpenses, balance);
    }
    
    updateExpenseList() {
        const expenseList = document.getElementById('expense-list');
        const searchTerm = document.getElementById('search-expense').value.toLowerCase();
        const filterCategory = document.getElementById('filter-category').value;
        
        const currentExpenses = this.getCurrentMonthExpenses();
        const filteredExpenses = currentExpenses.filter(expense => {
            const matchesSearch = expense.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !filterCategory || expense.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
        
        if (filteredExpenses.length === 0) {
            expenseList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>${currentExpenses.length === 0 ? 'No expenses added yet. Add your first expense above!' : 'No expenses match your search.'}</p>
                </div>
            `;
            return;
        }
        
        expenseList.innerHTML = '';
        
        // Sort by date (newest first)
        filteredExpenses.sort((a, b) => b.date - a.date);
        
        filteredExpenses.forEach(expense => {
            const template = document.getElementById('expense-template');
            const clone = template.content.cloneNode(true);
            
            const expenseItem = clone.querySelector('.expense-item');
            expenseItem.dataset.id = expense.id;
            
            clone.querySelector('.expense-name').textContent = expense.name;
            clone.querySelector('.expense-category').textContent = this.categories[expense.category].name;
            clone.querySelector('.expense-date').textContent = expense.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            clone.querySelector('.expense-amount').textContent = `$${expense.amount.toFixed(2)}`;
            
            // Add delete button event
            clone.querySelector('.btn-delete-expense').addEventListener('click', () => {
                this.deleteExpense(expense.id);
            });
            
            expenseList.appendChild(clone);
        });
    }
    
    setupCharts() {
        const categoryCtx = document.getElementById('category-chart').getContext('2d');
        const budgetCtx = document.getElementById('budget-chart').getContext('2d');
        
        // Category chart
        this.categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
        
        // Budget vs Actual chart
        this.budgetChart = new Chart(budgetCtx, {
            type: 'bar',
            data: {
                labels: Object.values(this.categories).map(cat => cat.name),
                datasets: [
                    {
                        label: 'Budget',
                        data: [],
                        backgroundColor: 'rgba(67, 97, 238, 0.7)',
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Actual',
                        data: [],
                        backgroundColor: 'rgba(247, 37, 133, 0.7)',
                        borderColor: 'rgba(247, 37, 133, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
    
    updateCharts() {
        const currentExpenses = this.getCurrentMonthExpenses();
        const categoryTotals = this.getExpensesByCategory(currentExpenses);
        
        // Update category chart
        const categoryLabels = [];
        const categoryData = [];
        const categoryColors = [];
        
        Object.entries(categoryTotals).forEach(([category, total]) => {
            if (total > 0) {
                categoryLabels.push(this.categories[category].name);
                categoryData.push(total);
                categoryColors.push(this.categories[category].color);
            }
        });
        
        if (categoryData.length === 0) {
            categoryLabels.push('No Expenses');
            categoryData.push(1);
            categoryColors.push('#e9ecef');
        }
        
        this.categoryChart.data.labels = categoryLabels;
        this.categoryChart.data.datasets[0].data = categoryData;
        this.categoryChart.data.datasets[0].backgroundColor = categoryColors;
        this.categoryChart.update();
        
        // Update budget vs actual chart
        const budgetData = [];
        const actualData = [];
        
        Object.entries(this.categories).forEach(([category, info]) => {
            budgetData.push(info.budget);
            actualData.push(categoryTotals[category] || 0);
        });
        
        this.budgetChart.data.datasets[0].data = budgetData;
        this.budgetChart.data.datasets[1].data = actualData;
        this.budgetChart.update();
    }
    
    updateInsights(totalExpenses, balance) {
        const budgetPercentage = ((totalExpenses / this.monthlyIncome) * 100).toFixed(1);
        const remainingPercentage = (100 - budgetPercentage).toFixed(1);
        
        // Budget status
        let budgetStatus = '';
        if (budgetPercentage < 50) {
            budgetStatus = `You've used ${budgetPercentage}% of your budget. ${remainingPercentage}% remains.`;
        } else if (budgetPercentage < 80) {
            budgetStatus = `You've used ${budgetPercentage}% of your budget. Keep an eye on spending.`;
        } else if (budgetPercentage < 100) {
            budgetStatus = `You've used ${budgetPercentage}% of your budget. Consider cutting back.`;
        } else {
            budgetStatus = `You've exceeded your budget by ${(budgetPercentage - 100).toFixed(1)}%!`;
        }
        
        document.getElementById('budget-status').textContent = budgetStatus;
        
        // Spending trend
        const currentExpenses = this.getCurrentMonthExpenses();
        let spendingTrend = '';
        
        if (currentExpenses.length === 0) {
            spendingTrend = 'No spending recorded yet.';
        } else if (currentExpenses.length === 1) {
            spendingTrend = 'You have 1 expense this month.';
        } else {
            const avgExpense = totalExpenses / currentExpenses.length;
            spendingTrend = `Average expense: $${avgExpense.toFixed(2)} (${currentExpenses.length} total)`;
        }
        
        document.getElementById('spending-trend').textContent = spendingTrend;
        
        // Update insight cards
        const insightCards = document.querySelectorAll('.insight-card');
        
        if (balance === this.monthlyIncome) {
            insightCards[0].innerHTML = `
                <i class="fas fa-trophy"></i>
                <h4>Great Start!</h4>
                <p>You haven't spent anything this month. Your full $${this.monthlyIncome} budget is available.</p>
            `;
        } else if (balance > this.monthlyIncome * 0.5) {
            insightCards[0].innerHTML = `
                <i class="fas fa-smile"></i>
                <h4>Good Progress!</h4>
                <p>You're doing well! $${balance.toFixed(2)} still available this month.</p>
            `;
        } else if (balance > 0) {
            insightCards[0].innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Watch Spending</h4>
                <p>Only $${balance.toFixed(2)} left this month. Spend wisely!</p>
            `;
        } else {
            insightCards[0].innerHTML = `
                <i class="fas fa-sad-tear"></i>
                <h4>Over Budget!</h4>
                <p>You've exceeded your budget by $${Math.abs(balance).toFixed(2)}.</p>
            `;
        }
    }
    
    exportData() {
        const data = {
            monthlyIncome: this.monthlyIncome,
            expenses: this.expenses,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scribbler-finance-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }
    
    resetData() {
        this.expenses = [];
        this.monthlyIncome = 1000;
        this.currentDate = new Date();
        localStorage.removeItem('scribbler-finance-data');
        this.updateUI();
        this.showNotification('All data has been reset!', 'warning');
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#FF9800'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.financeTracker = new FinanceTracker();
});