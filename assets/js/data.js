var AppData = {
    _data: null,

    init() {
        var stored = localStorage.getItem('pamalo_data');
        if (stored) {
            this._data = JSON.parse(stored);
            if (!this._data.reviews) this._data.reviews = [];
            if (!this._data.contacts) this._data.contacts = [];
            if (!this._data.sessions) this._data.sessions = [];
            if (!this._data.passwordResets) this._data.passwordResets = [];
        } else {
            this._data = this.defaults();
            this.save();
        }
        this.cleanExpiredSessions();
    },

    defaults() {
        return {
            users: [
                { id: 'USR-001', firstName: 'Admin', lastName: 'User', email: 'admin@pamalo.com', phone: '+265 999 000 001', password: btoa('Admin123!'), role: 'admin', status: 'active', joined: '2025-12-01' },
                { id: 'USR-002', firstName: 'Staff', lastName: 'One', email: 'staff@pamalo.com', phone: '+265 999 000 002', password: btoa('Staff123!'), role: 'staff', status: 'active', joined: '2026-01-15' },
                { id: 'USR-003', firstName: 'John', lastName: 'Doe', email: 'john@email.com', phone: '+265 999 000 003', password: btoa('Guest123!'), role: 'guest', status: 'active', joined: '2026-01-20' },
                { id: 'USR-004', firstName: 'Jane', lastName: 'Smith', email: 'jane@email.com', phone: '+265 999 000 004', password: btoa('Guest123!'), role: 'guest', status: 'active', joined: '2026-02-03' },
                { id: 'USR-005', firstName: 'Bob', lastName: 'Wilson', email: 'bob@email.com', phone: '+265 999 000 005', password: btoa('Guest123!'), role: 'guest', status: 'suspended', joined: '2026-03-20' },
                { id: 'USR-006', firstName: 'Alice', lastName: 'Brown', email: 'alice@email.com', phone: '+265 999 000 006', password: btoa('Guest123!'), role: 'guest', status: 'active', joined: '2026-04-12' }
            ],
            profile: { firstName: 'Guest', lastName: 'User', email: 'guest@email.com', phone: '+265 000 000 000', bio: '' },
            preferences: { emailNotif: true, smsNotif: true, promotions: false },
            bookings: [
                { id: 'BK-001', userId: 'USR-003', hostel: 'Cozy Hostel', room: 'Single Room', checkIn: '2026-06-15', checkOut: '2026-06-20', guests: 1, specialRequests: '', amount: 175000, status: 'active', paymentStatus: 'paid', paymentMethod: 'Airtel Money', paidOn: '2026-06-10', createdAt: '2026-06-08T10:00:00' },
                { id: 'BK-002', userId: 'USR-004', hostel: 'Luxury Hostel', room: 'Double Room', checkIn: '2026-06-22', checkOut: '2026-06-28', guests: 2, specialRequests: 'Extra towels please', amount: 510000, status: 'upcoming', paymentStatus: 'pending', paymentMethod: '', paidOn: '', createdAt: '2026-06-07T14:00:00' },
                { id: 'BK-003', userId: 'USR-003', hostel: 'City Hostel', room: 'Shared Dorm', checkIn: '2026-05-01', checkOut: '2026-05-05', guests: 1, specialRequests: '', amount: 68000, status: 'completed', paymentStatus: 'paid', paymentMethod: 'TNM Mpamba', paidOn: '2026-04-28', createdAt: '2026-04-25T09:00:00' },
                { id: 'BK-004', userId: 'USR-006', hostel: 'Cozy Hostel', room: 'Single Room', checkIn: '2026-04-10', checkOut: '2026-04-15', guests: 1, specialRequests: '', amount: 175000, status: 'completed', paymentStatus: 'paid', paymentMethod: 'Credit Card', paidOn: '2026-04-08', createdAt: '2026-04-05T11:00:00' },
                { id: 'BK-005', userId: 'USR-003', hostel: 'Luxury Hostel', room: 'Double Room', checkIn: '2026-03-03', checkOut: '2026-03-08', guests: 2, specialRequests: '', amount: 425000, status: 'cancelled', paymentStatus: 'refunded', paymentMethod: 'Airtel Money', paidOn: '2026-03-01', createdAt: '2026-02-28T16:00:00' }
            ],
            notifications: [
                { id: 'N-001', userId: 'USR-003', type: 'booking', title: 'Booking Confirmed', message: 'Your reservation at Cozy Hostel (Jun 15-20) has been confirmed.', time: '2026-06-13T12:00:00', read: false },
                { id: 'N-002', userId: 'USR-003', type: 'payment', title: 'Payment Reminder', message: 'Your payment for Luxury Hostel (Jun 22-28) is due in 3 days.', time: '2026-06-12T10:00:00', read: false },
                { id: 'N-003', userId: 'USR-003', type: 'reminder', title: 'Check-in Reminder', message: 'You check in to Cozy Hostel tomorrow. Prepare for your stay!', time: '2026-06-14T08:00:00', read: false },
                { id: 'N-004', userId: 'USR-003', type: 'booking', title: 'Booking Cancelled', message: 'Your booking at City Hostel (May 1-5) has been cancelled.', time: '2026-06-10T09:00:00', read: true },
                { id: 'N-005', userId: 'USR-003', type: 'payment', title: 'Payment Received', message: 'Your payment of MK 175,000 for Cozy Hostel has been processed.', time: '2026-06-08T14:00:00', read: true },
                { id: 'N-006', userId: 'USR-003', type: 'system', title: 'Rate Your Stay', message: 'How was your stay at Cozy Hostel? Leave a review!', time: '2026-06-06T11:00:00', read: true },
                { id: 'N-007', userId: 'USR-003', type: 'system', title: 'System Update', message: 'New features added to your dashboard.', time: '2026-05-30T16:00:00', read: true }
            ],
            rooms: [
                { id: 'RM-101', hostel: 'Cozy Hostel', type: 'Single Room', capacity: 1, price: 35000, amenities: ['WiFi', 'Desk', 'Fan'], status: 'available', description: 'Cozy single room with a comfortable bed and desk.', images: [] },
                { id: 'RM-102', hostel: 'Cozy Hostel', type: 'Double Room', capacity: 2, price: 55000, amenities: ['WiFi', 'TV', 'Fan'], status: 'available', description: 'Spacious double room with two beds.', images: [] },
                { id: 'RM-201', hostel: 'Luxury Hostel', type: 'Double Room', capacity: 2, price: 85000, amenities: ['WiFi', 'TV', 'AC', 'Ensuite'], status: 'available', description: 'Luxury double room with ensuite bathroom.', images: [] },
                { id: 'RM-202', hostel: 'Luxury Hostel', type: 'Suite', capacity: 4, price: 140000, amenities: ['WiFi', 'TV', 'AC', 'Kitchen', 'Living Room'], status: 'available', description: 'Premium suite with living area and kitchenette.', images: [] },
                { id: 'RM-301', hostel: 'City Hostel', type: 'Shared Dorm', capacity: 6, price: 17000, amenities: ['WiFi', 'Locker', 'Fan'], status: 'maintenance', description: 'Shared dormitory with lockers.', images: [] },
                { id: 'RM-302', hostel: 'City Hostel', type: 'Single Room', capacity: 1, price: 24000, amenities: ['WiFi', 'Fan'], status: 'disabled', description: 'Budget single room.', images: [] }
            ],
            payments: [
                { id: 'TXN-001', booking: 'BK-001', guest: 'John Doe', amount: 175000, method: 'Airtel Money', date: '2026-06-10', status: 'completed' },
                { id: 'TXN-002', booking: 'BK-003', guest: 'Bob Wilson', amount: 68000, method: 'TNM Mpamba', date: '2026-04-28', status: 'completed' },
                { id: 'TXN-003', booking: 'BK-002', guest: 'Jane Smith', amount: 510000, method: 'TNM Mpamba', date: '2026-06-07', status: 'pending' },
                { id: 'TXN-004', booking: 'BK-004', guest: 'Alice Brown', amount: 175000, method: 'Credit Card', date: '2026-04-08', status: 'completed' },
                { id: 'TXN-005', booking: 'BK-005', guest: 'Charlie Davis', amount: 425000, method: 'Airtel Money', date: '2026-03-01', status: 'refunded' }
            ],
            reviews: [
                { id: 'REV-001', userId: 'USR-003', hostel: 'Cozy Hostel', rating: 5, comment: 'Great stay! Clean rooms and friendly staff.', createdAt: '2026-04-16', status: 'approved' },
                { id: 'REV-002', userId: 'USR-006', hostel: 'Cozy Hostel', rating: 4, comment: 'Nice place, good value for money.', createdAt: '2026-04-16', status: 'approved' },
                { id: 'REV-003', userId: 'USR-003', hostel: 'City Hostel', rating: 3, comment: 'Decent hostel but could be cleaner.', createdAt: '2026-05-06', status: 'pending' },
                { id: 'REV-004', userId: 'USR-003', hostel: 'Luxury Hostel', rating: 5, comment: 'Amazing experience! Will come again.', createdAt: '2026-03-09', status: 'approved' }
            ],
            contacts: [
                { id: 'CON-001', name: 'Test User', email: 'test@email.com', subject: 'Question about booking', message: 'How do I extend my stay?', createdAt: '2026-06-12T10:00:00', status: 'unread' }
            ],
            hostelList: [
                { id: 'H-001', name: 'Cozy Hostel', description: 'Experience comfort and affordability at Cozy Hostel, located in the heart of the city.', location: 'Area 47, Lilongwe', image: '../assets/media/bedroom_10.jpg', amenities: ['WiFi', 'Breakfast', 'Parking'] },
                { id: 'H-002', name: 'Luxury Hostel', description: 'Premium accommodation with top-notch amenities and services.', location: 'City Center, Lilongwe', image: '../assets/media/bedroom_15.jpg', amenities: ['WiFi', 'AC', 'Restaurant', 'Gym'] },
                { id: 'H-003', name: 'City Hostel', description: 'Budget-friendly stay in the heart of the city, perfect for backpackers.', location: 'Downtown, Lilongwe', image: '../assets/media/bedroom_214.jpg', amenities: ['WiFi', 'Common Room', 'Kitchen'] }
            ],
            auditLogs: [
                { timestamp: '2026-06-13T14:30', user: 'admin@pamalo.com', action: 'create', resource: 'Room RM-103', details: 'Added new single room to Cozy Hostel', ip: '192.168.1.10' },
                { timestamp: '2026-06-13T12:15', user: 'admin@pamalo.com', action: 'update', resource: 'Booking BK-002', details: 'Approved pending booking', ip: '192.168.1.10' },
                { timestamp: '2026-06-12T16:45', user: 'admin@pamalo.com', action: 'delete', resource: 'Room RM-302', details: 'Disabled room listing', ip: '192.168.1.10' }
            ],
            sessions: [],
            passwordResets: [],
            settings: {
                currency: 'MK', taxRate: 16, checkIn: '14:00', checkOut: '11:00', siteName: 'Pamalo Hostel Booking System',
                maxNights: 30, maxGuests: 6, advanceBooking: 90, cancellationPeriod: 48,
                smtpHost: 'smtp.pamalo.com', smtpPort: 587, smtpSecurity: 'TLS', fromEmail: 'noreply@pamalo.com',
                paymentGatewayKey: '', googleMapsKey: '', smsEnabled: true
            },
            content: {
                banners: [
                    { title: 'Welcome to Pamalo Hostel Booking System', image: '../assets/media/bedroom_10.jpg', description: 'Your one-stop solution for booking hostels with ease and convenience.' },
                    { title: 'Affordable Stays', image: '../assets/media/bedroom_15.jpg', description: 'Find the best rates for your next adventure.' }
                ],
                faqs: [
                    { question: 'How do I book a hostel?', answer: 'Browse our hostels, select dates, and complete the booking form.' },
                    { question: 'What payment methods are accepted?', answer: 'Credit Card, Airtel Money, and TNM Mpamba.' },
                    { question: 'Can I cancel my booking?', answer: 'Yes, up to 48 hours before check-in for a full refund.' }
                ],
                cancellationPolicy: 'Guests may cancel up to 48 hours before check-in for a full refund. Cancellations within 48 hours incur a 50% charge. No-shows are charged the full amount.',
                houseRules: 'No smoking inside rooms. Quiet hours from 10 PM to 7 AM.',
                announcement: ''
            }
        };
    },

    /* Persistence */
    save() { localStorage.setItem('pamalo_data', JSON.stringify(this._data)); },

    get(key) { return this._data[key]; },
    set(key, val) { this._data[key] = val; this.save(); },

    getById(collection, id) {
        return this._data[collection].find(function(item) { return item.id === id; });
    },

    addItem(collection, item) { this._data[collection].push(item); this.save(); return item; },

    updateItem(collection, id, updates) {
        var idx = this._data[collection].findIndex(function(item) { return item.id === id; });
        if (idx !== -1) {
            this._data[collection][idx] = Object.assign({}, this._data[collection][idx], updates);
            this.save();
            return this._data[collection][idx];
        }
        return null;
    },

    deleteItem(collection, id) {
        var idx = this._data[collection].findIndex(function(item) { return item.id === id; });
        if (idx !== -1) { this._data[collection].splice(idx, 1); this.save(); return true; }
        return false;
    },

    /* Auth */
    register(firstName, lastName, email, phone, password) {
        var users = this._data.users;
        if (users.find(function(u) { return u.email === email; })) return { ok: false, error: 'Email already registered.' };
        if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
        var user = {
            id: 'USR-' + String(Date.now()).slice(-4),
            firstName: firstName, lastName: lastName, email: email, phone: phone,
            password: btoa(password), role: 'guest', status: 'active', joined: today()
        };
        users.push(user);
        this.save();
        this.addLog(email, 'register', 'Account', 'New user registration', '');
        return { ok: true };
    },

    login(email, password) {
        var user = this._data.users.find(function(u) { return u.email === email; });
        if (!user) return { ok: false, error: 'Account not found.' };
        if (user.status === 'suspended') return { ok: false, error: 'Your account has been suspended.' };
        if (user.password !== btoa(password)) return { ok: false, error: 'Incorrect password.' };
        var token = 'tok_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this._data.sessions.push({ token: token, userId: user.id, email: user.email, role: user.role, createdAt: new Date().toISOString() });
        this.save();
        localStorage.setItem('pamalo_session', token);
        this.addLog(email, 'login', 'Account', 'User logged in successfully', '');
        return { ok: true, user: user, token: token };
    },

    logout() {
        var token = localStorage.getItem('pamalo_session');
        if (token) {
            this._data.sessions = this._data.sessions.filter(function(s) { return s.token !== token; });
            this.save();
        }
        localStorage.removeItem('pamalo_session');
    },

    getSession() {
        var token = localStorage.getItem('pamalo_session');
        if (!token) return null;
        var session = this._data.sessions.find(function(s) { return s.token === token; });
        if (!session) { localStorage.removeItem('pamalo_session'); return null; }
        var user = this._data.users.find(function(u) { return u.id === session.userId; });
        if (!user || user.status !== 'active') { this.logout(); return null; }
        return { user: user, role: user.role, token: token };
    },

    cleanExpiredSessions() {
        var cutoff = Date.now() - 86400000 * 7;
        this._data.sessions = this._data.sessions.filter(function(s) {
            return new Date(s.createdAt).getTime() > cutoff;
        });
    },

    requireRole(roles) {
        var session = this.getSession();
        if (!session) { window.location.href = '../Login.html'; return null; }
        if (roles && roles.indexOf(session.role) === -1) { alert('Access denied.'); window.location.href = '../index.html'; return null; }
        return session;
    },

    requestPasswordReset(email) {
        var user = this._data.users.find(function(u) { return u.email === email; });
        if (!user) return { ok: false, error: 'Email not found.' };
        var code = Math.random().toString(36).substr(2, 8).toUpperCase();
        this._data.passwordResets.push({ email: email, code: code, expires: Date.now() + 3600000, used: false });
        this.save();
        return { ok: true, code: code };
    },

    resetPassword(email, code, newPassword) {
        var reset = this._data.passwordResets.find(function(r) {
            return r.email === email && r.code === code && !r.used && r.expires > Date.now();
        });
        if (!reset) return { ok: false, error: 'Invalid or expired reset code.' };
        reset.used = true;
        var user = this._data.users.find(function(u) { return u.email === email; });
        if (user) user.password = btoa(newPassword);
        this.save();
        this.addLog(email, 'update', 'Password', 'Password reset completed', '');
        return { ok: true };
    },

    /* Bookings */
    createBooking(userId, hostel, room, checkIn, checkOut, guests, specialRequests, amount) {
        if (this.isDoubleBooked(hostel, room, checkIn, checkOut)) {
            return { ok: false, error: 'This room is already booked for the selected dates.' };
        }
        var nights = this.nightsBetween(checkIn, checkOut);
        if (nights < 1) return { ok: false, error: 'Check-out must be after check-in.' };
        var maxNights = this._data.settings.maxNights;
        if (nights > maxNights) return { ok: false, error: 'Maximum ' + maxNights + ' nights per booking.' };
        var booking = {
            id: 'BK-' + String(Date.now()).slice(-4),
            userId: userId, hostel: hostel, room: room,
            checkIn: checkIn, checkOut: checkOut,
            guests: guests, specialRequests: specialRequests || '',
            amount: amount, status: 'active',
            paymentStatus: 'pending', paymentMethod: '', paidOn: '',
            createdAt: new Date().toISOString()
        };
        this._data.bookings.push(booking);
        this.addNotification(userId, 'booking', 'Booking Confirmed', 'Your reservation at ' + hostel + ' (' + checkIn + ' to ' + checkOut + ') has been confirmed.');
        this.save();
        return { ok: true, booking: booking };
    },

    isDoubleBooked(hostel, room, checkIn, checkOut) {
        return this._data.bookings.some(function(b) {
            if (b.hostel !== hostel || b.room !== room) return false;
            if (b.status === 'cancelled' || b.status === 'completed') return false;
            return b.checkIn < checkOut && b.checkOut > checkIn;
        });
    },

    cancelBooking(bookingId) {
        var booking = this.getById('bookings', bookingId);
        if (!booking) return { ok: false, error: 'Booking not found.' };
        var hoursUntil = (new Date(booking.checkIn) - Date.now()) / 3600000;
        var cancelPeriod = this._data.settings.cancellationPeriod;
        if (hoursUntil < cancelPeriod) {
            return { ok: false, error: 'Cancellation period of ' + cancelPeriod + ' hours has passed. Partial charges may apply.' };
        }
        this.updateItem('bookings', bookingId, { status: 'cancelled', paymentStatus: 'refunded' });
        this.addNotification(booking.userId, 'booking', 'Booking Cancelled', 'Your booking at ' + booking.hostel + ' has been cancelled.');
        var session = this.getSession();
        this.addLog(session ? session.user.email : 'system', 'cancel', 'Booking ' + bookingId, 'Booking cancelled', '');
        return { ok: true };
    },

    calculateCost(roomId, checkIn, checkOut) {
        var room = this.getById('rooms', roomId);
        if (!room) return 0;
        var nights = this.nightsBetween(checkIn, checkOut);
        return room.price * nights;
    },

    nightsBetween(checkIn, checkOut) {
        return Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    },

    getAvailableRooms(checkIn, checkOut, filters) {
        var rooms = this._data.rooms.filter(function(r) { return r.status === 'available'; });
        if (checkIn && checkOut) {
            rooms = rooms.filter(function(room) {
                return !AppData._data.bookings.some(function(b) {
                    if (b.hostel !== room.hostel || b.room !== room.type) return false;
                    if (b.status === 'cancelled' || b.status === 'completed') return false;
                    return b.checkIn < checkOut && b.checkOut > checkIn;
                });
            });
        }
        if (filters) {
            if (filters.hostel) rooms = rooms.filter(function(r) { return r.hostel === filters.hostel; });
            if (filters.maxPrice) rooms = rooms.filter(function(r) { return r.price <= parseInt(filters.maxPrice); });
            if (filters.minPrice) rooms = rooms.filter(function(r) { return r.price >= parseInt(filters.minPrice); });
            if (filters.capacity) rooms = rooms.filter(function(r) { return r.capacity >= parseInt(filters.capacity); });
            if (filters.type) rooms = rooms.filter(function(r) { return r.type === filters.type; });
            if (filters.amenity) rooms = rooms.filter(function(r) { return r.amenities.indexOf(filters.amenity) !== -1; });
        }
        return rooms;
    },

    /* Reviews */
    addReview(userId, hostel, rating, comment) {
        var review = {
            id: 'REV-' + String(Date.now()).slice(-4),
            userId: userId, hostel: hostel, rating: rating,
            comment: comment, createdAt: new Date().toISOString(), status: 'pending'
        };
        this._data.reviews.push(review);
        this.save();
        return { ok: true, review: review };
    },

    getReviewsByHostel(hostel) {
        return this._data.reviews.filter(function(r) { return r.hostel === hostel && r.status === 'approved'; });
    },

    getAvgRating(hostel) {
        var reviews = this.getReviewsByHostel(hostel);
        if (!reviews.length) return 0;
        var sum = reviews.reduce(function(s, r) { return s + r.rating; }, 0);
        return (sum / reviews.length).toFixed(1);
    },

    hasUserReviewed(userId, hostel) {
        return this._data.reviews.some(function(r) { return r.userId === userId && r.hostel === hostel; });
    },

    /* Contact */
    submitContact(name, email, subject, message) {
        var contact = {
            id: 'CON-' + String(Date.now()).slice(-4),
            name: name, email: email, subject: subject,
            message: message, createdAt: new Date().toISOString(), status: 'unread'
        };
        this._data.contacts.push(contact);
        this.save();
        return { ok: true };
    },

    /* Notifications */
    addNotification(userId, type, title, message) {
        var notif = {
            id: 'N-' + String(Date.now()).slice(-4),
            userId: userId, type: type, title: title,
            message: message, time: new Date().toISOString(), read: false
        };
        this._data.notifications.push(notif);
        this.save();
    },

    getNotificationsForUser(userId) {
        return this._data.notifications.filter(function(n) { return n.userId === userId; });
    },

    markAllNotificationsRead(userId) {
        this._data.notifications.forEach(function(n) {
            if (n.userId === userId) n.read = true;
        });
        this.save();
    },

    /* Logging */
    addLog(user, action, resource, details, ip) {
        this._data.auditLogs.unshift({
            timestamp: new Date().toISOString(),
            user: user || 'system', action: action,
            resource: resource, details: details,
            ip: ip || '127.0.0.1'
        });
        this.save();
    },

    /* Export */
    exportToCSV(collection, filename) {
        var items = this._data[collection];
        if (!items || !items.length) return;
        var headers = Object.keys(items[0]);
        var csv = headers.join(',') + '\n';
        csv += items.map(function(row) {
            return headers.map(function(h) {
                var val = row[h] || '';
                val = String(val).replace(/"/g, '""');
                if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) val = '"' + val + '"';
                return val;
            }).join(',');
        }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || collection + '_export.csv';
        link.click();
    },

    /* Backup / Restore */
    backup() {
        var blob = new Blob([JSON.stringify(this._data, null, 2)], { type: 'application/json' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pamalo_backup_' + today() + '.json';
        link.click();
    },

    restore(jsonData) {
        try {
            var data = JSON.parse(jsonData);
            if (!data.users || !data.bookings || !data.rooms) return { ok: false, error: 'Invalid backup file.' };
            this._data = data;
            this.save();
            return { ok: true };
        } catch (e) {
            return { ok: false, error: 'Invalid JSON format.' };
        }
    },

    /* Validation */
    validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); },
    validatePhone(phone) { return /^[\+\d\s\-]{7,20}$/.test(phone); },
    validatePassword(pw) { return pw.length >= 6; },
    sanitize(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    },

    /* Check role */
    hasRole(role) {
        var session = this.getSession();
        return session && session.role === role;
    },

    hasAnyRole(roles) {
        var session = this.getSession();
        return session && roles.indexOf(session.role) !== -1;
    },

    requireAuth(redirectTo) {
        var session = this.getSession();
        if (!session) {
            window.location.href = redirectTo || 'Login.html';
            return null;
        }
        return session;
    }
};

/* Utility functions */
function mk(amount) { return 'MK ' + Number(amount).toLocaleString(); }
function today() { return new Date().toISOString().split('T')[0]; }
function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatDateTime(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(dateStr) {
    var diff = Date.now() - new Date(dateStr).getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + ' hours ago';
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + ' days ago';
    return formatDate(dateStr);
}
function badge(status) {
    var map = { active: 'badge-success', paid: 'badge-success', completed: 'badge-success', approved: 'badge-success', available: 'badge-success', upcoming: 'badge-warning', pending: 'badge-warning', maintenance: 'badge-warning', unread: 'badge-warning', cancelled: 'badge-danger', refunded: 'badge-danger', suspended: 'badge-danger', failed: 'badge-danger', disabled: 'badge-secondary', inactive: 'badge-secondary' };
    var cls = map[status] || 'badge-secondary';
    var label = status.charAt(0).toUpperCase() + status.slice(1);
    return '<span class="badge ' + cls + '">' + label + '</span>';
}

/* --- PAGE INITIALIZATION --- */
(function() {
    function qs(id) { return document.getElementById(id); }
    function qsa(sel) { return document.querySelectorAll(sel); }

    /* Auth pages */
    function initLogin() {
        qs('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            var email = this.email.value;
            var password = this.password.value;
            var result = AppData.login(email, password);
            if (result.ok) {
                var role = result.user.role;
                if (role === 'admin' || role === 'staff') window.location.href = 'admin.html';
                else window.location.href = 'dashboard.html';
            } else {
                var err = qs('login-error');
                err.textContent = result.error;
                err.style.display = 'block';
            }
        });
    }

    function initSignup() {
        qs('signup-form').addEventListener('submit', function(e) {
            e.preventDefault();
            var firstName = this.firstName.value;
            var lastName = this.lastName.value;
            var email = this.email.value;
            var phone = this.phone.value;
            var password = this.password.value;
            var confirm = this.confirmPassword.value;
            if (password !== confirm) {
                qs('signup-error').textContent = 'Passwords do not match.';
                qs('signup-error').style.display = 'block';
                return;
            }
            var result = AppData.register(firstName, lastName, email, phone, password);
            if (result.ok) {
                qs('signup-success').textContent = 'Account created! Redirecting to login...';
                qs('signup-success').style.display = 'block';
                qs('signup-error').style.display = 'none';
                setTimeout(function() { window.location.href = 'Login.html'; }, 1500);
            } else {
                qs('signup-error').textContent = result.error;
                qs('signup-error').style.display = 'block';
            }
        });
    }

    function initResetPassword() {
        var requestForm = qs('reset-request-form');
        var completeForm = qs('reset-complete-form');
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var result = AppData.requestPasswordReset(this.email.value);
            if (result.ok) {
                qs('reset-error').style.display = 'none';
                qs('reset-success').textContent = 'Reset code: ' + result.code + ' (simulated)';
                qs('reset-success').style.display = 'block';
                requestForm.style.display = 'none';
                completeForm.style.display = 'block';
            } else {
                qs('reset-error').textContent = result.error;
                qs('reset-error').style.display = 'block';
            }
        });
        completeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = requestForm.email.value;
            var code = this.code.value;
            var newPassword = this.newPassword.value;
            var confirm = this.confirmPassword.value;
            if (newPassword !== confirm) {
                qs('reset-error').textContent = 'Passwords do not match.';
                qs('reset-error').style.display = 'block';
                return;
            }
            var result = AppData.resetPassword(email, code, newPassword);
            if (result.ok) {
                qs('reset-success').textContent = 'Password reset successfully! Redirecting to login...';
                qs('reset-error').style.display = 'none';
                setTimeout(function() { window.location.href = 'Login.html'; }, 1500);
            } else {
                qs('reset-error').textContent = result.error;
                qs('reset-error').style.display = 'block';
            }
        });
    }

    /* Dashboard pages */
    function initDashboard(session) {
        var userId = session.user.id;
        var user = session.user;
        var bookings = AppData.get('bookings').filter(function(b) { return b.userId === userId; });
        var active = bookings.filter(function(b) { return b.status === 'active'; });
        var pending = bookings.filter(function(b) { return b.paymentStatus === 'pending'; });
        var completed = bookings.filter(function(b) { return b.status === 'completed'; });
        var totalSpent = bookings.filter(function(b) { return b.paymentStatus === 'paid'; }).reduce(function(s, b) { return s + b.amount; }, 0);
        if (qs('welcome-name')) qs('welcome-name').textContent = (user.firstName || user.name || 'Guest');
        qs('stat-active').textContent = active.length;
        qs('stat-pending').textContent = pending.length;
        qs('stat-completed').textContent = completed.length;
        var reviews = AppData.get('reviews').filter(function(r) { return r.userId === userId && r.status === 'approved'; });
        var avg = reviews.length ? (reviews.reduce(function(s, r) { return s + r.rating; }, 0) / reviews.length).toFixed(1) : '0';
        qs('stat-rating').textContent = avg;
        if (qs('stat-spent')) qs('stat-spent').textContent = mk(totalSpent);
        var currentBody = qs('current-bookings-body');
        var activeBookings = bookings.filter(function(b) { return b.status === 'active' || b.status === 'upcoming'; });
        if (activeBookings.length) {
            activeBookings.slice(0, 5).forEach(function(b) {
                var tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.addEventListener('click', function() { window.location.href = 'booking-details.html?id=' + b.id; });
                tr.innerHTML = '<td>' + b.hostel + '</td><td>' + b.room + '</td><td>' + formatDate(b.checkIn) + '</td><td>' + formatDate(b.checkOut) + '</td><td>' + badge(b.status) + '</td>';
                currentBody.appendChild(tr);
            });
        } else {
            currentBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No current bookings</td></tr>';
        }
        var historyBody = qs('booking-history-body');
        if (bookings.length) {
            bookings.slice(0, 10).forEach(function(b) {
                var tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.addEventListener('click', function() { window.location.href = 'booking-details.html?id=' + b.id; });
                tr.innerHTML = '<td>' + b.hostel + '</td><td>' + b.room + '</td><td>' + formatDate(b.checkIn) + ' - ' + formatDate(b.checkOut) + '</td><td>' + mk(b.amount) + '</td><td>' + badge(b.status) + '</td>';
                historyBody.appendChild(tr);
            });
        } else {
            historyBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No bookings yet</td></tr>';
        }
        var notifContainer = qs('dashboard-notifications');
        if (notifContainer) {
            var notifs = AppData.getNotificationsForUser(userId).slice(0, 5);
            if (notifs.length) {
                notifs.forEach(function(n) {
                    var div = document.createElement('div');
                    div.className = 'notification-item' + (n.read ? '' : ' unread');
                    div.innerHTML = '<div class="notif-icon"><i class="fas fa-' + (n.type === 'booking' ? 'calendar-check' : n.type === 'payment' ? 'credit-card' : 'info-circle') + '"></i></div><div class="notif-content"><div class="notif-title">' + n.title + '</div><div class="notif-message">' + n.message + '</div><div class="notif-time">' + timeAgo(n.time) + '</div></div>';
                    notifContainer.appendChild(div);
                });
            } else {
                notifContainer.innerHTML = '<p style="text-align:center;color:#888;padding:20px;">No notifications</p>';
            }
        }
    }

    function initMyBookings(session) {
        var userId = session.user.id;
        var allBookings = AppData.get('bookings').filter(function(b) { return b.userId === userId; });
        function renderBookings(filter) {
            var tbody = qs('bookings-table-body');
            tbody.innerHTML = '';
            var filtered = filter ? allBookings.filter(function(b) { return b.status === filter; }) : allBookings;
            if (filtered.length) {
                filtered.forEach(function(b) {
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + b.id + '</td><td>' + b.hostel + '</td><td>' + b.room + '</td><td>' + formatDate(b.checkIn) + '</td><td>' + formatDate(b.checkOut) + '</td><td>' + mk(b.amount) + '</td><td>' + badge(b.status) + '</td><td><a href="booking-details.html?id=' + b.id + '" class="btn btn-sm btn-outline">View</a></td>';
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;padding:20px;">No bookings found</td></tr>';
            }
        }
        renderBookings(null);
        var filterBtns = qsa('.filter-btn');
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                var filter = this.textContent.toLowerCase();
                renderBookings(filter === 'all' ? null : filter);
            });
        });
    }

    function initBookingDetails(session) {
        var params = new URLSearchParams(window.location.search);
        var bookingId = params.get('id');
        if (!bookingId) { qs('booking-title').textContent = 'Booking not found'; return; }
        var booking = AppData.getById('bookings', bookingId);
        if (!booking || booking.userId !== session.user.id) { qs('booking-title').textContent = 'Booking not found'; return; }
        qs('booking-title').textContent = 'Booking ' + booking.id;
        if (qs('detail-hostel')) qs('detail-hostel').textContent = booking.hostel;
        if (qs('detail-room')) qs('detail-room').textContent = booking.room;
        if (qs('detail-checkin')) qs('detail-checkin').textContent = formatDate(booking.checkIn);
        if (qs('detail-checkout')) qs('detail-checkout').textContent = formatDate(booking.checkOut);
        if (qs('detail-duration')) qs('detail-duration').textContent = AppData.nightsBetween(booking.checkIn, booking.checkOut) + ' nights';
        if (qs('detail-guests')) qs('detail-guests').textContent = booking.guests + ' guest(s)';
        if (qs('detail-amount')) qs('detail-amount').textContent = mk(booking.amount);
        if (qs('detail-paystatus')) qs('detail-paystatus').innerHTML = badge(booking.paymentStatus);
        if (qs('detail-method')) qs('detail-method').textContent = booking.paymentMethod || 'Not paid';
        if (qs('detail-paidon')) qs('detail-paidon').textContent = booking.paidOn ? formatDate(booking.paidOn) : 'N/A';
        var receiptBody = qs('receipt-body');
        if (receiptBody) {
            var nights = AppData.nightsBetween(booking.checkIn, booking.checkOut);
            var room = AppData.getById('rooms', booking.room);
            var pricePerNight = room ? room.price : 0;
            receiptBody.innerHTML = '<tr><td>' + booking.room + ' at ' + booking.hostel + '</td><td>' + nights + '</td><td>' + mk(pricePerNight) + '</td><td>' + mk(booking.amount) + '</td></tr>';
        }
        var hostels = AppData.get('hostelList');
        var hostel = hostels.find(function(h) { return h.name === booking.hostel; });
        var hostelName = hostel ? hostel.name : booking.hostel;
        var reviewsContainer = qs('reviews-container');
        if (reviewsContainer) {
            var reviews = AppData.getReviewsByHostel(hostelName);
            if (reviews.length) {
                reviews.forEach(function(r) {
                    var div = document.createElement('div');
                    div.style.cssText = 'padding:12px;border-bottom:1px solid #f0f0f0;margin-bottom:8px;';
                    div.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong>' + '★'.repeat(r.rating) + '</strong><span style="font-size:12px;color:#888;">' + formatDate(r.createdAt) + '</span></div><p style="font-size:14px;color:#555;margin:0;">' + r.comment + '</p>';
                    reviewsContainer.appendChild(div);
                });
            } else {
                reviewsContainer.innerHTML = '<p style="color:#888;text-align:center;padding:12px;">No reviews yet for this hostel.</p>';
            }
        }
        var reviewForm = qs('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var rating = parseInt(this.rating.value);
                var comment = this.comment.value;
                if (AppData.hasUserReviewed(session.user.id, hostelName)) {
                    alert('You have already reviewed this hostel.');
                    return;
                }
                AppData.addReview(session.user.id, hostelName, rating, comment);
                alert('Review submitted for approval.');
                this.reset();
            });
        }
        var cancelBtn = qs('booking-details-container').querySelector('.btn-danger');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (confirm('Cancel this booking?')) {
                    var result = AppData.cancelBooking(bookingId);
                    if (result.ok) {
                        alert('Booking cancelled.');
                        window.location.reload();
                    } else {
                        alert(result.error);
                    }
                }
            });
        }
    }

    function initNotifications(session) {
        var userId = session.user.id;
        var allNotifs = AppData.getNotificationsForUser(userId);
        function renderNotifs(filter) {
            var container = qs('notifications-container');
            container.innerHTML = '';
            var filtered = filter ? allNotifs.filter(function(n) { return filter === 'unread' ? !n.read : n.type === filter; }) : allNotifs;
            if (filtered.length) {
                filtered.forEach(function(n) {
                    var div = document.createElement('div');
                    div.className = 'notification-item' + (n.read ? '' : ' unread');
                    div.innerHTML = '<div class="notif-icon"><i class="fas fa-' + (n.type === 'booking' ? 'calendar-check' : n.type === 'payment' ? 'credit-card' : 'info-circle') + '"></i></div><div class="notif-content"><div class="notif-title">' + n.title + '</div><div class="notif-message">' + n.message + '</div><div class="notif-time">' + timeAgo(n.time) + '</div></div>';
                    container.appendChild(div);
                });
            } else {
                container.innerHTML = '<p style="text-align:center;color:#888;padding:20px;">No notifications</p>';
            }
        }
        renderNotifs(null);
        var filterBtns = qsa('.filter-btn');
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                renderNotifs(this.textContent.toLowerCase() === 'all' ? null : this.textContent.toLowerCase());
            });
        });
        var markBtn = qs('notifications-container').parentElement.querySelector('.btn-outline');
        if (markBtn) {
            markBtn.addEventListener('click', function() {
                AppData.markAllNotificationsRead(userId);
                renderNotifs(null);
                qsa('.notification-bell .badge').forEach(function(b) { b.textContent = '0'; });
            });
        }
    }

    function initEditProfile(session) {
        var user = session.user;
        qs('profile-form').firstName.value = user.firstName;
        qs('profile-form').lastName.value = user.lastName;
        qs('profile-form').email.value = user.email;
        qs('profile-form').phone.value = user.phone || '';
        qs('profile-form').bio.value = AppData.get('profile').bio || '';
        if (qs('profile-name')) qs('profile-name').textContent = user.firstName + ' ' + user.lastName;
        if (qs('profile-email')) qs('profile-email').textContent = user.email;
        qs('profile-form').addEventListener('submit', function(e) {
            e.preventDefault();
            AppData.updateItem('users', user.id, {
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                email: this.email.value,
                phone: this.phone.value
            });
            AppData.set('profile', Object.assign(AppData.get('profile'), { bio: this.bio.value }));
            alert('Profile updated.');
        });
        qs('password-form').addEventListener('submit', function(e) {
            e.preventDefault();
            if (btoa(this.currentPassword.value) !== user.password) {
                alert('Current password is incorrect.');
                return;
            }
            if (this.newPassword.value !== this.confirmPassword.value) {
                alert('New passwords do not match.');
                return;
            }
            AppData.updateItem('users', user.id, { password: btoa(this.newPassword.value) });
            alert('Password updated.');
            this.reset();
        });
        var prefs = AppData.get('preferences');
        var prefForm = qs('preferences-form');
        if (prefForm) {
            prefForm.emailNotif.checked = prefs.emailNotif;
            prefForm.smsNotif.checked = prefs.smsNotif;
            prefForm.promotions.checked = prefs.promotions;
            prefForm.addEventListener('submit', function(e) {
                e.preventDefault();
                AppData.set('preferences', {
                    emailNotif: this.emailNotif.checked,
                    smsNotif: this.smsNotif.checked,
                    promotions: this.promotions.checked
                });
                alert('Preferences saved.');
            });
        }
    }

    /* Public pages */
    function initContact() {
        qs('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            var result = AppData.submitContact(this.name.value, this.email.value, this.subject.value, this.message.value);
            if (result.ok) {
                qs('contact-alert').textContent = 'Message sent successfully!';
                qs('contact-alert').className = 'alert alert-success';
                qs('contact-alert').style.display = 'block';
                this.reset();
            }
        });
    }

    function initHostels() {
        function renderRooms(rooms) {
            var container = qs('room-results');
            container.innerHTML = '';
            if (!rooms.length) {
                container.innerHTML = '<p style="text-align:center;color:#888;padding:40px;">No rooms match your criteria.</p>';
                return;
            }
            rooms.forEach(function(r) {
                var div = document.createElement('div');
                div.className = 'hostel-card';
                div.style.cssText = 'position:relative;height:300px;background-size:cover;background-position:center;overflow:hidden;flex:1;min-width:300px;max-width:400px;display:flex;align-items:flex-end;cursor:pointer;';
                var hostel = AppData.get('hostelList').find(function(h) { return h.name === r.hostel; });
                div.style.backgroundImage = 'url(' + (hostel && hostel.image ? hostel.image : '../assets/media/bedroom_10.jpg') + ')';
                div.innerHTML = '<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to top,rgba(0,0,0,0.85),rgba(0,0,0,0.1));z-index:1;"></div><div style="position:relative;z-index:2;color:white;padding:25px;width:100%;"><h3 style="font-size:22px;margin-bottom:8px;">' + r.hostel + ' - ' + r.type + '</h3><p style="font-size:14px;margin-bottom:6px;">Capacity: ' + r.capacity + ' guest(s)</p><p style="font-size:14px;margin-bottom:6px;">Amenities: ' + r.amenities.join(', ') + '</p><p style="font-size:18px;font-weight:bold;margin-bottom:12px;">' + mk(r.price) + ' / night</p><a href="booking-details.html?room=' + r.id + '" style="display:inline-block;padding:8px 20px;background:#009272;color:white;border:none;border-radius:5px;text-decoration:none;font-size:14px;cursor:pointer;">Book Now</a></div>';
                container.appendChild(div);
            });
        }
        var allRooms = AppData.getAvailableRooms(null, null, null);
        renderRooms(allRooms);
        qs('search-results-info').textContent = allRooms.length + ' room(s) available';
        qs('search-btn').addEventListener('click', function() {
            var checkIn = qs('filter-checkin').value;
            var checkOut = qs('filter-checkout').value;
            var filters = {};
            if (qs('filter-price').value) filters.maxPrice = qs('filter-price').value;
            if (qs('filter-capacity').value) filters.capacity = parseInt(qs('filter-capacity').value);
            if (qs('filter-type').value) filters.type = qs('filter-type').value;
            var results = AppData.getAvailableRooms(checkIn || null, checkOut || null, Object.keys(filters).length ? filters : null);
            renderRooms(results);
            qs('search-results-info').textContent = results.length + ' room(s) found';
        });
    }

    /* Bootstrap */
    document.addEventListener('DOMContentLoaded', function() {
        if (qs('login-form')) initLogin();
        if (qs('signup-form')) initSignup();
        if (qs('reset-request-form')) initResetPassword();
        if (qs('contact-form')) initContact();
        if (qs('room-results')) initHostels();
        var session = AppData.getSession();
        if (session) {
            qsa('.admin-info').forEach(function(s) { s.textContent = session.user.firstName + ' ' + session.user.lastName; });
            if (qs('current-bookings-body')) initDashboard(session);
            if (qs('bookings-table-body')) initMyBookings(session);
            if (qs('booking-details-container')) initBookingDetails(session);
            if (qs('notifications-container')) initNotifications(session);
            if (qs('profile-form')) initEditProfile(session);
        }
    });
})();
