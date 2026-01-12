import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ShoppingBag, DollarSign, CalendarRange, Users } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [3200, 4100, 3800, 5200, 4800, 6100, 5800],
        borderColor: '#4A90E2',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div>
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
              <ShoppingBag size={24} />
            </div>
            <h3 className="h2 mb-2">1,247</h3>
            <p className="text-muted mb-0">Total Orders</p>
            <small className="text-success">↑ 12.5% from last month</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-success bg-opacity-10 text-success">
              <DollarSign size={24} />
            </div>
            <h3 className="h2 mb-2">$24,780</h3>
            <p className="text-muted mb-0">Revenue</p>
            <small className="text-success">↑ 8.2% from last month</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
              <CalendarRange size={24} />
            </div>
            <h3 className="h2 mb-2">284</h3>
            <p className="text-muted mb-0">Bookings</p>
            <small className="text-danger">↓ 3.1% from last month</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon bg-info bg-opacity-10 text-info">
              <Users size={24} />
            </div>
            <h3 className="h2 mb-2">892</h3>
            <p className="text-muted mb-0">Active Customers</p>
            <small className="text-success">↑ 15.3% from last month</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="chart-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Revenue Overview</h5>
              <select className="form-select" style={{ width: 'auto' }}>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="chart-container h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Popular Items</h5>
              <select className="form-select" style={{ width: 'auto' }}>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            {/* Add popular items list here */}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Recent Orders</h5>
          <button className="btn btn-primary btn-sm">View All</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-7829</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
                      alt="Sarah Johnson"
                      className="rounded-circle"
                      width="32"
                      height="32"
                    />
                    Sarah Johnson
                  </div>
                </td>
                <td>3 items</td>
                <td>$84.50</td>
                <td><span className="status-badge status-processing">Processing</span></td>
                <td><button className="btn btn-link btn-sm p-0">View Details</button></td>
              </tr>
              <tr>
                <td>#ORD-7828</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
                      alt="Mike Peters"
                      className="rounded-circle"
                      width="32"
                      height="32"
                    />
                    Mike Peters
                  </div>
                </td>
                <td>2 items</td>
                <td>$32.25</td>
                <td><span className="status-badge status-completed">Completed</span></td>
                <td><button className="btn btn-link btn-sm p-0">View Details</button></td>
              </tr>
              <tr>
                <td>#ORD-7827</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
                      alt="Emily Wilson"
                      className="rounded-circle"
                      width="32"
                      height="32"
                    />
                    Emily Wilson
                  </div>
                </td>
                <td>1 item</td>
                <td>$18.99</td>
                <td><span className="status-badge status-cancelled">Cancelled</span></td>
                <td><button className="btn btn-link btn-sm p-0">View Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;