document.addEventListener('DOMContentLoaded', () => {

    AppData.init();

    const hamburger = document.querySelector('.hamburger-dash');
    const sidebar = document.querySelector('.sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = document.getElementById(trigger.dataset.modal);
            if (target) target.classList.add('active');
        });
    });

    const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');
    modalCloses.forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || e.target.classList.contains('modal-close')) {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            }
        });
    });

    initUserDashboard();
    initMyBookings();
    initBookingDetails();
    initEditProfile();
    initNotifications();
    initAdminDashboard();
    initManageRooms();
    initManageBookings();
    initManageUsers();
    initPayments();
    initReports();
    initContent();
    initAuditLogs();
    initSettings();
    initLogin();
    initSignup();
    initResetPassword();
    initHostelSearch();
    initContact();
    initReviews();

});

function el(id) { return document.getElementById(id); }

function setText(id, text) { const e = el(id); if (e) e.textContent = text; }

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + ' hours ago';
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + ' days ago';
    return formatDate(dateStr);
}

function badge(status) {
    const map = { active: 'badge-success', paid: 'badge-success', completed: 'badge-success', available: 'badge-success', upcoming: 'badge-warning', pending: 'badge-warning', maintenance: 'badge-warning', cancelled: 'badge-danger', refunded: 'badge-danger', suspended: 'badge-danger', failed: 'badge-danger', disabled: 'badge-secondary', inactive: 'badge-secondary' };
    return '<span class="badge ' + (map[status] || 'badge-secondary') + '">' + status.charAt(0).toUpperCase() + status.slice(1) + '</span>';
}

function mk(amount) {
    return 'MK ' + Number(amount).toLocaleString();
}

/* User Dashboard */
function initUserDashboard() {
    const profile = AppData.get('profile');
    const bookings = AppData.get('bookings');
    const notifications = AppData.get('notifications');

    if (!document.querySelector('.dashboard-body .page-content')) return;

    const activeBookings = bookings.filter(b => b.status === 'active');
    const pendingBookings = bookings.filter(b => b.status === 'upcoming' || b.status === 'pending');
    const completedBookings = bookings.filter(b => b.status === 'completed');

    setText('stat-active', activeBookings.length);
    setText('stat-pending', pendingBookings.length);
    setText('stat-completed', completedBookings.length);
    setText('stat-rating', '4.8');

    const welcomeEl = document.querySelector('.page-header h2');
    if (welcomeEl) welcomeEl.textContent = 'Welcome back, ' + profile.firstName;

    const tbody = el('current-bookings-body');
    if (tbody) {
        const shown = bookings.filter(b => b.status === 'active' || b.status === 'upcoming').slice(0, 2);
        tbody.innerHTML = shown.map(b => '<tr><td>' + b.hostel + '</td><td>' + b.room + '</td><td>' + formatDate(b.checkIn) + '</td><td>' + formatDate(b.checkOut) + '</td><td>' + badge(b.status) + '</td></tr>').join('');
    }

    const notifContainer = el('dashboard-notifications');
    if (notifContainer) {
        const notifIcons = { booking: '#009272', payment: '#f39c12', reminder: '#3498db', system: '#9b59b6' };
        const notifIconClasses = { booking: 'fa-check', payment: 'fa-credit-card', reminder: 'fa-info-circle', system: 'fa-cog' };
        const unread = notifications.filter(n => !n.read).slice(0, 3);
        notifContainer.innerHTML = unread.map(n => '<div class="notification-item"><div class="notif-icon" style="background:' + (notifIcons[n.type] || '#009272') + ';"><i class="fas ' + (notifIconClasses[n.type] || 'fa-bell') + '"></i></div><div class="notif-content"><p>' + n.title + '</p><span class="notif-time">' + timeAgo(n.time) + '</span></div></div>').join('');
    }

    const historyBody = el('booking-history-body');
    if (historyBody) {
        historyBody.innerHTML = bookings.slice(0, 3).map(b => '<tr><td>' + b.hostel + '</td><td>' + b.room + '</td><td>' + formatDate(b.checkIn) + ' - ' + formatDate(b.checkOut) + '</td><td>' + mk(b.amount) + '</td><td>' + badge(b.status) + '</td></tr>').join('');
    }
}

/* My Bookings */
function initMyBookings() {
    const tbody = el('bookings-table-body');
    if (!tbody) return;

    const bookings = AppData.get('bookings');
    const filterBtns = document.querySelectorAll('.filters-bar .filter-btn');

    function render(filter) {
        let filtered = bookings;
        if (filter && filter !== 'All') {
            const statusMap = { 'Active': 'active', 'Upcoming': 'upcoming', 'Completed': 'completed', 'Cancelled': 'cancelled' };
            filtered = bookings.filter(b => b.status === statusMap[filter]);
        }
        tbody.innerHTML = filtered.map(b => '<tr><td>' + b.id + '</td><td>' + b.hostel + '</td><td>' + b.room + '</td><td>' + formatDate(b.checkIn) + '</td><td>' + formatDate(b.checkOut) + '</td><td>' + mk(b.amount) + '</td><td>' + badge(b.status) + '</td><td class="action-btns"><a href="booking-details.html?id=' + b.id + '" class="btn btn-sm btn-primary"><i class="fas fa-eye"></i></a>' + (b.status === 'active' || b.status === 'upcoming' ? '<button class="btn btn-sm btn-danger cancel-booking" data-id="' + b.id + '"><i class="fas fa-times"></i></button>' : '') + '</td></tr>').join('');

        document.querySelectorAll('.cancel-booking').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Cancel booking ' + btn.dataset.id + '?')) {
                    AppData.updateItem('bookings', btn.dataset.id, { status: 'cancelled' });
                    AppData.addLog(profile?.email || 'guest@email.com', 'cancel', 'Booking ' + btn.dataset.id, 'User cancelled booking', '');
                    render(document.querySelector('.filters-bar .filter-btn.active')?.textContent || 'All');
                }
            });
        });
    }

    const profile = AppData.get('profile');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render(btn.textContent);
        });
    });

    render('All');
}

