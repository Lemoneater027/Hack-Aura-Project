// FitTrainer Hub - Shared JavaScript for Multi-Page PWA

// Sample data (shared across pages)
const mockTrainers = [
    {
        id: 1,
        name: 'Priya Sharma',
        specialization: 'Home Workout Specialist',
        location: 'Mumbai Central',
        distance: '2.1 km',
        rating: 4.9,
        reviews: 156,
        basePrice: '₹300/hour',
        studentPrice: '₹200/hour',
        image: 'https://images.unsplash.com/photo-1594824804732-ca8db7536926?w=300',
        verified: true
    },
    {
        id: 2,
        name: 'Arjun Patel',
        specialization: 'Strength Training',
        location: 'Andheri West',
        distance: '3.5 km',
        rating: 4.8,
        reviews: 203,
        basePrice: '₹400/hour',
        studentPrice: '₹250/hour',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
        verified: true
    },
    {
        id: 3,
        name: 'Kavya Singh',
        specialization: 'Weight Loss & Cardio',
        location: 'Bandra East',
        distance: '4.2 km',
        rating: 4.9,
        reviews: 128,
        basePrice: '₹350/hour',
        studentPrice: '₹225/hour',
        image: 'https://images.unsplash.com/photo-1594824804732-ca8db7536926?w=300',
        verified: true
    }
];

const mockProducts = [
    {
        id: 1,
        name: 'Student Whey Protein - Chocolate',
        brand: 'FitStudent',
        originalPrice: '₹2,499',
        studentPrice: '₹1,899',
        discount: '24% OFF',
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300',
        rating: 4.5,
        reviews: 234,
        inStock: true
    },
    {
        id: 2,
        name: 'Student Multivitamin Pack',
        brand: 'HealthyStudent',
        originalPrice: '₹899',
        studentPrice: '₹649',
        discount: '28% OFF',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300',
        rating: 4.7,
        reviews: 156,
        inStock: true
    },
    {
        id: 3,
        name: 'Pre-Workout Energy Booster',
        brand: 'PowerUp',
        originalPrice: '₹1,299',
        studentPrice: '₹999',
        discount: '23% OFF',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
        rating: 4.3,
        reviews: 89,
        inStock: true
    }
];

const mockSocialPosts = [
    {
        id: 1,
        user: {
            name: 'Rahul Gupta',
            username: '@rahul_gains',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        },
        content: 'Week 4 of home workouts with trainer Priya! Lost 3kg and feeling stronger 💪',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        likes: 34,
        comments: 8,
        shares: 5,
        timeAgo: '2 hours ago',
        tags: ['progress', 'homeWorkout']
    },
    {
        id: 2,
        user: {
            name: 'Aarya Chandra',
            username: '@aarya_fit',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150'
        },
        content: 'Finally nailed the perfect protein smoothie recipe! Thanks to trainer Vikash 🥤',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
        likes: 67,
        comments: 15,
        shares: 12,
        timeAgo: '5 hours ago',
        tags: ['nutrition', 'smoothie']
    }
];

// App state (shared across pages)
let cart = JSON.parse(localStorage.getItem('fittrainer_cart')) || [];

// Initialize shared components on every page
function initializeSharedComponents() {
    const sharedContainer = document.getElementById('sharedComponents');
    if (sharedContainer) {
        sharedContainer.innerHTML = getSharedComponentsHTML();
    }
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
    
    // Update cart UI
    updateCartUI();
    
    // Setup mobile menu
    setupMobileMenu();
    
    console.log('🚀 FitTrainer Hub initialized on', getCurrentPageName());
}

