document.addEventListener('DOMContentLoaded', () => {
    // Load last active section or default
    const activeSectionId = localStorage.getItem('activeSectionId') || 'addPackageSection';
    showSection(activeSectionId);

    // Sidebar navigation
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.sectionId;
            showSection(sectionId);
            localStorage.setItem('activeSectionId', sectionId);

            if (sectionId === 'managePackages') {
                fetchPackages();
            }
        });
    });

    // Manual booking refresh
    const refreshBtn = document.getElementById('refreshBookings');
    refreshBtn?.addEventListener('click', () => {
        refreshBtn.classList.add('spin');
        document.getElementById('refreshText').textContent = 'Refreshing...';
        fetchBookings();
    });

    // Booking delete handler
    document.getElementById('bookingCards')?.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-btn');
        if (deleteBtn) {
            deleteBooking(event, deleteBtn.dataset.bookingId);
        }
    });

    // Package delete handler
    document.getElementById('packageCards')?.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-package-btn');
        if (deleteBtn) {
            deletePackage(event, deleteBtn.dataset.packageId);
        }
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = 'admin.html';
            }
        });
    }

    // Clock + Initial Bookings
    updateClock();
    fetchBookings();

    // Auto-refresh bookings every 60s
    setInterval(fetchBookings, 60000);
});

// Show specific section
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId)?.classList.remove('hidden');
}

// Fetch and display bookings
function fetchBookings() {
    fetch('db.json')
        .then(res => res.json())
        .then(data => displayBookings(data.bookings))
        .catch(err => console.error('Error loading bookings:', err))
        .finally(() => {
            setTimeout(() => {
                document.getElementById('refreshBookings')?.classList.remove('spin');
                document.getElementById('refreshText').textContent = 'Refresh';
            }, 1000);
        });
}

function displayBookings(bookings) {
    const container = document.getElementById('bookingCards');
    if (!container) return;

    container.innerHTML = bookings.length === 0
        ? '<p class="no-bookings">No bookings received.</p>'
        : bookings.map(booking => `
            <div class="card">
                <div class="card-header">
                    ${booking.dishName}
                    <button class="delete-btn" data-booking-id="${booking.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="card-body">
                    <p>Budget: ${booking.budget}</p>
                    <p>Email: ${booking.email}</p>
                    <p>Ingredients: ${booking.ingredients}</p>
                    <p>Serves: ${booking.quantity}</p>
                    <p>Method of Delivery: ${booking.deliveryMethod}</p>
                    <p>Special Instructions: ${booking.specialInstructions}</p>
                    <p>Reference: ${booking.image}</p>
                    <button class="mail-btn" onclick="mailCustomer('${booking.email}', '${booking.dishName}', '${booking.budget}', '${booking.ingredients}', '${booking.quantity}', '${booking.deliveryMethod}', '${booking.specialInstructions}', '${booking.image}')">
                        Email Now
                    </button>
                </div>
            </div>
        `).join('');
}

function deleteBooking(event, id) {
    event.preventDefault();

    const confirmDelete = confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/bookings/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete booking');
            fetchBookings();
        })
        .catch(err => console.error('Error deleting booking:', err));
}


// Fetch and display packages
function fetchPackages() {
    fetch('db.json')
        .then(res => res.json())
        .then(data => displayPackages(data.packages))
        .catch(err => console.error('Error loading packages:', err));
}

function displayPackages(packages) {
    const container = document.getElementById('packageCards');
    if (!container) return;

    container.innerHTML = packages.length === 0
        ? '<p class="no-packages">No packages available.</p>'
        : packages.map(pkg => `
            <div class="card">
                <div class="card-header">
                    ${pkg.name}
                    <button class="delete-package-btn" data-package-id="${pkg.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="card-body">
                    <img src="${pkg.image}" alt="${pkg.name}" class="package-image">
                    <p>${pkg.description}</p>
                </div>
            </div>
        `).join('');
}

// Clock updater
function updateClock() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');

    function refreshClock() {
        const now = new Date();
        dateElement.textContent = now.toDateString();
        timeElement.textContent = now.toLocaleTimeString();
    }

    refreshClock();
    setInterval(refreshClock, 1000);
}

// Email sender
function mailCustomer(email, dishName, budget, ingredients, quantity, deliveryMethod, specialInstructions, image) {
    const subject = encodeURIComponent('Booking Confirmation');
    const body = encodeURIComponent(`Hello,

Thank you for your order! Here are your booking details:

Dish: ${dishName}
Budget: ${budget}
Ingredients: ${ingredients}
Quantity: ${quantity}
Delivery Method: ${deliveryMethod}
Special Instructions: ${specialInstructions}
Reference Image: ${image}

Made for your cravings, crafted with care.Your order is good to go!


Best regards,
CraveCrafter Team`);

    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
}