/* Booking Details */
function initBookingDetails() {
    const container = el('booking-details-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('id') || 'BK-001';
    const booking = AppData.getById('bookings', bookingId);
    if (!booking) return;

    setText('booking-title', 'Booking ' + booking.id);
    setText('booking-id', booking.id);

    const alertEl = container.querySelector('.alert');
    if (alertEl) {
        alertEl.innerHTML = '<i class="fas fa-check-circle"></i> Your booking is <strong>' + booking.status + '</strong>. ' + (booking.status === 'active' ? 'Check in on ' + formatDate(booking.checkIn) + '.' : booking.status === 'upcoming' ? 'Payment of ' + mk(booking.amount) + ' is due.' : '');
        alertEl.className = 'alert alert-' + (booking.status === 'active' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning');
    }

    const detailItems = container.querySelectorAll('.detail-item');
    if (detailItems.length >= 6) {
        detailItems[0].querySelector('p').textContent = booking.hostel;
        detailItems[1].querySelector('p').textContent = booking.room;
        detailItems[2].querySelector('p').textContent = formatDate(booking.checkIn) + ' (2:00 PM)';
        detailItems[3].querySelector('p').textContent = formatDate(booking.checkOut) + ' (11:00 AM)';
        const nights = Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000);
        detailItems[4].querySelector('p').textContent = nights + ' nights';
        detailItems[5].querySelector('p').textContent = booking.guests + ' person' + (booking.guests > 1 ? 's' : '');
    }

    const payItems = container.querySelectorAll('.dashboard-grid .card:last-child .detail-item');
    if (payItems.length >= 4) {
        payItems[0].querySelector('p').textContent = mk(booking.amount);
        payItems[1].querySelector('p').innerHTML = badge(booking.paymentStatus);
        payItems[2].querySelector('p').textContent = booking.paymentMethod || 'N/A';
        payItems[3].querySelector('p').textContent = booking.paidOn ? formatDate(booking.paidOn) : 'N/A';
    }

    const receiptBody = el('receipt-body');
    if (receiptBody) {
        const nights = Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000);
        const rate = Math.round(booking.amount / nights);
        receiptBody.innerHTML = '<tr><td>' + booking.room + ' x ' + nights + ' nights</td><td>1</td><td>' + mk(rate) + ' / night</td><td>' + mk(booking.amount) + '</td></tr><tr><td><strong>Grand Total</strong></td><td></td><td></td><td><strong>' + mk(booking.amount) + '</strong></td></tr>';
    }
}

/* Edit Profile */
function initEditProfile() {
    const form = el('profile-form');
    if (!form) return;

    const profile = AppData.get('profile');
    const prefs = AppData.get('preferences');

    const firstNameInput = form.querySelector('[name="firstName"]');
    const lastNameInput = form.querySelector('[name="lastName"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const bioInput = form.querySelector('[name="bio"]');

    if (firstNameInput) firstNameInput.value = profile.firstName;
    if (lastNameInput) lastNameInput.value = profile.lastName;
    if (emailInput) emailInput.value = profile.email;
    if (phoneInput) phoneInput.value = profile.phone;
    if (bioInput) bioInput.value = profile.bio;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        AppData.set('profile', {
            firstName: firstNameInput ? firstNameInput.value : profile.firstName,
            lastName: lastNameInput ? lastNameInput.value : profile.lastName,
            email: emailInput ? emailInput.value : profile.email,
            phone: phoneInput ? phoneInput.value : profile.phone,
            bio: bioInput ? bioInput.value : profile.bio
        });
        alert('Profile saved!');
    });

    const pwForm = el('password-form');
    if (pwForm) {
        pwForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPw = pwForm.querySelector('[name="newPassword"]');
            const confirmPw = pwForm.querySelector('[name="confirmPassword"]');
            if (newPw && confirmPw && newPw.value === confirmPw.value && newPw.value.length >= 6) {
                AppData.set('password', newPw.value);
                newPw.value = '';
                confirmPw.value = '';
                alert('Password updated!');
            } else {
                alert('Passwords must match and be at least 6 characters.');
            }
        });
    }

    const prefsForm = el('preferences-form');
    if (prefsForm) {
        const emailToggle = prefsForm.querySelector('[name="emailNotif"]');
        const smsToggle = prefsForm.querySelector('[name="smsNotif"]');
        const promoToggle = prefsForm.querySelector('[name="promotions"]');
        if (emailToggle) emailToggle.checked = prefs.emailNotif;
        if (smsToggle) smsToggle.checked = prefs.smsNotif;
        if (promoToggle) promoToggle.checked = prefs.promotions;

        prefsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            AppData.set('preferences', {
                emailNotif: emailToggle ? emailToggle.checked : prefs.emailNotif,
                smsNotif: smsToggle ? smsToggle.checked : prefs.smsNotif,
                promotions: promoToggle ? promoToggle.checked : prefs.promotions
            });
            alert('Preferences saved!');
        });
    }

    const avatarEl = document.querySelector('.profile-avatar');
    const nameEl = document.querySelector('.profile-info h3');
    const emailEl = document.querySelector('.profile-info p');
    if (avatarEl) avatarEl.innerHTML = '<i class="fas fa-user"></i>';
    if (nameEl) nameEl.textContent = profile.firstName + ' ' + profile.lastName;
    if (emailEl) emailEl.textContent = profile.email;
}

