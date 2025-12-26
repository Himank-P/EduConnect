import React, { useState, useEffect } from 'react';
import RouteMapModal from '../../ui/modals/RouteMapModal';
import BusRosterModal from '../../ui/modals/BusRosterModal';

function TransportAdmin() {
    const [transportData, setTransportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedBusRoster, setSelectedBusRoster] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/transport`);
                if (!response.ok) throw new Error('Failed to fetch transport data.');
                const data = await response.json();
                setTransportData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const routes = React.useMemo(() => {
        if (!transportData) return {};
        return transportData.vehicles.reduce((acc, vehicle) => {
            const { route, id } = vehicle;
            if (!acc[route]) {
                acc[route] = [];
            }
            acc[route].push(id);
            return acc;
        }, {});
    }, [transportData]);

    if (isLoading) return <div className="page-container">Loading Transport Data...</div>;
    if (!transportData) return <div className="page-container">Could not load data.</div>;

    return (
        <>
            <div className="page-container">
                <h1>🚌 Transport Management</h1>
                <p className="page-intro">Overview of all vehicle routes and daily operational logs. Click on a route card or a vehicle row to view details.</p>
                
                <div className="admin-section">
                    <h2>Transport Routes</h2>
                    <div className="routes-grid">
                        {Object.entries(routes).map(([routeName, busIds]) => (
                            <div className="route-card" key={routeName} onClick={() => setSelectedRoute(routeName)}>
                                <h3>{routeName}</h3>
                                <div className="bus-list">
                                    <strong>Assigned Buses:</strong>
                                    <span>{busIds.join(', ')}</span>
                                </div>
                                <div className="route-societies">
                                    <strong>Key Localities:</strong>
                                    <div className="localities-tags">
                                        {transportData.routes[routeName]?.localities.map(loc => (
                                            <span key={loc} className="locality-tag">{loc}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-section">
                    <h2>Vehicle Roster</h2>
                    <div className="table-container">
                        <table className="history-table student-list-table">
                            <thead>
                                <tr>
                                    <th>Bus ID</th>
                                    <th>Vehicle Number</th>
                                    <th>Model & Color</th>
                                    <th>Driver</th>
                                    <th>Faculty-in-Charge</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transportData.vehicles.map(v => (
                                    <tr key={v.id} onClick={() => setSelectedBusRoster(v)}>
                                        <td data-label="Bus ID">{v.id}</td>
                                        <td data-label="Vehicle Number">{v.vehicleNumber}</td>
                                        <td data-label="Model & Color">{v.model} ({v.color})</td>
                                        <td data-label="Driver"><a href={`tel:${v.driverPhone}`} className="text-link" onClick={e => e.stopPropagation()}>{v.driver}</a></td>
                                        <td data-label="Faculty"><a href={`tel:${v.facultyPhone}`} className="text-link" onClick={e => e.stopPropagation()}>{v.femaleFaculty}</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-section">
                    <h2>Daily Logs</h2>
                    <div className="table-container">
                         <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Bus ID</th>
                                    <th>Date</th>
                                    <th>Departure</th>
                                    <th>Return</th>
                                    <th>Avg. Duration</th>
                                    <th>Fuel Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transportData.logs.map(log => (
                                    <tr key={log.id}>
                                        <td>{log.busId}</td>
                                        <td>{log.date}</td>
                                        <td>{log.departure}</td>
                                        <td>{log.arrival}</td>
                                        <td>{log.duration}</td>
                                        <td>{log.fuelUsed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedRoute && <RouteMapModal routeName={selectedRoute} closeModal={() => setSelectedRoute(null)} />}
            {selectedBusRoster && <BusRosterModal bus={selectedBusRoster} closeModal={() => setSelectedBusRoster(null)} />}
        </>
    );
}

export default TransportAdmin;

