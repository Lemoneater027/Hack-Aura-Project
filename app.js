// FitTrainer Hub - PWA JavaScript

// Application State
const appState = {
    currentSection: 'home',
    currentUser: {
        id: 'user-123',
        name: 'Alex Kumar',
        username: 'alex_student',
        email: 'alex@university.edu',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        university: 'Mumbai University',
        year: '2nd Year Engineering',
        fitnessGoals: ['Weight Loss', 'Build Strength'],
        location: 'Andheri West, Mumbai'
    },
    cart: [],
    notifications: [],
    isOnline: navigator.onLine
};

// Mock Data
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
        category: 'protein',
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
        category: 'vitamins',
        originalPrice: '₹899',
        studentPrice: '₹649',
        discount: '28% OFF',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300',
        rating: 4.7,
        reviews: 156,
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
    }
];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    console.log('🚀 FitTrainer Hub PWA initialized');
    
    loadFeaturedTrainers();
    loadAllTrainers();
    loadProducts();
    loadSocialFeed();
    updateCartUI();
    
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
    
    setupPWAInstall();
    setupNetworkHandlers();
    
    console.log('✅ App initialization complete');
}

// Navigation Functions
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        appState.currentSection = sectionName;
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItems = document.querySelectorAll(`[onclick="showSection('${sectionName}')"]`);
        activeNavItems.forEach(item => item.classList.add('active'));
        
        console.log(`📱 Navigated to ${sectionName} section`);
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) panel.classList.toggle('open');
}

// Trainer Functions
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

function createTrainerCard(trainer) {
    return `
        <div class="trainer-card">
            <div class="trainer-image">
                <img src="${trainer.image}" alt="${trainer.name}" loading="lazy">
                ${trainer.verified ? '<div class="verified-badge">✓ Verified</div>' : ''}
            </div>
            <div class="trainer-info">
                <h3 class="trainer-name">${trainer.name}</h3>
                <p class="trainer-specialization">${trainer.specialization}</p>
                <div class="trainer-location">
                    📍 ${trainer.location} • ${trainer.distance}
                </div>
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
                    <button class="btn btn-primary" onclick="bookTrainer(${trainer.id})">
                        Book Session
                    </button>
                    <button class="btn btn-secondary" onclick="viewTrainer(${trainer.id})">
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    return stars;
}

function bookTrainer(trainerId) {
    const trainer = mockTrainers.find(t => t.id === trainerId);
    if (trainer) {
        showBookingModal(trainer);
    }
}

function viewTrainer(trainerId) {
    showToast('Opening trainer profile...');
}

// E-commerce Functions
function loadProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = mockProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
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
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filterProducts(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filteredProducts = mockProducts;
    if (category !== 'all') {
        filteredProducts = mockProducts.filter(product => 
            product.category === category
        );
    }
    
    const container = document.getElementById('productsGrid');
    if (container) {
        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
        showToast(`Showing ${filteredProducts.length} products`);
    }
}

// Shopping Cart Functions
function addToCart(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = appState.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            productId: productId,
            quantity: 1,
            product: product
        });
    }
    
    updateCartUI();
    showToast(`${product.name} added to cart!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function proceedToCheckout() {
    if (appState.cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    showToast('Redirecting to checkout...');
}

// Social Functions
function loadSocialFeed() {
    const container = document.getElementById('socialFeed');
    if (!container) return;
    
    container.innerHTML = mockSocialPosts.map(post => createSocialPost(post)).join('');
}

function createSocialPost(post) {
    return `
        <div class="social-post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="user-info">
                    <img src="${post.user.image}" alt="${post.user.name}" class="user-avatar">
                    <div class="user-details">
                        <h4 class="user-name">${post.user.name}</h4>
                        <span class="username">${post.user.username}</span>
                        <span class="post-time">${post.timeAgo}</span>
                    </div>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" onclick="toggleLike(${post.id})">
                    ❤️ ${post.likes}
                </button>
                <button class="action-btn comment-btn">
                    💬 ${post.comments}
                </button>
                <button class="action-btn share-btn" onclick="sharePost(${post.id})">
                    🔄 ${post.shares}
                </button>
            </div>
        </div>
    `;
}

function toggleLike(postId) {
    const post = mockSocialPosts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        loadSocialFeed();
        showToast('Post liked!');
    }
}

function sharePost(postId) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this fitness post!',
            text: 'Awesome fitness progress on FitTrainer Hub',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
    }
}

// Modal Functions
function showBookingModal(trainer = null) {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function showPostModal() {
    const modal = document.getElementById('postModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    modal.style.display = 'none';
}

function confirmBooking() {
    const sessionDate = document.getElementById('sessionDate')?.value;
    const sessionTime = document.getElementById('sessionTime')?.value;
    
    if (!sessionDate || !sessionTime) {
        showToast('Please select date and time', 'warning');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        closeModal('bookingModal');
        showToast('Session booked successfully! 🎉');
    }, 2000);
}

function shareProgress() {
    const content = document.getElementById('postContent')?.value;
    
    if (!content.trim()) {
        showToast('Please write something to share', 'warning');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        closeModal('postModal');
        showToast('Progress shared successfully! 🎉');
        document.getElementById('postContent').value = '';
    }, 1500);
}

// Utility Functions
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.toggle('hidden', !show);
    }
}

// PWA Functions
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
    
    document.getElementById('installBtn')?.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                showToast('App installed successfully! 🎉');
            }
            
            deferredPrompt = null;
            document.getElementById('installBanner').classList.add('hidden');
        }
    });
    
    document.getElementById('dismissInstall')?.addEventListener('click', () => {
        document.getElementById('installBanner').classList.add('hidden');
    });
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('✅ Service Worker registered successfully:', registration);
    } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
    }
}

function setupNetworkHandlers() {
    function updateNetworkStatus() {
        appState.isOnline = navigator.onLine;
        
        if (!appState.isOnline) {
            showToast('You are offline 📡', 'warning');
        }
    }
    
    window.addEventListener('online', () => {
        updateNetworkStatus();
        showToast('Back online! 🌐');
    });
    
    window.addEventListener('offline', updateNetworkStatus);
    
    updateNetworkStatus();
}

// Filter Functions
function filterTrainers() {
    showToast('Applying filters...');
    // In real app, would filter the trainer results
}

function clearFilters() {
    document.querySelectorAll('.filters-container select').forEach(select => {
        select.value = '';
    });
    showToast('Filters cleared');
}

function loadMoreTrainers() {
    showToast('Loading more trainers...');
}

function showProfileTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="showProfileTab('${tabName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Initialize on load
window.addEventListener('load', () => {
    setTimeout(() => {
        showToast('Welcome to FitTrainer Hub! 🏋️‍♂️');
    }, 1000);
});

console.log('🎯 FitTrainer Hub PWA JavaScript loaded successfully!');