/* Notifications */
function initNotifications() {
    const container = el('notifications-container');
    if (!container) return;

    const notifications = AppData.get('notifications');
    const icons = { booking: { bg: '#009272', icon: 'fa-check' }, payment: { bg: '#f39c12', icon: 'fa-credit-card' }, reminder: { bg: '#3498db', icon: 'fa-info-circle' }, system: { bg: '#9b59b6', icon: 'fa-cog' } };

    function render(filter) {
        let filtered = notifications;
        if (filter && filter !== 'All') {
            const typeMap = { 'Unread': 'unread', 'Booking': 'booking', 'Payment': 'payment', 'System': 'system' };
            if (filter === 'Unread') filtered = notifications.filter(n => !n.read);
            else filtered = notifications.filter(n => n.type === typeMap[filter]);
        }
        container.innerHTML = filtered.map(n => {
            const style = icons[n.type] || { bg: '#009272', icon: 'fa-bell' };
            return '<div class="notification-item' + (!n.read ? ' unread' : '') + '"><div class="notif-icon" style="background:' + style.bg + ';"><i class="fas ' + style.icon + '"></i></div><div class="notif-content"><p><strong>' + n.title + '</strong> &mdash; ' + n.message + '</p><span class="notif-time">' + timeAgo(n.time) + '</span></div></div>';
        }).join('');
    }

    const markAllBtn = document.querySelector('.card-header .btn-outline');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            AppData.get('notifications').forEach(n => n.read = true);
            AppData.save();
            render(document.querySelector('.filters-bar .filter-btn.active')?.textContent || 'All');
        });
    }

    const filterBtns = document.querySelectorAll('.filters-bar .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render(btn.textContent);
        });
    });
    render('All');
}

/* Admin Dashboard */
function initAdminDashboard() {
    if (!el('admin-stats')) return;

    const bookings = AppData.get('bookings');
    const rooms = AppData.get('rooms');

    const activeBookings = bookings.filter(b => b.status === 'active').length;
    const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid' || b.paymentStatus === 'completed').reduce((s, b) => s + b.amount, 0);
    const cancellations = bookings.filter(b => b.status === 'cancelled').length;
    const pending = bookings.filter(b => b.status === 'upcoming' || b.paymentStatus === 'pending').length;
    const available = rooms.filter(r => r.status === 'available').length;
    const occupied = rooms.filter(r => r.status !== 'available' && r.status !== 'disabled').length;

    setText('stat-occupied', occupied || '24');
    setText('stat-available', available || '12');
    setText('stat-revenue', mk(totalRevenue || 12450));
    setText('stat-cancellations', cancellations || 3);
    setText('stat-pending-approvals', pending || 5);

    const recentBody = el('recent-bookings-body');
    if (recentBody) {
        recentBody.innerHTML = bookings.slice(0, 4).map(b => '<tr><td>' + (AppData.getById('adminUsers', 'USR-001')?.name || 'Guest') + '</td><td>' + b.hostel + '</td><td>' + formatDate(b.checkIn) + ' - ' + formatDate(b.checkOut) + '</td><td>' + mk(b.amount) + '</td><td>' + badge(b.status) + '</td></tr>').join('');
    }
}

/* Manage Rooms */
function initManageRooms() {
    const tbody = el('rooms-table-body');
    if (!tbody) return;

    const rooms = AppData.get('rooms');

    function render() {
        tbody.innerHTML = rooms.map(r => '<tr><td>' + r.id + '</td><td>' + r.hostel + '</td><td>' + r.type + '</td><td>' + r.capacity + '</td><td>' + mk(r.price) + '</td><td>' + badge(r.status) + '</td><td class="action-btns"><button class="btn btn-sm btn-primary edit-room" data-id="' + r.id + '"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-secondary toggle-room" data-id="' + r.id + '"><i class="fas fa-ban"></i></button><button class="btn btn-sm btn-danger delete-room" data-id="' + r.id + '"><i class="fas fa-trash"></i></button></td></tr>').join('');
    }

    render();

    document.querySelectorAll('.edit-room').forEach(btn => {
        btn.addEventListener('click', () => {
            const room = AppData.getById('rooms', btn.dataset.id);
            if (room) {
                el('edit-room-hostel').value = room.hostel;
                el('edit-room-type').value = room.type;
                el('edit-room-capacity').value = room.capacity;
                el('edit-room-price').value = room.price;
                el('edit-room-status').value = room.status;
                el('edit-room-desc').value = room.description || '';
                el('edit-room-modal').dataset.id = room.id;
                el('edit-room-modal').classList.add('active');
            }
        });
    });

    document.querySelectorAll('.delete-room').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete room ' + btn.dataset.id + '?')) {
                AppData.deleteItem('rooms', btn.dataset.id);
                AppData.addLog('admin@pamalo.com', 'delete', 'Room ' + btn.dataset.id, 'Deleted room listing', '');
                render();
            }
        });
    });

    document.querySelectorAll('.toggle-room').forEach(btn => {
        btn.addEventListener('click', () => {
            const room = AppData.getById('rooms', btn.dataset.id);
            if (room) {
                const newStatus = room.status === 'available' ? 'disabled' : 'available';
                AppData.updateItem('rooms', btn.dataset.id, { status: newStatus });
                AppData.addLog('admin@pamalo.com', 'update', 'Room ' + btn.dataset.id, 'Toggled room status to ' + newStatus, '');
                render();
            }
        });
    });

    const addForm = el('add-room-form');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newRoom = {
                id: 'RM-' + String(Date.now()).slice(-4),
                hostel: addForm.querySelector('[name="hostel"]').value,
                type: addForm.querySelector('[name="type"]').value,
                capacity: parseInt(addForm.querySelector('[name="capacity"]').value),
                price: parseInt(addForm.querySelector('[name="price"]').value),
                status: 'available',
                description: addForm.querySelector('[name="description"]').value || ''
            };
            AppData.addItem('rooms', newRoom);
            AppData.addLog('admin@pamalo.com', 'create', 'Room ' + newRoom.id, 'Added new ' + newRoom.type + ' to ' + newRoom.hostel, '');
            el('addRoomModal').classList.remove('active');
            addForm.reset();
            render();
        });
    }

    const editForm = el('edit-room-form');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = el('edit-room-modal').dataset.id;
            AppData.updateItem('rooms', id, {
                hostel: editForm.querySelector('[name="hostel"]').value,
                type: editForm.querySelector('[name="type"]').value,
                capacity: parseInt(editForm.querySelector('[name="capacity"]').value),
                price: parseInt(editForm.querySelector('[name="price"]').value),
                status: editForm.querySelector('[name="status"]').value,
                description: editForm.querySelector('[name="description"]').value || ''
            });
            AppData.addLog('admin@pamalo.com', 'update', 'Room ' + id, 'Updated room details', '');
            el('edit-room-modal').classList.remove('active');
            render();
        });
    }
}

