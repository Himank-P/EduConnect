import React, { useState, useEffect } from 'react';

function LabInventory() {
    const [labData, setLabData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('physics');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/labs`);
                if (!response.ok) throw new Error('Failed to fetch lab data.');
                const data = await response.json();
                setLabData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="page-container">Loading Lab Inventory...</div>;
    if (!labData) return <div className="page-container">Could not load data.</div>;

    const currentLab = labData[activeTab];

    return (
        <div className="page-container">
            <h1>🔬 Lab Inventory</h1>
            <p className="page-intro">Track equipment, chemicals, and all materials in stock for each lab.</p>
            
            <div className="lab-tabs-container">
                <div className="lab-tabs">
                    {Object.keys(labData).map(labKey => (
                        <button 
                            key={labKey} 
                            className={`lab-tab-button ${activeTab === labKey ? 'active' : ''}`}
                            onClick={() => setActiveTab(labKey)}
                        >
                            {labData[labKey].name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-section">
                <h2>{currentLab.name}</h2>
                <p className="lab-assistant-info"><strong>Lab Assistant:</strong> {currentLab.assistant}</p>
                <div className="table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>In Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLab.inventory.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td><strong>{item.inStock}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LabInventory;
