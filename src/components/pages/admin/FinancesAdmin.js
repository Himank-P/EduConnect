import React, { useState, useEffect } from 'react';

function FinancesAdmin() {
    const [financeData, setFinanceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/admin/finances`)
            .then(res => res.json())
            .then(data => {
                setFinanceData(data);
                setIsLoading(false);
            });
    }, []);
    
    if (isLoading) return <div className="page-container">Loading Finances...</div>;

    return (
        <div className="page-container">
            <h1>💰 Financial Overview</h1>
            <p className="page-intro">A summary of all recent credit and debit transactions.</p>
            <div className="finance-grid">
                <div className="dashboard-card">
                    <h3>Credits (Income)</h3>
                    <div className="table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financeData.credit.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.date}</td>
                                        <td>{item.description}</td>
                                        <td className="amount-credit">+ {item.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div className="dashboard-card">
                    <h3>Debits (Expenses)</h3>
                    <div className="table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financeData.debit.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.date}</td>
                                        <td>{item.description}</td>
                                        <td className="amount-debit">- {item.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinancesAdmin;