/* Manage Bookings */
function initManageBookings() {
    const tbody = el('admin-bookings-body');
    if (!tbody) return;

    const bookings = AppData.get('bookings');

    function render(filter) {
        let filtered = bookings;
        if (filter && filter !== 'All') {
            const statusMap = { 'Pending': 'pending', 'Active': 'active', 'Upcoming': 'upcoming', 'Completed': 'completed', 'Cancelled': 'cancelled' };
            filtered = bookings.filter(b => (statusMap[filter] ? b.status === statusMap[filter] : true));
        }

        tbody.innerHTML = filtered.map(b => {
            const name = AppData.getById('adminUsers', 'USR-001')?.name || 'Guest';
            return '<tr><td>' + b.id + '</td><td>' + b.hostel + '</td><td>' + b.room + '</td><td>' + formatDate(b.checkIn) + '</td><td>' + formatDate(b.checkOut) + '</td><td>' + mk(b.amount) + '</td><td>' + badge(b.status) + '</td><td class="action-btns">' +
                (b.status === 'upcoming' || b.paymentStatus === 'pending' ? '<button class="btn btn-sm btn-primary approve-booking" data-id="' + b.id + '"><i class="fas fa-check"></i></button>' : '') +
                '<button class="btn btn-sm btn-warning edit-booking" data-id="' + b.id + '"><i class="fas fa-edit"></i></button>' +
                (b.status !== 'cancelled' && b.status !== 'completed' ? '<button class="btn btn-sm btn-danger cancel-booking-admin" data-id="' + b.id + '"><i class="fas fa-times"></i></button>' : '') +
                '</td></tr>';
        }).join('');
    }

    render('All');

    document.querySelectorAll('.approve-booking').forEach(btn => {
        btn.addEventListener('click', () => {
            AppData.updateItem('bookings', btn.dataset.id, { status: 'active', paymentStatus: 'paid' });
            AppData.addLog('admin@pamalo.com', 'update', 'Booking ' + btn.dataset.id, 'Approved pending booking', '');
            render(document.querySelector('.filters-bar .filter-btn.active')?.textContent || 'All');
        });
    });

    document.querySelectorAll('.cancel-booking-admin').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Cancel booking ' + btn.dataset.id + '?')) {
                AppData.updateItem('bookings', btn.dataset.id, { status: 'cancelled', paymentStatus: 'refunded' });
                AppData.addLog('admin@pamalo.com', 'cancel', 'Booking ' + btn.dataset.id, 'Admin cancelled booking', '');
                render(document.querySelector('.filters-bar .filter-btn.active')?.textContent || 'All');
            }
        });
    });

    const filterBtns = document.querySelectorAll('.filters-bar .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render(btn.textContent);
        });
    });

    const createForm = el('create-booking-form');
    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newBk = {
                id: 'BK-' + String(Date.now()).slice(-4),
                hostel: createForm.querySelector('[name="hostel"]').value,
                room: createForm.querySelector('[name="roomType"]').value,
                checkIn: createForm.querySelector('[name="checkIn"]').value,
                checkOut: createForm.querySelector('[name="checkOut"]').value,
                amount: parseInt(createForm.querySelector('[name="amount"]').value),
                status: 'active',
                paymentStatus: 'paid',
                paymentMethod: 'Credit Card',
                paidOn: today(),
                guests: 1
            };
            AppData.addItem('bookings', newBk);
            AppData.addLog('admin@pamalo.com', 'create', 'Booking ' + newBk.id, 'Created manual booking', '');
            el('createBookingModal').classList.remove('active');
            createForm.reset();
            render('All');
        });
    }
}

