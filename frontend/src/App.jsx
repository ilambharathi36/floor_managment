import React, { useEffect, useMemo, useRef, useState } from 'react';

const FALLBACK_ASSETS = [
  { id: 'AS-00123', name: 'Dell Monitor 27"', category: 'Electronics', type: 'Monitor', status: 'Available', location: 'Floor 2 - Dev Team', image: '🖥️', assignedTo: '', purchaseDate: '2024-06-12', warrantyTill: '2027-06-12', notes: 'High-resolution monitor for development workstations.' },
  { id: 'AS-00124', name: 'Ergonomic Chair', category: 'Furniture', type: 'Chair', status: 'Available', location: 'Floor 2 - Dev Team', image: '🪑', assignedTo: '', purchaseDate: '2024-06-12', warrantyTill: '2027-06-12', notes: 'Comfortable ergonomic chair with lumbar support. Last serviced on 2025-02-10.' },
  { id: 'AS-00125', name: 'Workstation Desk', category: 'Furniture', type: 'Desk', status: 'In Use', location: 'Floor 2 - Dev Team', image: '🪑', assignedTo: 'Alice', purchaseDate: '2024-03-16', warrantyTill: '2028-03-16', notes: 'Shared development desk with monitor arms.' },
  { id: 'AS-00126', name: 'MacBook Pro', category: 'Electronics', type: 'Laptop', status: 'In Use', location: 'Floor 2 - Design', image: '💻', assignedTo: 'Nina', purchaseDate: '2023-08-11', warrantyTill: '2026-08-11', notes: 'Primary design workstation.' },
  { id: 'AS-00127', name: 'Keyboard', category: 'Accessories', type: 'Input', status: 'Available', location: 'Floor 2 - Dev Team', image: '⌨️', assignedTo: '', purchaseDate: '2023-11-01', warrantyTill: '2026-11-01', notes: 'Mechanical keyboard set for desk rotation.' },
  { id: 'AS-00128', name: 'Mouse', category: 'Accessories', type: 'Input', status: 'Available', location: 'Floor 2 - Dev Team', image: '🖱️', assignedTo: '', purchaseDate: '2023-11-01', warrantyTill: '2026-11-01', notes: 'Ergonomic wireless mouse.' },
  { id: 'AS-00129', name: 'Meeting Table', category: 'Furniture', type: 'Table', status: 'Available', location: 'Floor 2 - Meeting Room', image: '🪴', assignedTo: '', purchaseDate: '2022-05-04', warrantyTill: '2027-05-04', notes: 'Meeting room table used for product reviews.' },
  { id: 'AS-00130', name: 'Projector', category: 'Electronics', type: 'Display', status: 'Available', location: 'Floor 2 - Meeting Room', image: '📽️', assignedTo: '', purchaseDate: '2021-09-15', warrantyTill: '2026-09-15', notes: '4K projector used for weekly standups.' },
  { id: 'AS-00131', name: 'Whiteboard', category: 'Furniture', type: 'Board', status: 'Available', location: 'Floor 2 - Meeting Room', image: '📝', assignedTo: '', purchaseDate: '2020-12-10', warrantyTill: '2025-12-10', notes: 'Large wall whiteboard for sprint planning.' },
];

const ROOMS = [
  { name: 'Lounge', x: 90, y: 70, w: 180, h: 130 },
  { name: 'Meeting Room', x: 290, y: 70, w: 200, h: 130 },
  { name: 'Pantry', x: 510, y: 70, w: 110, h: 110 },
  { name: 'IT Room', x: 430, y: 400, w: 160, h: 90 },
  { name: 'Restroom', x: 140, y: 420, w: 120, h: 90 },
  { name: 'Stairs', x: 360, y: 440, w: 100, h: 80 },
];