// Get shared components HTML (cart, modals, notifications)
function getSharedComponentsHTML() {
    return `
        <!-- Shopping Cart Button -->
        <div class="cart-float" onclick="toggleCart()">
            🛒 <span id="cartCount" class="cart-count">0</span>
        </div>

        <!-- Shopping Cart Sidebar -->
        <div id="cartSidebar" class="cart-sidebar">
            <div class="cart-header">
                <h3>Shopping Cart</h3>
                <button onclick="toggleCart()">✕</button>
            </div>
            <div class="cart-items" id="cartItems">
                <!-- Cart items loaded here -->
            </div>
            <div class="cart-footer">
                <div class="cart-total">Total: ₹<span id="cartTotal">0</span></div>
                <button class="btn btn-primary btn-full" onclick="proceedToCheckout()">Checkout</button>
            </div>
        </div>

        <!-- Booking Modal -->
        <div id="bookingModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Book Training Session</h2>
                    <button onclick="closeModal('booking')">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Select your session type:</p>
                    <div class="session-options">
                        <label><input type="radio" name="session" value="video"> Video Call - ₹150</label>
                        <label><input type="radio" name="session" value="person"> In-Person - ₹200</label>
                        <label><input type="radio" name="session" value="chat"> Chat - ₹50</label>
                    </div>
                    <input type="date" placeholder="Select date">
                    <select>
                        <option>Select time</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>6:00 PM</option>
                        <option>7:00 PM</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal('booking')">Cancel</button>
                    <button class="btn btn-primary" onclick="confirmBooking()">Book Session</button>
                </div>
            </div>
        </div>

        <!-- Post Modal -->
        <div id="postModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Share Your Progress</h2>
                    <button onclick="closeModal('post')">&times;</button>
                </div>
                <div class="modal-body">
                    <textarea id="postContent" placeholder="Share your fitness wins, challenges, or tips..."></textarea>
                    <button class="btn btn-secondary">📷 Add Photo</button>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal('post')">Cancel</button>
                    <button class="btn btn-primary" onclick="sharePost()">Share Progress</button>
                </div>
            </div>
        </div>

        <!-- Notifications Panel -->
        <div id="notificationsPanel" class="notifications-panel">
            <div class="notifications-header">
                <h3>Notifications</h3>
                <button onclick="toggleNotifications()">✕</button>
            </div>
            <div class="notifications-list">
                <div class="notification-item unread">
                    <div class="notification-icon">💬</div>
                    <div class="notification-content">
                        <h4>New message from Priya</h4>
                        <p>Great workout today! Here's your next week's plan</p>
                        <span class="notification-time">10 minutes ago</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notifications -->
        <div id="toastContainer" class="toast-container"></div>
    `;
}

// Navigation functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

function setupMobileMenu() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && !mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Page-specific load functions
function loadFeaturedTrainers() {
    const container = document.getElementById('featuredTrainers');
    if (!container) return;
    
    const featuredTrainers = mockTrainers.slice(0, 3);
    container.innerHTML = featuredTrainers.map(trainer => createTrainerCard(trainer)).join('');
}

function loadAllTrainers() {
    const container = document.getElementById('trainersGrid');
    if (!container) return;
    
    container.innerHTML = mockTrainers.map(trainer => createTrainerCard(trainer)).join('');
}

function loadProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = mockProducts.map(product => createProductCard(product)).join('');
}

function loadSocialFeed() {
    const container = document.getElementById('socialFeed');
    if (!container) return;
    
    container.innerHTML = mockSocialPosts.map(post => createSocialPost(post)).join('');
}

// Create HTML functions (same as before)
function createTrainerCard(trainer) {
    return `
        <div class="trainer-card">
            <div class="trainer-image">
                <img src="${trainer.image}" alt="${trainer.name}">
                ${trainer.verified ? '<div class="verified-badge">✓ Verified</div>' : ''}
            </div>
            <div class="trainer-info">
                <h3 class="trainer-name">${trainer.name}</h3>
                <p class="trainer-specialization">${trainer.specialization}</p>
                <div class="trainer-location">📍 ${trainer.location} • ${trainer.distance}</div>
                <div class="trainer-rating">
                    <div class="stars">${generateStars(trainer.rating)}</div>
                    <span>(${trainer.reviews} reviews)</span>
                </div>
                <div class="trainer-pricing">
                    <span class="original-price">${trainer.basePrice}</span>
                    <span class="student-price">${trainer.studentPrice}</span>
                    <span class="discount-label">Student Price</span>
                </div>
                <div class="trainer-actions">
                    <button class="btn btn-primary" onclick="bookTrainer(${trainer.id})">Book Session</button>
                    <button class="btn btn-secondary" onclick="viewTrainer(${trainer.id})">View Profile</button>
                </div>
            </div>
        </div>
    `;
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="discount-badge">${product.discount}</div>
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-pricing">
                    <span class="original-price">${product.originalPrice}</span>
                    <span class="student-price">${product.studentPrice}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

function createSocialPost(post) {
    return `
        <div class="social-post">
            <div class="post-header">
                <img src="${post.user.image}" alt="${post.user.name}" class="user-avatar">
                <div>
                    <div class="user-name">${post.user.name}</div>
                    <div class="username">${post.user.username}</div>
                </div>
                <div class="post-time">${post.timeAgo}</div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            <div class="post-actions">
                <button class="action-btn" onclick="likePost(${post.id})">❤️ ${post.likes}</button>
                <button class="action-btn">💬 ${post.comments}</button>
                <button class="action-btn">🔄 ${post.shares}</button>
            </div>
        </div>
    `;
}

// Utility functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    return stars;
}