/* Manage Users */
function initManageUsers() {
    const tbody = el('users-table-body');
    if (!tbody) return;

    const users = AppData.get('adminUsers');
    const roleSelect = document.querySelector('[name="selectUser"]');
    if (roleSelect) {
        roleSelect.innerHTML = users.filter(u => u.role === 'guest').map(u => '<option value="' + u.id + '">' + u.name + ' (' + u.id + ')</option>').join('');
    }

    function render() {
        tbody.innerHTML = users.map(u =>
            '<tr><td>' + u.id + '</td><td>' + u.name + '</td><td>' + u.email + '</td><td>' + badge(u.role) + '</td><td>' + badge(u.status) + '</td><td>' + formatDate(u.joined) + '</td><td class="action-btns">' +
            '<button class="btn btn-sm btn-primary edit-user" data-id="' + u.id + '"><i class="fas fa-edit"></i></button>' +
            (u.status === 'active' ? '<button class="btn btn-sm btn-secondary suspend-user" data-id="' + u.id + '"><i class="fas fa-ban"></i></button>' : '<button class="btn btn-sm btn-success reactivate-user" data-id="' + u.id + '"><i class="fas fa-check"></i></button>') +
            '<button class="btn btn-sm btn-warning reset-user" data-id="' + u.id + '"><i class="fas fa-key"></i></button>' +
            '</td></tr>'
        ).join('');
    }

    render();

    document.querySelectorAll('.suspend-user').forEach(btn => {
        btn.addEventListener('click', () => {
            AppData.updateItem('adminUsers', btn.dataset.id, { status: 'suspended' });
            AppData.addLog('admin@pamalo.com', 'update', 'User ' + btn.dataset.id, 'Suspended user account', '');
            render();
        });
    });

    document.querySelectorAll('.reactivate-user').forEach(btn => {
        btn.addEventListener('click', () => {
            AppData.updateItem('adminUsers', btn.dataset.id, { status: 'active' });
            AppData.addLog('admin@pamalo.com', 'update', 'User ' + btn.dataset.id, 'Reactivated user account', '');
            render();
        });
    });

    document.querySelectorAll('.reset-user').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Reset access for ' + btn.dataset.id + '?')) {
                AppData.addLog('admin@pamalo.com', 'update', 'User ' + btn.dataset.id, 'Reset user access', '');
                alert('Access reset for ' + btn.dataset.id);
            }
        });
    });

    const roleForm = el('assign-role-form');
    if (roleForm) {
        roleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = roleForm.querySelector('[name="selectUser"]').value;
            const newRole = roleForm.querySelector('[name="newRole"]').value;
            AppData.updateItem('adminUsers', userId, { role: newRole });
            AppData.addLog('admin@pamalo.com', 'update', 'User ' + userId, 'Assigned role: ' + newRole, '');
            render();
            alert('Role updated!');
        });
    }
}

/* Payments */
function initPayments() {
    if (!el('transactions-body')) return;

    const payments = AppData.get('payments');
    const totalRev = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const refunds = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);
    const failed = payments.filter(p => p.status === 'failed').length;

    setText('payment-revenue', mk(totalRev));
    setText('payment-transactions', payments.length);
    setText('payment-refunds', mk(refunds));
    setText('payment-failed', failed);

    const tbody = el('transactions-body');
    tbody.innerHTML = payments.map(p =>
        '<tr><td>' + p.id + '</td><td>' + p.booking + '</td><td>' + p.guest + '</td><td>' + mk(p.amount) + '</td><td>' + p.method + '</td><td>' + formatDate(p.date) + '</td><td>' + badge(p.status) + '</td><td><button class="btn btn-sm btn-outline invoice-btn" data-id="' + p.id + '"><i class="fas fa-file-invoice"></i></button></td></tr>'
    ).join('');

    document.querySelectorAll('.invoice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Invoice for ' + btn.dataset.id + ' would be generated here.');
        });
    });

    const refundForm = el('refund-form');
    if (refundForm) {
        refundForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const txnId = refundForm.querySelector('[name="txnId"]').value;
            const reason = refundForm.querySelector('[name="reason"]').value;
            AppData.addLog('admin@pamalo.com', 'create', 'Payment ' + txnId, 'Processed refund: ' + reason, '');
            alert('Refund processed for ' + txnId);
            refundForm.reset();
        });
    }
}

/* Reports */
function initReports() {
    if (!el('reports-stats')) return;

    const bookings = AppData.get('bookings');
    const rooms = AppData.get('rooms');

    const totalGuests = bookings.reduce((s, b) => s + b.guests, 0);
    const avgStay = bookings.length ? Math.round(bookings.reduce((s, b) => s + Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000), 0) / bookings.length) : 0;
    const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid' || b.paymentStatus === 'completed').reduce((s, b) => s + b.amount, 0);
    const occupied = rooms.filter(r => r.status === 'available').length;
    const totalRooms = rooms.length;
    const occupancyRate = totalRooms ? Math.round((totalRooms - occupied) / totalRooms * 100) : 0;

    setText('report-occupancy', occupancyRate + '%');
    setText('report-revenue-growth', '+12%');
    setText('report-avg-stay', avgStay);
    setText('report-total-guests', totalGuests);

    const popularBody = el('popular-rooms-body');
    if (popularBody) {
        popularBody.innerHTML = rooms.slice(0, 4).map((r, i) =>
            '<tr><td>' + r.type + '</td><td>' + r.hostel + '</td><td>' + Math.floor(Math.random() * 20 + 5) + '</td><td>' + mk(r.price * Math.floor(Math.random() * 20 + 5)) + '</td><td>' + badge(i < 2 ? 'high' : i < 3 ? 'medium' : 'low') + '</td></tr>'
        ).join('');
    }

    const monthlyBody = el('monthly-report-body');
    if (monthlyBody) {
        monthlyBody.innerHTML = [
            { month: 'June 2026', bookings: 12, revenue: 4200000, occupancy: '72%', cancellations: 1 },
            { month: 'May 2026', bookings: 15, revenue: 5100000, occupancy: '68%', cancellations: 2 },
            { month: 'April 2026', bookings: 10, revenue: 3450000, occupancy: '55%', cancellations: 0 },
            { month: 'March 2026', bookings: 8, revenue: 2800000, occupancy: '45%', cancellations: 1 }
        ].map(m => '<tr><td>' + m.month + '</td><td>' + m.bookings + '</td><td>' + mk(m.revenue) + '</td><td>' + m.occupancy + '</td><td>' + m.cancellations + '</td></tr>').join('');
    }
}