const DESKS = [
  { x: 140, y: 190, w: 92, h: 64, id: 'AS-00123' },
  { x: 282, y: 190, w: 92, h: 64, id: 'AS-00124' },
  { x: 420, y: 190, w: 92, h: 64, id: 'AS-00125' },
  { x: 562, y: 190, w: 92, h: 64, id: 'AS-00126' },
  { x: 140, y: 310, w: 92, h: 64, id: 'AS-00127' },
  { x: 282, y: 310, w: 92, h: 64, id: 'AS-00128' },
  { x: 420, y: 310, w: 92, h: 64, id: 'AS-00129' },
  { x: 562, y: 310, w: 92, h: 64, id: 'AS-00130' },
  { x: 220, y: 420, w: 92, h: 64, id: 'AS-00131' },
  { x: 420, y: 420, w: 92, h: 64, id: 'AS-00124' },
];

const NAV_ITEMS = ['Home', 'Assets', 'Floor Plan', 'Requests', 'Reports', 'Settings'];
const FILTER_ITEMS = ['All', 'Furniture', 'Electronics', 'Accessories'];
const DETAIL_TABS = ['Details', 'History', 'Related'];
const EMPTY_ASSET_FORM = {
  asset_id: '',
  name: '',
  category: 'Furniture',
  asset_type: 'Desk',
  status: 'Available',
  location: 'Floor 2 - Dev Team',
  image: '🪑',
  assigned_to: '',
  notes: '',
  purchase_date: '2026-09-25',
  warranty_till: '2029-09-25',
};

