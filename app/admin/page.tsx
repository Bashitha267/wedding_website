'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, History, LayoutTemplate, Edit2, Trash2, Eye, X, Check, Unlock } from 'lucide-react';

const mockOrdersOrigin = [
  { id: 'ORD-001', date: '2026-04-12', customer_name: 'John Doe', username: null, status: 'pending' },
  { id: 'ORD-002', date: '2026-04-11', customer_name: 'Sarah Smith', username: 'sarah_client', status: 'completed' },
];

const mockRSVPs = [
  { id: 1, order_id: 'ORD-001', name: 'Alice Cooper', contact: '0712345678', adults: 2, children: 1, table: 'T-1' },
  { id: 2, order_id: 'ORD-001', name: 'Bob Marley', contact: '0777654321', adults: 1, children: 0, table: 'T-1' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(mockOrdersOrigin);
  const [rsvps, setRSVPs] = useState(mockRSVPs);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({ username: '', password: '', status: '' });

  const startEdit = (order: any) => {
    setEditingOrder(order);
    setEditForm({ 
      username: order.username || '', 
      password: '', // Password hash would be set/reset here
      status: order.status 
    });
  };

  const saveEdit = () => {
    setOrders(orders.map(o => {
      if (o.id === editingOrder.id) {
        return {
          ...o,
          username: editForm.username || null,
          status: editForm.status
        };
      }
      return o;
    }));
    setEditingOrder(null);
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleApprove = (order: any) => {
    // In real app: call supabase.rpc('approve_client', { p_username: order.username, p_order_id: order.id })
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'completed' } : o));
    alert(`${order.customer_name} has been granted access!`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--bw-black)', color: 'white', padding: '20px 0' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #333', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>KNOT STORY</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Admin Portal</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'dashboard' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'history' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <History size={18} /> History
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'templates' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <LayoutTemplate size={18} /> Templates
          </button>
          <button 
            onClick={() => setActiveTab('rsvps')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'rsvps' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
             <Check size={18} /> RSVPs
          </button>
        </nav>
        <div style={{ position: 'absolute', bottom: '20px', padding: '0 20px' }}>
            <Link href="/admin/login" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1 style={{ margin: 0 }}>Dashboard</h1>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '15px 25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Orders</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>{orders.length}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '15px 25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Pending</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>{orders.filter(o => o.status === 'pending').length}</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f4f4f4' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Order ID</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Date</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Customer</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Username</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Status</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px 20px' }}>{order.id}</td>
                      <td style={{ padding: '15px 20px', color: '#666' }}>{order.date}</td>
                      <td style={{ padding: '15px 20px' }}>{order.customer_name}</td>
                      <td style={{ padding: '15px 20px', color: order.username ? '#333' : '#999' }}>
                        {order.username || 'Not Assigned'}
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem',
                          backgroundColor: order.status === 'completed' ? '#def0d8' : '#fcf8e3',
                          color: order.status === 'completed' ? '#3c763d' : '#8a6d3b'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666' }} title="View">
                            <Eye size={18} />
                          </button>
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleApprove(order)} 
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#28a745' }} 
                              title="Grant Access"
                            >
                              <Unlock size={18} />
                            </button>
                          )}
                          <button onClick={() => startEdit(order)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#0056b3' }} title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => deleteOrder(order.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc3545' }} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && <div><h2>History</h2><p>Past completed templates would be listed here.</p></div>}
        {activeTab === 'templates' && <div><h2>Templates</h2><p>Manage the 10 core templates here.</p></div>}
        {activeTab === 'rsvps' && (
          <div>
            <h1 style={{ marginBottom: '30px' }}>Guest RSVPs</h1>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f4f4f4' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Order ID</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Guest Name</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Contact</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Adults</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Children</th>
                    <th style={{ padding: '15px 20px', fontWeight: 600, color: '#333' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map(rsvp => (
                    <tr key={rsvp.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px 20px' }}>{rsvp.order_id}</td>
                      <td style={{ padding: '15px 20px' }}>{rsvp.name}</td>
                      <td style={{ padding: '15px 20px', color: '#666' }}>{rsvp.contact}</td>
                      <td style={{ padding: '15px 20px' }}>{rsvp.adults}</td>
                      <td style={{ padding: '15px 20px' }}>{rsvp.children}</td>
                      <td style={{ padding: '15px 20px', fontWeight: 600 }}>{rsvp.adults + rsvp.children}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingOrder && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Edit Order {editingOrder.id}</h2>
              <button onClick={() => setEditingOrder(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Client Username</label>
                <input 
                  type="text" 
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Set Password</label>
                <input 
                  type="password" 
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  placeholder="Enter new password to hash"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Order Status</label>
                <select 
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <button onClick={saveEdit} className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