/* Content Management */
function initContent() {
    if (!el('banner-form')) return;

    const content = AppData.get('content');

    function loadBanners() {
        const container = el('banner-list');
        if (!container) return;
        container.innerHTML = content.banners.map((b, i) =>
            '<div class="notification-item" style="align-items:center;"><div class="notif-content" style="flex:1;"><p><strong>' + b.title + '</strong></p><p style="font-size:13px;color:#777;">' + b.description + '</p></div><button class="btn btn-sm btn-danger delete-banner" data-index="' + i + '"><i class="fas fa-trash"></i></button></div>'
        ).join('');

        document.querySelectorAll('.delete-banner').forEach(btn => {
            btn.addEventListener('click', () => {
                content.banners.splice(parseInt(btn.dataset.index), 1);
                AppData.save();
                loadBanners();
            });
        });
    }

    const bannerForm = el('banner-form');
    if (bannerForm) {
        bannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            content.banners.push({
                title: bannerForm.querySelector('[name="bannerTitle"]').value,
                image: bannerForm.querySelector('[name="bannerImage"]').value,
                description: bannerForm.querySelector('[name="bannerDesc"]').value
            });
            AppData.save();
            bannerForm.reset();
            loadBanners();
        });
    }
    loadBanners();

    function loadFaqs() {
        const container = el('faq-list');
        if (!container) return;
        container.innerHTML = content.faqs.map((f, i) =>
            '<div class="notification-item" style="align-items:center;"><div class="notif-content" style="flex:1;"><p><strong>' + f.question + '</strong></p><p style="font-size:13px;color:#777;">' + f.answer + '</p></div><button class="btn btn-sm btn-danger delete-faq" data-index="' + i + '"><i class="fas fa-trash"></i></button></div>'
        ).join('');

        document.querySelectorAll('.delete-faq').forEach(btn => {
            btn.addEventListener('click', () => {
                content.faqs.splice(parseInt(btn.dataset.index), 1);
                AppData.save();
                loadFaqs();
            });
        });
    }

    const faqForm = el('faq-form');
    if (faqForm) {
        faqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            content.faqs.push({
                question: faqForm.querySelector('[name="faqQuestion"]').value,
                answer: faqForm.querySelector('[name="faqAnswer"]').value
            });
            AppData.save();
            faqForm.reset();
            loadFaqs();
        });
    }
    loadFaqs();

    const policyForm = el('policy-form');
    if (policyForm) {
        const cancelInput = policyForm.querySelector('[name="cancellationPolicy"]');
        const rulesInput = policyForm.querySelector('[name="houseRules"]');
        if (cancelInput) cancelInput.value = content.cancellationPolicy;
        if (rulesInput) rulesInput.value = content.houseRules;

        policyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cancelInput) content.cancellationPolicy = cancelInput.value;
            if (rulesInput) content.houseRules = rulesInput.value;
            AppData.save();
            alert('Policies saved!');
        });
    }

    var revBody = el('reviews-moderation-body');
    if (revBody) {
        var reviews = AppData.get('reviews');
        revBody.innerHTML = reviews.map(function(r, i) {
            var stars = '';
            for (var s = 0; s < 5; s++) stars += '<i class="fas fa-star" style="color:' + (s < r.rating ? '#f39c12' : '#ddd') + ';"></i> ';
            return '<tr><td>' + AppData.sanitize(r.hostel) + '</td><td>' + stars + '</td><td>' + AppData.sanitize(r.comment) + '</td><td>' + formatDate(r.createdAt) + '</td><td>' + badge(r.status) + '</td><td class="action-btns">' +
                (r.status === 'pending' ? '<button class="btn btn-sm btn-success approve-review" data-index="' + i + '"><i class="fas fa-check"></i></button>' : '') +
                '<button class="btn btn-sm btn-danger delete-review" data-index="' + i + '"><i class="fas fa-trash"></i></button></td></tr>';
        }).join('');

        document.querySelectorAll('.approve-review').forEach(function(btn) {
            btn.addEventListener('click', function() {
                AppData.get('reviews')[parseInt(btn.dataset.index)].status = 'approved';
                AppData.save();
                el('reviews-moderation-body').innerHTML = '';
                initContent();
            });
        });
        document.querySelectorAll('.delete-review').forEach(function(btn) {
            btn.addEventListener('click', function() {
                AppData.get('reviews').splice(parseInt(btn.dataset.index), 1);
                AppData.save();
                el('reviews-moderation-body').innerHTML = '';
                initContent();
            });
        });
    }

    const announceForm = el('announcement-form');
    if (announceForm) {
        const announceInput = announceForm.querySelector('[name="announcement"]');
        if (announceInput) announceInput.value = content.announcement;
        announceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (announceInput) content.announcement = announceInput.value;
            AppData.save();
            alert('Announcement published!');
        });
    }
}

/* Audit Logs */
function initAuditLogs() {
    const tbody = el('audit-logs-body');
    if (!tbody) return;

    const logs = AppData.get('auditLogs');
    const badgeAction = { create: 'badge-success', update: 'badge-warning', delete: 'badge-danger', cancel: 'badge-danger', login: 'badge-info', register: 'badge-info' };

    tbody.innerHTML = logs.map(log =>
        '<tr><td>' + formatDateTime(log.timestamp) + '</td><td>' + log.user + '</td><td><span class="badge ' + (badgeAction[log.action] || 'badge-secondary') + '">' + log.action.charAt(0).toUpperCase() + log.action.slice(1) + '</span></td><td>' + log.resource + '</td><td>' + log.details + '</td><td>' + log.ip + '</td></tr>'
    ).join('');
}