function App() {
  const [assets, setAssets] = useState(FALLBACK_ASSETS);
  const [nav, setNav] = useState('Home');
  const [selectedId, setSelectedId] = useState('AS-00124');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('Floor View');
  const [detailTab, setDetailTab] = useState('Details');
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const [toast, setToast] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'Admin@123' });
  const [assetForm, setAssetForm] = useState(EMPTY_ASSET_FORM);
  const [assetFormMode, setAssetFormMode] = useState('create');
  const [showAssetForm, setShowAssetForm] = useState(false);

  const loadAssets = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/assets/');
      const result = await response.json();
      if (Array.isArray(result.assets) && result.assets.length) {
        setAssets(result.assets.map((asset) => ({
          id: asset.id || asset.asset_id,
          ...asset,
          assignedTo: asset.assignedTo || asset.assigned_to || '',
          type: asset.type || asset.asset_type,
          purchaseDate: asset.purchaseDate || asset.purchase_date,
          warrantyTill: asset.warrantyTill || asset.warranty_till,
        })));
        if (result.selected_asset?.id || result.selected_asset?.asset_id) {
          setSelectedId(result.selected_asset.id || result.selected_asset.asset_id);
        }
      }
    } catch (error) {
      setAssets(FALLBACK_ASSETS);
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/session/', { credentials: 'include' });
      const result = await response.json();
      if (result.authenticated) {
        setIsAuthenticated(true);
        await loadAssets();
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (!assets.length) return;
    if (!assets.some((asset) => asset.id === selectedId)) {
      setSelectedId(assets[0].id);
    }
  }, [assets, selectedId]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
      const haystack = `${asset.id} ${asset.name} ${asset.location} ${asset.type}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [assets, categoryFilter, searchTerm]);

  const selectedAsset = filteredAssets.find((asset) => asset.id === selectedId) || assets.find((asset) => asset.id === selectedId) || FALLBACK_ASSETS[1];
  const isHomeView = nav === 'Home';

  const updateAssetState = (assetId, updates) => {
    setAssets((current) => current.map((asset) => (asset.id === assetId ? { ...asset, ...updates } : asset)));
  };

  const selectAsset = (assetId) => {
    setSelectedId(assetId);
    setIsDetailPanelOpen(true);
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const clampZoom = (value) => Math.min(1.8, Math.max(0.6, value));

  const handleZoom = (delta) => {
    setZoomLevel((current) => clampZoom(current + delta));
  };

  const handlePanStep = (dx, dy) => {
    setPan((current) => ({ x: current.x + dx, y: current.y + dy }));
  };

  const handlePlannerPointerDown = (event) => {
    if (event.button !== 0) return;
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    event.preventDefault();
  };

  const handlePlannerPointerMove = (event) => {
    if (!dragStateRef.current.active) return;
    const deltaX = (event.clientX - dragStateRef.current.startX) / zoomLevel;
    const deltaY = (event.clientY - dragStateRef.current.startY) / zoomLevel;
    setPan({
      x: dragStateRef.current.originX + deltaX,
      y: dragStateRef.current.originY + deltaY,
    });
  };

  const handlePlannerPointerUp = () => {
    dragStateRef.current.active = false;
  };

  const performAction = async (endpoint, payload, successMessage) => {
    if (!selectedAsset) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/assets/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ asset_id: selectedAsset.id, ...payload }),
      });
      const result = await response.json();
      if (response.ok && result.asset) {
        updateAssetState(selectedAsset.id, {
          ...result.asset,
          id: result.asset.id || result.asset.asset_id,
          assignedTo: result.asset.assignedTo || result.asset.assigned_to || '',
          type: result.asset.type || result.asset.asset_type,
          purchaseDate: result.asset.purchaseDate || result.asset.purchase_date,
          warrantyTill: result.asset.warrantyTill || result.asset.warranty_till,
        });
      }
      showToast(successMessage);
    } catch (error) {
      showToast('Local action saved in the UI.');
      if (endpoint === 'assign') {
        updateAssetState(selectedAsset.id, { assignedTo: payload.assigned_to, status: 'In Use' });
      }
      if (endpoint === 'move') {
        updateAssetState(selectedAsset.id, { location: payload.location });
      }
      if (endpoint === 'report') {
        updateAssetState(selectedAsset.id, { status: 'Needs attention', notes: payload.reason || 'Reported for review.' });
      }
    }
  };

  const handleAssign = async () => {
    const assignee = window.prompt('Assign asset to:', selectedAsset.assignedTo || 'Team Member');
    if (!assignee) return;
    await performAction('assign', { assigned_to: assignee }, `Assigned to ${assignee}`);
  };

  const handleMove = async () => {
    const options = ['Floor 2 - Dev Team', 'Floor 2 - Meeting Room', 'Floor 2 - Design', 'Floor 2 - Lounge'];
    const location = window.prompt('Move asset to:', selectedAsset.location || options[0]);
    if (!location) return;
    await performAction('move', { location }, `Moved to ${location}`);
  };

  const handleReportIssue = async () => {
    const reason = window.prompt('Describe the issue:', 'Needs inspection');
    if (!reason) return;
    await performAction('report', { reason }, 'Issue reported');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginForm),
      });
      const result = await response.json();
      if (!response.ok) {
        setLoginError(result.error || 'Login failed');
        return;
      }
      setIsAuthenticated(true);
      setLoginError('');
      await loadAssets();
    } catch (error) {
      setLoginError('Unable to reach the server.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // no-op
    }
    setIsAuthenticated(false);
    setLoginError('');
    setAssets(FALLBACK_ASSETS);
    setSelectedId('AS-00124');
  };

  const handleAssetFormChange = (field, value) => {
    setAssetForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateOrUpdateAsset = async (event) => {
    event.preventDefault();
    const endpoint = assetFormMode === 'edit' ? 'update' : 'create';
    const payload = {
      asset_id: assetForm.asset_id || assetForm.id,
      name: assetForm.name,
      category: assetForm.category,
      asset_type: assetForm.asset_type,
      status: assetForm.status,
      location: assetForm.location,
      image: assetForm.image,
      assigned_to: assetForm.assigned_to,
      notes: assetForm.notes,
      purchase_date: assetForm.purchase_date,
      warranty_till: assetForm.warranty_till,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/assets/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.asset) {
        const refreshedAsset = {
          id: result.asset.id || result.asset.asset_id,
          ...result.asset,
          assignedTo: result.asset.assignedTo || result.asset.assigned_to || '',
          type: result.asset.type || result.asset.asset_type,
          purchaseDate: result.asset.purchaseDate || result.asset.purchase_date,
          warrantyTill: result.asset.warrantyTill || result.asset.warranty_till,
        };
        if (assetFormMode === 'edit') {
          setAssets((current) => current.map((asset) => (asset.id === refreshedAsset.id ? refreshedAsset : asset)));
          setSelectedId(refreshedAsset.id);
        } else {
          setAssets((current) => [refreshedAsset, ...current]);
          setSelectedId(refreshedAsset.id);
        }
        setShowAssetForm(false);
        setAssetForm(EMPTY_ASSET_FORM);
        showToast(assetFormMode === 'edit' ? 'Asset updated' : 'Asset created');
      } else {
        showToast(result.error || 'Unable to save asset');
      }
    } catch (error) {
      showToast('Save failed. Please retry.');
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;
    const confirmed = window.confirm(`Delete ${selectedAsset.name}?`);
    if (!confirmed) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/assets/delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ asset_id: selectedAsset.id }),
      });
      if (response.ok) {
        setAssets((current) => current.filter((asset) => asset.id !== selectedAsset.id));
        const nextAsset = assets.find((asset) => asset.id !== selectedAsset.id);
        setSelectedId(nextAsset ? nextAsset.id : '');
        showToast('Asset deleted');
      }
    } catch (error) {
      showToast('Delete failed.');
    }
  };

  const history = [
    { title: 'Assigned', value: selectedAsset.assignedTo || 'Unassigned' },
    { title: 'Status', value: selectedAsset.status },
    { title: 'Last Service', value: '2025-02-10' },
  ];

  const related = [
    'Workspace 3A',
    selectedAsset.category,
    selectedAsset.type,
  ];

  if (!isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="brand-row auth-brand">
            <div className="brand-mark">◢</div>
            <div className="brand-text">Floor Asset Management</div>
          </div>
          <h2>Sign in</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <label>
              Username
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
              />
            </label>
            {loginError && <div className="auth-error">{loginError}</div>}
            <button type="submit" className="primary-action auth-submit">Login</button>
          </form>
          <div className="demo-credentials">
            Demo admin: admin / Admin@123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">◢</div>
          <div className="brand-text">Floor Asset Management</div>
        </div>

        <nav className="nav-menu">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={`nav-item ${nav === item ? 'active' : ''}`}
              onClick={() => setNav(item)}
            >
              {item === 'Home' ? '⌂' : item === 'Assets' ? '▣' : item === 'Floor Plan' ? '▤' : item === 'Requests' ? '◫' : item === 'Reports' ? '◩' : '⚙'} {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="secondary-action sidebar-logout" type="button" onClick={handleLogout}>Logout</button>
          <div>Better Spaces Better Work</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <input
            className="search-box"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search assets, locations, people..."
          />
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications">🔔</button>
            <div className="avatar-pill">
              <span className="avatar-mini">A</span>
              <span>admin</span>
            </div>
          </div>
        </header>

        <section className="asset-section">
          {!isHomeView && (
            <div className="asset-list-panel">
              <div className="panel-header">
                <h2>Assets</h2>
                <div className="panel-header-actions">
                  <button className="primary-action" type="button" onClick={() => { setAssetFormMode('create'); setAssetForm({ ...EMPTY_ASSET_FORM, asset_id: `AS-${Math.floor(Math.random() * 9000 + 1000)}` }); setShowAssetForm(true); }}>New Asset</button>
                </div>
              </div>

              <div className="filter-row">
                {FILTER_ITEMS.map((filter) => (
                  <button
                    key={filter}
                    className={`chip ${categoryFilter === filter ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(filter)}
                  >
                    {filter} ({filter === 'All' ? assets.length : assets.filter((asset) => asset.category === filter).length})
                  </button>
                ))}
              </div>

              <input
                className="search-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by asset name, tag, or ID..."
              />

              <div className="asset-card-list">
                {filteredAssets.length ? filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    className={`asset-row ${selectedAsset?.id === asset.id ? 'selected' : ''}`}
                    onClick={() => selectAsset(asset.id)}
                  >
                    <div className="asset-icon">{asset.image}</div>
                    <div className="asset-copy">
                      <div className="asset-title-row">
                        <strong>{asset.id}</strong>
                      </div>
                      <div className="asset-name">{asset.name}</div>
                      <div className="asset-meta">
                        <span className={`status-dot ${asset.status === 'In Use' ? 'in-use' : 'available'}`}></span>
                        {asset.status}
                      </div>
                      <div className="asset-location">{asset.location}</div>
                    </div>
                    <span className="chevron">›</span>
                  </button>
                )) : (
                  <div className="empty-state">No assets match your search.</div>
                )}
              </div>
            </div>
          )}

          <div className={`floor-panel ${isHomeView ? 'home-floor-panel' : ''}`}>
            <div className="toolbar">
              <div className="toolbar-group left">
                {['Floor View', 'List View'].map((mode) => (
                  <button
                    key={mode}
                    className={`segment ${viewMode === mode ? 'active' : ''}`}
                    onClick={() => setViewMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className="toolbar-group right">
                <button className="small-btn" type="button" aria-label="Pan left" onClick={() => handlePanStep(-40, 0)}>←</button>
                <button className="small-btn" type="button" aria-label="Pan right" onClick={() => handlePanStep(40, 0)}>→</button>
                <button className="small-btn" type="button" aria-label="Zoom out" onClick={() => handleZoom(-0.12)}>−</button>
                <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                <button className="small-btn" type="button" aria-label="Zoom in" onClick={() => handleZoom(0.12)}>＋</button>
                <button className="small-btn" type="button" aria-label="Reset view" onClick={() => { setZoomLevel(1); setPan({ x: 0, y: 0 }); }}>⌂</button>
              </div>
            </div>

            <div
              className="floor-map"
              onWheel={(event) => {
                event.preventDefault();
                handleZoom(event.deltaY < 0 ? 0.12 : -0.12);
              }}
            >
              <div
                className="map-outer"
                onMouseDown={handlePlannerPointerDown}
                onMouseMove={handlePlannerPointerMove}
                onMouseUp={handlePlannerPointerUp}
                onMouseLeave={handlePlannerPointerUp}
              >
                <div
                  className="planner-stage"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                    transformOrigin: '0 0',
                  }}
                >
                  {ROOMS.map((room) => (
                    <div
                      key={room.name}
                      className="room-label"
                      style={{ left: `${room.x}px`, top: `${room.y}px`, width: `${room.w}px`, height: `${room.h}px` }}
                    >
                      {room.name}
                    </div>
                  ))}

                  {DESKS.map((desk) => {
                    const match = assets.find((asset) => asset.id === desk.id);
                    const isSelected = selectedAsset?.id === desk.id;
                    return (
                      <button
                        key={`${desk.x}-${desk.y}`}
                        type="button"
                        className={`desk ${isSelected ? 'active' : ''}`}
                        style={{ left: `${desk.x}px`, top: `${desk.y}px`, width: `${desk.w}px`, height: `${desk.h}px` }}
                        onClick={() => selectAsset(desk.id)}
                        title={match ? match.name : 'Asset'}
                      >
                        <span className="desk-top"></span>
                        <span className="desk-leg left"></span>
                        <span className="desk-leg right"></span>
                        <span className="chair"></span>
                      </button>
                    );
                  })}

                  <div className="map-marker selected-marker" style={{ left: `${selectedAsset ? 420 : 420}px`, top: `${selectedAsset ? 240 : 240}px` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {!isHomeView && isDetailPanelOpen && (
        <aside className="details-panel">
          <div className="panel-title-row">
            <h3>Asset Details</h3>
            <button className="close-btn" type="button" aria-label="Close" onClick={() => setIsDetailPanelOpen(false)}>×</button>
          </div>

          <div className="details-asset-card">
            <div className="mini-asset-icon">{selectedAsset.image}</div>
            <div className="mini-asset-name">{selectedAsset.id}</div>
            <div className="mini-asset-status">{selectedAsset.status}</div>
          </div>

          <div className="details-tabs">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${detailTab === tab ? 'active' : ''}`}
                onClick={() => setDetailTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {detailTab === 'Details' && (
            <div className="details-table">
              <div className="detail-row"><span>Asset ID</span><strong>{selectedAsset.id}</strong></div>
              <div className="detail-row"><span>Name</span><strong>{selectedAsset.name}</strong></div>
              <div className="detail-row"><span>Category</span><strong>{selectedAsset.category}</strong></div>
              <div className="detail-row"><span>Type</span><strong>{selectedAsset.type}</strong></div>
              <div className="detail-row"><span>Location</span><strong>{selectedAsset.location}</strong></div>
              <div className="detail-row"><span>Assigned To</span><strong>{selectedAsset.assignedTo || 'Unassigned'}</strong></div>
              <div className="detail-row"><span>Purchase Date</span><strong>{selectedAsset.purchaseDate}</strong></div>
              <div className="detail-row"><span>Warranty Till</span><strong>{selectedAsset.warrantyTill}</strong></div>
            </div>
          )}

          {detailTab === 'History' && (
            <div className="details-table">
              {history.map((item) => (
                <div key={item.title} className="detail-row">
                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          )}

          {detailTab === 'Related' && (
            <div className="details-table">
              {related.map((item) => (
                <div key={item} className="detail-row">
                  <span>Related</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="quick-actions">
            <button className="primary-action" type="button" onClick={handleAssign}>Assign</button>
            <button className="secondary-action" type="button" onClick={handleMove}>Move</button>
            <button className="secondary-action" type="button" onClick={handleReportIssue}>Report Issue</button>
          </div>

          <div className="admin-actions">
            <button className="secondary-action" type="button" onClick={() => { setAssetFormMode('edit'); setAssetForm({ ...selectedAsset, asset_id: selectedAsset.id, asset_type: selectedAsset.type, assigned_to: selectedAsset.assignedTo || '', purchase_date: selectedAsset.purchaseDate, warranty_till: selectedAsset.warrantyTill }); setShowAssetForm(true); }}>Edit Asset</button>
            <button className="secondary-action danger" type="button" onClick={handleDeleteAsset}>Delete Asset</button>
          </div>

          <div className="notes-box">
            <h4>Notes</h4>
            <p>{selectedAsset.notes}</p>
          </div>
        </aside>
      )}

      {showAssetForm && (
        <div className="asset-modal-backdrop" onClick={() => setShowAssetForm(false)}>
          <div className="asset-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{assetFormMode === 'edit' ? 'Edit Asset' : 'Create Asset'}</h3>
              <button type="button" className="close-btn" onClick={() => setShowAssetForm(false)}>×</button>
            </div>
            <form onSubmit={handleCreateOrUpdateAsset} className="asset-form">
              <div className="form-grid">
                <label>
                  Asset ID
                  <input value={assetForm.asset_id} onChange={(event) => handleAssetFormChange('asset_id', event.target.value)} />
                </label>
                <label>
                  Name
                  <input value={assetForm.name} onChange={(event) => handleAssetFormChange('name', event.target.value)} />
                </label>
                <label>
                  Category
                  <select value={assetForm.category} onChange={(event) => handleAssetFormChange('category', event.target.value)}>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </label>
                <label>
                  Type
                  <input value={assetForm.asset_type} onChange={(event) => handleAssetFormChange('asset_type', event.target.value)} />
                </label>
                <label>
                  Status
                  <select value={assetForm.status} onChange={(event) => handleAssetFormChange('status', event.target.value)}>
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Needs attention">Needs attention</option>
                  </select>
                </label>
                <label>
                  Location
                  <input value={assetForm.location} onChange={(event) => handleAssetFormChange('location', event.target.value)} />
                </label>
                <label>
                  Image
                  <input value={assetForm.image} onChange={(event) => handleAssetFormChange('image', event.target.value)} />
                </label>
                <label>
                  Assigned To
                  <input value={assetForm.assigned_to} onChange={(event) => handleAssetFormChange('assigned_to', event.target.value)} />
                </label>
                <label>
                  Purchase Date
                  <input type="date" value={assetForm.purchase_date} onChange={(event) => handleAssetFormChange('purchase_date', event.target.value)} />
                </label>
                <label>
                  Warranty Till
                  <input type="date" value={assetForm.warranty_till} onChange={(event) => handleAssetFormChange('warranty_till', event.target.value)} />
                </label>
              </div>
              <label>
                Notes
                <textarea value={assetForm.notes} onChange={(event) => handleAssetFormChange('notes', event.target.value)} rows="4" />
              </label>
              <div className="form-actions">
                <button type="button" className="secondary-action" onClick={() => setShowAssetForm(false)}>Cancel</button>
                <button type="submit" className="primary-action">{assetFormMode === 'edit' ? 'Save Changes' : 'Create Asset'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