function getCurrentPageName() {
    const path = window.location.pathname;
    if (path.includes('trainers')) return 'trainers';
    if (path.includes('store')) return 'store';
    if (path.includes('social')) return 'social';
    if (path.includes('dashboard')) return 'dashboard';
    return 'home';
}

// Shopping cart functions
function addToCart(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            product: product
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showToast(`${product.name} added to cart!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseInt(item.product.studentPrice.replace(/[^\d]/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    if (cartTotal) {
        cartTotal.textContent = totalPrice.toLocaleString();
    }
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" style="display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                <img src="${item.product.image}" alt="${item.product.name}" style="width: 60px; height: 60px; border-radius: 0.5rem; margin-right: 1rem;">
                <div style="flex: 1;">
                    <div style="font-weight: 500;">${item.product.name}</div>
                    <div style="color: #218085; font-weight: 600;">${item.product.studentPrice}</div>
                    <div style="font-size: 0.875rem; color: #6b7280;">Qty: ${item.quantity}</div>
                </div>
            </div>
        `).join('');
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

function saveCartToStorage() {
    localStorage.setItem('fittrainer_cart', JSON.stringify(cart));
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    showToast('Redirecting to checkout...');
}

// Modal functions
function showModal(type) {
    const modalId = type === 'booking' ? 'bookingModal' : 'postModal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeModal(type) {
    const modalId = type === 'booking' ? 'bookingModal' : 'postModal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Action functions
function bookTrainer(trainerId) {
    showModal('booking');
}

function viewTrainer(trainerId) {
    showToast('Opening trainer profile...');
}

function confirmBooking() {
    closeModal('booking');
    showToast('Session booked successfully! 🎉');
}

function sharePost() {
    const content = document.getElementById('postContent')?.value;
    if (!content || !content.trim()) {
        showToast('Please write something to share', 'warning');
        return;
    }
    
    closeModal('post');
    showToast('Progress shared successfully! 🎉');
    
    // Clear the content
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.value = '';
    }
}

function likePost(postId) {
    showToast('Post liked! ❤️');
}

// Filter functions
function filterTrainers() {
    showToast('Applying filters...');
}

function clearFilters() {
    document.querySelectorAll('.filters-container select').forEach(select => {
        select.value = '';
    });
    showToast('Filters cleared');
}

function filterProducts(category) {
    // Update category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter products
    let filteredProducts = mockProducts;
    if (category !== 'all') {
        // In a real app, you'd filter based on category
        showToast(`Showing ${category} products`);
    } else {
        showToast('Showing all products');
    }
    
    // Reload products (simplified - in real app would filter the array)
    loadProducts();
}

function loadMoreTrainers() {
    showToast('Loading more trainers...');
}

// Toast notification function
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// PWA functions
function setupPWAInstall() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        const installBanner = document.getElementById('installBanner');
        if (installBanner) {
            installBanner.classList.remove('hidden');
        }
    });
    
    const installBtn = document.getElementById('installBtn');
    const dismissBtn = document.getElementById('dismissInstall');
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    showToast('App installed successfully! 🎉');
                }
                
                deferredPrompt = null;
                const banner = document.getElementById('installBanner');
                if (banner) {
                    banner.classList.add('hidden');
                }
            }
        });
    }
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            const banner = document.getElementById('installBanner');
            if (banner) {
                banner.classList.add('hidden');
            }
        });
    }
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('✅ Service Worker registered successfully:', registration);
    } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
    }
}

console.log('✅ FitTrainer Hub JavaScript loaded!');