/* Settings */
function initSettings() {
    const form = el('settings-form');
    if (!form) return;

    const settings = AppData.get('settings');

    const fields = {
        siteName: form.querySelector('[name="siteName"]'),
        currency: form.querySelector('[name="currency"]'),
        taxRate: form.querySelector('[name="taxRate"]'),
        checkIn: form.querySelector('[name="checkIn"]'),
        checkOut: form.querySelector('[name="checkOut"]'),
        maxNights: form.querySelector('[name="maxNights"]'),
        maxGuests: form.querySelector('[name="maxGuests"]'),
        advanceBooking: form.querySelector('[name="advanceBooking"]'),
        cancellationPeriod: form.querySelector('[name="cancellationPeriod"]'),
        smtpHost: form.querySelector('[name="smtpHost"]'),
        smtpPort: form.querySelector('[name="smtpPort"]'),
        smtpSecurity: form.querySelector('[name="smtpSecurity"]'),
        fromEmail: form.querySelector('[name="fromEmail"]'),
        paymentGatewayKey: form.querySelector('[name="paymentGatewayKey"]'),
        googleMapsKey: form.querySelector('[name="googleMapsKey"]'),
        smsEnabled: form.querySelector('[name="smsEnabled"]')
    };

    for (const key in fields) {
        if (fields[key]) {
            if (fields[key].type === 'checkbox') fields[key].checked = settings[key];
            else fields[key].value = settings[key] || '';
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {};
        for (const key in fields) {
            if (fields[key]) {
                updated[key] = fields[key].type === 'checkbox' ? fields[key].checked : fields[key].value;
            }
        }
        AppData.set('settings', updated);
        AppData.addLog('admin@pamalo.com', 'update', 'Settings', 'Updated system settings', '');
        alert('Settings saved!');
    });

    var backupBtn = el('btn-backup');
    if (backupBtn) backupBtn.addEventListener('click', function() { AppData.backup(); });

    var restoreBtn = el('btn-restore');
    var restoreFile = el('restore-file');
    if (restoreBtn && restoreFile) {
        restoreBtn.addEventListener('click', function() {
            if (!restoreFile.files || !restoreFile.files[0]) { alert('Please select a backup file.'); return; }
            var reader = new FileReader();
            reader.onload = function(e) {
                var result = AppData.restore(e.target.result);
                if (result.ok) { alert('Data restored successfully! Reloading...'); location.reload(); }
                else { alert('Restore failed: ' + result.error); }
            };
            reader.readAsText(restoreFile.files[0]);
        });
    }
}

/* Auth - Login */
function initLogin() {
    var form = el('login-form');
    if (!form) return;
    var session = AppData.getSession();
    if (session) {
        var redirects = { admin: '../admin/dashboard.html', staff: '../admin/dashboard.html', guest: '../dashboard.html' };
        window.location.href = redirects[session.role] || '../dashboard.html';
        return;
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = form.querySelector('[name="email"]').value;
        var password = form.querySelector('[name="password"]').value;
        var errEl = el('login-error');
        var result = AppData.login(email, password);
        if (result.ok) {
            var redirects = { admin: 'admin/dashboard.html', staff: 'admin/dashboard.html', guest: 'dashboard.html' };
            window.location.href = redirects[result.user.role] || 'dashboard.html';
        } else {
            errEl.textContent = result.error;
            errEl.className = 'alert alert-danger';
            errEl.style.display = 'block';
        }
    });
}

/* Auth - Signup */
function initSignup() {
    var form = el('signup-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var firstName = form.querySelector('[name="firstName"]').value;
        var lastName = form.querySelector('[name="lastName"]').value;
        var email = form.querySelector('[name="email"]').value;
        var phone = form.querySelector('[name="phone"]').value;
        var password = form.querySelector('[name="password"]').value;
        var confirm = form.querySelector('[name="confirmPassword"]').value;
        var errEl = el('signup-error');
        var successEl = el('signup-success');
        errEl.style.display = 'none';
        successEl.style.display = 'none';

        if (!AppData.validateEmail(email)) { errEl.textContent = 'Invalid email address.'; errEl.style.display = 'block'; return; }
        if (password !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
        if (!AppData.validatePassword(password)) { errEl.textContent = 'Password must be at least 6 characters.'; errEl.style.display = 'block'; return; }

        var result = AppData.register(firstName, lastName, email, phone, password);
        if (result.ok) {
            successEl.textContent = 'Account created! Redirecting to login...';
            successEl.style.display = 'block';
            form.reset();
            setTimeout(function() { window.location.href = 'Login.html'; }, 1500);
        } else {
            errEl.textContent = result.error;
            errEl.style.display = 'block';
        }
    });
}

/* Auth - Password Reset */
function initResetPassword() {
    var reqForm = el('reset-request-form');
    var compForm = el('reset-complete-form');
    if (!reqForm && !compForm) return;

    if (reqForm) {
        reqForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = reqForm.querySelector('[name="email"]').value;
            var errEl = el('reset-error');
            var successEl = el('reset-success');
            errEl.style.display = 'none';
            successEl.style.display = 'none';

            var result = AppData.requestPasswordReset(email);
            if (result.ok) {
                successEl.innerHTML = 'Reset code sent to ' + email + '.<br><strong>Debug code: ' + result.code + '</strong>';
                successEl.style.display = 'block';
                reqForm.style.display = 'none';
                compForm.style.display = 'block';
                compForm.querySelector('[name="email"]').value = email;
            } else {
                errEl.textContent = result.error;
                errEl.style.display = 'block';
            }
        });
    }

    if (compForm) {
        compForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = compForm.querySelector('[name="email"]').value;
            var code = compForm.querySelector('[name="code"]').value;
            var newPw = compForm.querySelector('[name="newPassword"]').value;
            var confirmPw = compForm.querySelector('[name="confirmPassword"]').value;
            var errEl = el('reset-error');
            var successEl = el('reset-success');
            errEl.style.display = 'none';
            successEl.style.display = 'none';

            if (newPw !== confirmPw) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
            var result = AppData.resetPassword(email, code, newPw);
            if (result.ok) {
                successEl.innerHTML = 'Password reset successful! <a href="Login.html" style="color:#009272;">Log in here</a>.';
                successEl.style.display = 'block';
                compForm.style.display = 'none';
            } else {
                errEl.textContent = result.error;
                errEl.style.display = 'block';
            }
        });
    }
}

