'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, History, LayoutTemplate, X, Check, Trash2, PenTool, Search, Filter, ChevronLeft, ChevronRight, Users, Disc, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [rsvps, setRSVPs] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ username: '', password: '', status: '' });
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // RSVP / Seating State
  const [selectedOrderForRSVP, setSelectedOrderForRSVP] = useState<any>(null);
  const [orderTemplateDraft, setOrderTemplateDraft] = useState<any>({});
  const [orderRSVPs, setOrderRSVPs] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchRSVPs();
    fetchFeedbacks();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchRSVPs = async () => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching RSVPs:', error);
    } else {
      setRSVPs(data || []);
    }
  };

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching feedbacks:', error);
    } else {
      setFeedbacks(data || []);
    }
  };

  const toggleFeedbackPublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('feedbacks')
      .update({ is_published: !currentStatus })
      .eq('id', id);
    
    if (error) {
      alert('Failed to update feedback status');
    } else {
      fetchFeedbacks();
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id);
    
    if (error) {
      alert('Failed to delete feedback');
    } else {
      fetchFeedbacks();
    }
  };

  const startEdit = (order: any) => {
    setEditingOrder(order);
    setEditForm({ 
      username: order.client_username || '', 
      password: '', // Password hash would be set/reset here
      status: order.status 
    });
  };

  const saveEdit = () => {
    setOrders(orders.map(o => {
      if (o.id === editingOrder.id) {
        return {
          ...o,
          client_username: editForm.username || null,
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

  const handleToggleAccess = async (order: any) => {
    const isCurrentlyActive = order.status === 'completed';
    const nextActiveState = !isCurrentlyActive;
    
    try {
      const { data, error } = await supabase.rpc('toggle_order_access', { 
        p_username: order.client_username, 
        p_is_active: nextActiveState
      });

      if (error) throw error;
      
      alert(`${order.customer_name} access has been ${nextActiveState ? 'granted' : 'revoked'}!`);
      fetchOrders(); 
    } catch (err: any) {
      console.error(err);
      alert(`Operation failed: ${err.message}`);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;
      alert(`Order ${orderId} marked as completed!`);
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(`Operation failed: ${err.message}`);
    }
  };

  const fetchOrderRSVPs = async (order: any) => {
      setSelectedOrderForRSVP(order);
      setOrderTemplateDraft(order.template_data || {});
      
      const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .eq('order_id', order.id);
      
      if (data) setOrderRSVPs(data);
  };

  const handleTableAssign = async (id: string, table: string) => {
    setOrderRSVPs(prev => prev.map(r => r.id === id ? { ...r, table_number: table || null } : r));
    await supabase.from('rsvps').update({ table_number: table || null }).eq('id', id);
  };

  const getFilteredOrders = (status: string | null) => {
    return orders.filter(order => {
        const matchesStatus = !status || order.status === status;
        const matchesSearch = 
            order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const date = new Date(order.created_at);
        const matchesMonth = filterMonth === '' || (date.getMonth() + 1).toString() === filterMonth;
        const matchesYear = filterYear === '' || date.getFullYear().toString() === filterYear;

        return matchesStatus && matchesSearch && matchesMonth && matchesYear;
    });
  };

  const paginate = (data: any[]) => {
      const start = (currentPage - 1) * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
  };

  const SearchAndFilterBar = () => (
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="text" 
                placeholder="Search by name, username, contact..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                 style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
              />
          </div>
          <select 
            value={filterMonth} 
            onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
          >
              <option value="">All Months</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                  <option key={m} value={(i + 1).toString()}>{m}</option>
              ))}
          </select>
          <select 
            value={filterYear} 
            onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
          >
              <option value="">All Years</option>
              {[2024, 2025, 2026].map(y => <option key={y} value={y.toString()}>{y}</option>)}
          </select>
          {(searchTerm || filterMonth || filterYear) && (
              <button onClick={() => { setSearchTerm(''); setFilterMonth(''); setFilterYear(''); setCurrentPage(1); }} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '0.85rem' }}>Clear Filters</button>
          )}
      </div>
  );

  const Pagination = ({ totalItems }: { totalItems: number }) => {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (totalPages <= 1) return null;

      return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                  <ChevronLeft size={18} />
              </button>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Page <strong>{currentPage}</strong> of {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                  <ChevronRight size={18} />
              </button>
          </div>
      );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--bw-black)', color: 'white', padding: '20px 0' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #333', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>KNOT STORY</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.6, margin: 0 }}>Admin Portal</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'dashboard' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'history' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            <History size={18} /> History
          </button>
          <button 
            onClick={() => setActiveTab('rsvps')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'rsvps' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
             <Check size={18} /> RSVPs
          </button>
          <button 
            onClick={() => setActiveTab('feedbacks')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', 
              backgroundColor: activeTab === 'feedbacks' ? '#333' : 'transparent',
              color: 'white', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
             <MessageSquare size={18} /> Feedbacks
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
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Ongoing</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>{orders.filter(o => o.status === 'pending').length}</div>
                </div>
              </div>
            </div>

            <SearchAndFilterBar />

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                  <tr>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem', width: '40px' }}>#</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>CUSTOMER</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>CONTACT</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>USERNAME</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>DATE</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>URL</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>STATUS</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>ACTIONS</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>EDITOR</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</td></tr>
                  ) : getFilteredOrders('pending').length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No orders found matching your criteria.</td></tr>
                  ) : paginate(getFilteredOrders('pending')).map((order, index) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #eee', fontSize: '1rem' }}>
                      <td style={{ padding: '12px', color: '#999' }}>{(currentPage-1)*itemsPerPage + index + 1}</td>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#333' }}>{order.customer_name}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{order.customer_phone || 'N/A'}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{order.client_username || '-'}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>
                        <a href={`/${order.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontWeight: 700, textDecoration: 'none', border: '1px solid #007bff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>LIVE</a>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#fce8e6', color: '#d93025', textTransform: 'uppercase' }}>ONGOING</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button onClick={() => handleToggleAccess(order)} style={{ padding: '5px 10px', border: 'none', borderRadius: '4px', background: '#28a745', cursor: 'pointer', color: 'white', fontSize: '0.7rem', fontWeight: 600 }}>APPROVE</button>
                          <button onClick={() => handleCompleteOrder(order.id)} style={{ padding: '5px 10px', border: 'none', borderRadius: '4px', background: '#17a2b8', cursor: 'pointer', color: 'white', fontSize: '0.7rem', fontWeight: 600 }}>COMPLETE</button>
                          <button onClick={() => startEdit(order)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><PenTool size={16} /></button>
                          <button onClick={() => { if(confirm('Delete order?')) deleteOrder(order.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Link href={`/admin/editor/${order.id}`} style={{ color: '#007bff', fontWeight: 700, textDecoration: 'none', fontSize: '0.75rem', border: '1px solid #007bff', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#f0f7ff' }}>Edit Template</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination totalItems={getFilteredOrders('pending').length} />
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h1 style={{ marginBottom: '30px' }}>Order History (Completed)</h1>
            <SearchAndFilterBar />
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                  <tr>
                     <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem', width: '40px' }}>#</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>CUSTOMER</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>CONTACT</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>USERNAME</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>DATE</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>URL</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>STATUS</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>ACTIONS</th>
                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>EDITOR</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders('completed').length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No history records found matching your criteria.</td></tr>
                  ) : paginate(getFilteredOrders('completed')).map((order, index) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #eee', fontSize: '1rem' }}>
                      <td style={{ padding: '12px', color: '#999' }}>{(currentPage-1)*itemsPerPage + index + 1}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{order.customer_name}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{order.customer_phone || 'N/A'}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{order.client_username || '-'}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>
                        <a href={`/${order.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontWeight: 700, textDecoration: 'none', border: '1px solid #007bff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>LIVE</a>
                      </td>
                      <td style={{ padding: '12px' }}>
                         <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#e6f4ea', color: '#1e7e34', textTransform: 'uppercase' }}>COMPLETED</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                           <button onClick={() => startEdit(order)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><PenTool size={16} /></button>
                           <button onClick={() => { if(confirm('Delete order?')) deleteOrder(order.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Link href={`/admin/editor/${order.id}`} style={{ color: '#007bff', fontWeight: 700, textDecoration: 'none', fontSize: '0.75rem', border: '1px solid #007bff', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#f0f7ff' }}>
                          Edit Template
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination totalItems={getFilteredOrders('completed').length} />
          </div>
        )}

        {activeTab === 'rsvps' && (
          <div>
            {selectedOrderForRSVP ? (
                <div>
                    <button onClick={() => setSelectedOrderForRSVP(null)} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 600 }}>
                        <ChevronLeft size={18} /> Back to Orders
                    </button>
                    
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                        <h2 style={{ margin: '0 0 10px' }}>Order: {selectedOrderForRSVP.customer_name}</h2>
                        <div style={{ display: 'flex', gap: '30px', fontSize: '0.9rem', color: '#666' }}>
                            <span><strong>Username:</strong> {selectedOrderForRSVP.client_username}</span>
                            <span><strong>Slug:</strong> /{selectedOrderForRSVP.slug}</span>
                            <span><strong>Total RSVPs:</strong> {orderRSVPs.length}</span>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Guest List</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', fontSize: '0.8rem', color: '#666' }}>
                                    <th style={{ padding: '10px' }}>NAME</th>
                                    <th style={{ padding: '10px' }}>CONTACT</th>
                                    <th style={{ padding: '10px' }}>ADULTS</th>
                                    <th style={{ padding: '10px' }}>CHILDREN</th>
                                    <th style={{ padding: '10px' }}>TABLE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderRSVPs.map(rsvp => (
                                    <tr key={rsvp.id} style={{ borderBottom: '1px solid #f9f9f9', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '10px', fontWeight: 600 }}>{rsvp.name}</td>
                                        <td style={{ padding: '10px', color: '#666' }}>{rsvp.contact_number}</td>
                                        <td style={{ padding: '10px' }}>{rsvp.adult_count}</td>
                                        <td style={{ padding: '10px' }}>{rsvp.children_count}</td>
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ padding: '2px 8px', backgroundColor: rsvp.table_number ? '#e7f3ff' : '#f0f0f0', color: rsvp.table_number ? '#007bff' : '#999', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    {rsvp.table_number || 'Unassigned'}
                                                </span>
                                                {rsvp.table_number && (
                                                    <button 
                                                        onClick={() => handleTableAssign(rsvp.id, '')}
                                                        style={{ padding: '2px 6px', backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '3px', fontSize: '0.65rem', cursor: 'pointer' }}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <SeatingChart 
                        rsvps={orderRSVPs} 
                        templateDraft={orderTemplateDraft} 
                        onUpdateDraft={setOrderTemplateDraft}
                        onAssignGuest={handleTableAssign}
                        onSave={async () => {
                            await supabase.from('orders').update({ template_data: orderTemplateDraft }).eq('id', selectedOrderForRSVP.id);
                            alert("Seating changes saved!");
                        }}
                    />
                </div>
            ) : (
                <div>
                    <h1 style={{ marginBottom: '30px' }}>RSVP & Seating Management</h1>
                    <SearchAndFilterBar />
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                <tr>
                                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.8rem' }}>#</th>
                                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.8rem' }}>CUSTOMER</th>
                                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.8rem' }}>USERNAME</th>
                                    <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.8rem' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredOrders(null).length === 0 ? (
                                    <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No orders found.</td></tr>
                                ) : paginate(getFilteredOrders(null)).map((order, index) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #eee', fontSize: '1rem' }}>
                                        <td style={{ padding: '15px 12px', color: '#999' }}>{(currentPage-1)*itemsPerPage + index + 1}</td>
                                        <td style={{ padding: '15px 12px', fontWeight: 600 }}>{order.customer_name}</td>
                                        <td style={{ padding: '15px 12px' }}>{order.client_username}</td>
                                        <td style={{ padding: '15px 12px' }}>
                                            <button 
                                                onClick={() => fetchOrderRSVPs(order)}
                                                style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                <Users size={16} /> View RSVPs & Seating
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination totalItems={getFilteredOrders(null).length} />
                </div>
            )}
        </div>
      )}

      {activeTab === 'feedbacks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: 0 }}>User Feedbacks</h1>
            <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>Share Feedback Link:</span>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/feedback`;
                  navigator.clipboard.writeText(url);
                  alert('Feedback link copied to clipboard!');
                }}
                style={{ 
                  padding: '8px 15px', backgroundColor: '#007bff', color: 'white', 
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                <tr>
                  <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem', width: '40px' }}>#</th>
                  <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>NAME</th>
                  <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>CONTACT</th>
                  <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>FEEDBACK</th>
                  <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>IMAGE</th>
                  <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>STATUS</th>
                  <th style={{ padding: '15px 12px', fontWeight: 600, color: '#444', fontSize: '0.9rem' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No feedbacks submitted yet.</td></tr>
                ) : feedbacks.map((feedback, index) => (
                  <tr key={feedback.id} style={{ borderBottom: '1px solid #eee', fontSize: '1rem' }}>
                    <td style={{ padding: '12px', color: '#999' }}>{index + 1}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{feedback.name}</td>
                    <td style={{ padding: '12px', color: '#666' }}>{feedback.contact_number}</td>
                    <td style={{ padding: '12px', color: '#444', maxWidth: '300px' }}>
                      <div style={{ maxHeight: '60px', overflowY: 'auto' }}>{feedback.description}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {feedback.image_url ? (
                        <img 
                          src={feedback.image_url} 
                          alt="Feedback" 
                          onClick={() => setViewingImage(feedback.image_url)}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }} 
                        />
                      ) : (
                        <span style={{ color: '#ccc' }}>No Image</span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, 
                        backgroundColor: feedback.is_published ? '#e6f4ea' : '#fff5f5', 
                        color: feedback.is_published ? '#1e7e34' : '#d93025',
                        textTransform: 'uppercase'
                      }}>
                        {feedback.is_published ? 'PUBLISHED' : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => toggleFeedbackPublish(feedback.id, feedback.is_published)} 
                          title={feedback.is_published ? 'Unpublish' : 'Publish'}
                          style={{ 
                            background: feedback.is_published ? '#6c757d' : '#28a745', 
                            color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' 
                          }}
                        >
                          {feedback.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                          {feedback.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button 
                          onClick={() => deleteFeedback(feedback.id)} 
                          title="Delete"
                          style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
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

      {/* Image Lightbox */}
      {viewingImage && (
        <div 
          onClick={() => setViewingImage(null)}
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3000, cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setViewingImage(null); }}
              style={{ position: 'absolute', top: '-50px', right: '-10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={40} />
            </button>
            <img src={viewingImage} alt="Large view" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
        </div>
      )}
    </div>
  );
}

const SeatingChart = ({ rsvps, templateDraft, onUpdateDraft, onAssignGuest, onSave }: any) => {
  const tables = templateDraft.tables || [];
  // Use all RSVPs since the table schema doesn't have an is_attending column yet
  const unassignedGuests = rsvps.filter((r: any) => !r.table_number);
  const [showAssignModal, setShowAssignModal] = useState<{ tableId: string, seatIdx: number } | null>(null);

  const addNewTable = () => {
    const newTables = [...tables, { id: `table-${Date.now()}`, name: `Table ${tables.length + 1}`, seats: 8 }];
    onUpdateDraft({ ...templateDraft, tables: newTables });
  };

  const addSeatToTable = (tableId: string) => {
    const newTables = tables.map((t: any) => t.id === tableId ? { ...t, seats: (t.seats || 0) + 1 } : t);
    onUpdateDraft({ ...templateDraft, tables: newTables });
  };

  const removeGuestFromSeat = (guestId: string) => {
    onAssignGuest(guestId, '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#1c1e21', margin: 0 }}>Seating Arrangement</h1>
        <button onClick={addNewTable} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Create New Table</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
        {tables.map((table: any) => {
          const guestsAtTable = rsvps.filter((r: any) => r.table_number === table.name);
          const totalAdults = guestsAtTable.reduce((sum: number, r: any) => sum + (Number(r.adult_count) || 0), 0);
          const totalChildren = guestsAtTable.reduce((sum: number, r: any) => sum + (Number(r.children_count) || 0), 0);
          const totalHeadcount = totalAdults + totalChildren;
          
          return (
            <div key={table.id} style={{ 
                backgroundColor: 'white', padding: '30px', borderRadius: '15px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={table.name} 
                  onChange={(e) => {
                    const oldName = table.name;
                    const newName = e.target.value;
                    const newTables = tables.map((t: any) => t.id === table.id ? { ...t, name: newName } : t);
                    onUpdateDraft({ ...templateDraft, tables: newTables });
                    
                    // Update all RSVPs that were assigned to the old name
                    rsvps.forEach((r: any) => {
                        if (r.table_number === oldName) {
                            onAssignGuest(r.id, newName);
                        }
                    });
                  }}
                  style={{ fontWeight: 700, fontSize: '1.2rem', border: 'none', color: '#1c1e21', width: '120px' }}
                />
                <button onClick={() => addSeatToTable(table.id)} style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>+ Add Seat</button>
              </div>

              <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '2px dashed #007bff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, flexDirection: 'column' }}>
                  <span style={{ fontWeight: 800, color: '#007bff', fontSize: '1.1rem' }}>{totalHeadcount} / {table.seats}</span>
                  <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '2px' }}>
                    {totalAdults}A | {totalChildren}C
                  </div>
                </div>

                {[...Array(table.seats)].map((_, i) => {
                  const angle = (i / table.seats) * Math.PI * 2;
                  const radius = 85;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  // Flatten guests into individual seats with types
                  const seatMap: { guest: any, type: 'adult' | 'child' }[] = [];
                  guestsAtTable.forEach((guest: any) => {
                    const adults = Number(guest.adult_count) || 0;
                    const children = Number(guest.children_count) || 0;
                    for(let j=0; j<adults; j++) {
                      if (seatMap.length < table.seats) seatMap.push({ guest, type: 'adult' });
                    }
                    for(let j=0; j<children; j++) {
                      if (seatMap.length < table.seats) seatMap.push({ guest, type: 'child' });
                    }
                  });
                  const seatData = seatMap[i];
                  const guestAtSeat = seatData?.guest;
                  const isChild = seatData?.type === 'child';

                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        if (guestAtSeat) {
                          removeGuestFromSeat(guestAtSeat.id);
                        } else {
                          setShowAssignModal({ tableId: table.name, seatIdx: i });
                        }
                      }}
                      style={{
                        position: 'absolute',
                        transform: `translate(${x}px, ${y}px)`,
                        width: '35px', height: '35px', borderRadius: '50%',
                        backgroundColor: guestAtSeat ? (isChild ? '#28a745' : '#007bff') : '#eee',
                        border: guestAtSeat ? 'none' : '2px solid #ddd',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10, transition: 'all 0.2s ease',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                      title={guestAtSeat ? `${guestAtSeat.name}${isChild ? '-child' : ''}` : "Assign Guest"}
                    >
                      {guestAtSeat ? (
                        <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>{guestAtSeat.name.charAt(0)}</span>
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>+</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '400px', maxHeight: '500px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Assign Guest</h2>
              <button onClick={() => setShowAssignModal(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {unassignedGuests.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No unassigned guests.</p>}
              {unassignedGuests.map((guest: any) => (
                <button 
                  key={guest.id} 
                  onClick={() => { onAssignGuest(guest.id, showAssignModal.tableId); setShowAssignModal(null); }} 
                  style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ fontWeight: 600 }}>{guest.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    {guest.adult_count || 0} Adults, {guest.children_count || 0} Children
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Make sure to save the seating plan!</p>
        <button onClick={onSave} style={{ padding: '10px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Save Layout Changes</button>
      </div>
    </div>
  );
};