/* Hostel Search */
function initHostelSearch() {
    var container = el('room-results');
    if (!container) return;

    function render(filterData) {
        var checkIn = (filterData && filterData.checkIn) || el('filter-checkin').value;
        var checkOut = (filterData && filterData.checkOut) || el('filter-checkout').value;
        var maxPrice = (filterData && filterData.maxPrice) || el('filter-price').value;
        var capacity = (filterData && filterData.capacity) || el('filter-capacity').value;
        var type = (filterData && filterData.type) || el('filter-type').value;

        var filters = {};
        if (maxPrice) filters.maxPrice = maxPrice;
        if (capacity) filters.capacity = capacity;
        if (type) filters.type = type;

        var available = AppData.getAvailableRooms(checkIn, checkOut, filters);
        var infoEl = el('search-results-info');
        infoEl.textContent = available.length > 0 ? available.length + ' room(s) available' : 'No rooms match your criteria.';

        container.innerHTML = available.map(function(r) {
            return '<div class="hostel-card" style="background-image:url(\'../assets/media/bedroom_10.jpg\');">' +
                '<div class="hostel-card-content">' +
                '<h3>' + r.hostel + ' - ' + r.type + '</h3>' +
                '<p>' + r.description + '</p>' +
                '<p style="font-size:13px;color:#ccc;">Capacity: ' + r.capacity + ' guest(s) | Amenities: ' + (r.amenities || []).join(', ') + '</p>' +
                '<p style="font-size:20px;font-weight:bold;color:#fff;margin:10px 0;">' + mk(r.price) + ' / night</p>' +
                '<button class="btn-book-now" data-room=\'' + JSON.stringify(r) + '\' style="background:#009272;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">Book Now</button>' +
                '</div></div>';
        }).join('');

        document.querySelectorAll('.btn-book-now').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var session = AppData.getSession();
                if (!session) { window.location.href = 'Login.html'; return; }
                var room = JSON.parse(btn.dataset.room);
                var checkInVal = el('filter-checkin').value || today();
                var checkOutVal = el('filter-checkout').value || (function() { var d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })();
                var amount = AppData.calculateCost(room.id, checkInVal, checkOutVal);
                if (confirm('Book ' + room.type + ' at ' + room.hostel + '?\n' + checkInVal + ' to ' + checkOutVal + '\nTotal: ' + mk(amount))) {
                    var result = AppData.createBooking(session.user.id, room.hostel, room.type, checkInVal, checkOutVal, 1, '', amount);
                    if (result.ok) { alert('Booking created! ID: ' + result.booking.id + '\nTotal: ' + mk(amount)); } else { alert(result.error); }
                    render();
                }
            });
        });
    }

    el('search-btn').addEventListener('click', function() { render(); });
    render();
}

/* Contact Form */
function initContact() {
    var form = el('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var name = form.querySelector('[name="name"]').value;
        var email = form.querySelector('[name="email"]').value;
        var subject = form.querySelector('[name="subject"]').value;
        var message = form.querySelector('[name="message"]').value;
        var alertEl = el('contact-alert');

        if (!AppData.validateEmail(email)) { alertEl.textContent = 'Please enter a valid email.'; alertEl.className = 'alert alert-danger'; alertEl.style.display = 'block'; return; }
        AppData.submitContact(name, email, subject, message);
        alertEl.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent. We will get back to you soon.';
        alertEl.className = 'alert alert-success';
        alertEl.style.display = 'block';
        form.reset();
    });
}

/* Reviews */
function initReviews() {
    var form = el('review-form');
    var container = el('reviews-container');
    if (!form && !container) return;

    if (container) {
        var params = new URLSearchParams(window.location.search);
        var bookingId = params.get('id') || 'BK-001';
        var booking = AppData.getById('bookings', bookingId);
        if (booking) {
            var reviews = AppData.getReviewsByHostel(booking.hostel);
            var avg = AppData.getAvgRating(booking.hostel);
            container.innerHTML = reviews.length ? '<p style="margin-bottom:15px;color:#555;"><strong>Average Rating: ' + avg + ' / 5</strong> (' + reviews.length + ' reviews)</p>' + reviews.map(function(r) {
                var stars = '';
                for (var i = 0; i < 5; i++) stars += '<i class="fas fa-star" style="color:' + (i < r.rating ? '#f39c12' : '#ddd') + ';"></i> ';
                return '<div class="notification-item"><div class="notif-content"><p>' + stars + '</p><p>' + AppData.sanitize(r.comment) + '</p><span class="notif-time">' + formatDate(r.createdAt) + '</span></div></div>';
            }).join('') : '<p style="color:#999;">No reviews yet.</p>';
        }
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var session = AppData.getSession();
            if (!session) { alert('Please log in to leave a review.'); return; }
            var params = new URLSearchParams(window.location.search);
            var bookingId = params.get('id') || 'BK-001';
            var booking = AppData.getById('bookings', bookingId);
            if (!booking) return;
            if (AppData.hasUserReviewed(session.user.id, booking.hostel)) { alert('You have already reviewed this hostel.'); return; }

            var rating = parseInt(form.querySelector('[name="rating"]').value);
            var comment = form.querySelector('[name="comment"]').value;
            var result = AppData.addReview(session.user.id, booking.hostel, rating, AppData.sanitize(comment));
            if (result.ok) {
                alert('Review submitted! It will appear after approval.');
                form.reset();
                initReviews();
            }
        });
    }
}
