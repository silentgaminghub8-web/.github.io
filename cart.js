// js/cart.js
class CheckoutProcess {
    constructor() {
        this.userData = null;
        this.cartItems = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupPaymentHandler();
    }

    loadUserData() {
        // Load from localStorage or API
        this.userData = JSON.parse(localStorage.getItem('userData')) || {};
    }

    setupPaymentHandler() {
        document.getElementById('payButton').addEventListener('click', () => {
            this.processPayment();
        });
    }

    processPayment() {
        // Show CVV modal for demo
        this.showCVVModal();
    }

    showCVVModal() {
        const modal = `
            <div class="cvv-modal">
                <div class="modal-content">
                    <h3>Enter CVV</h3>
                    <p>Card ending with 4242</p>
                    <input type="password" maxlength="3" placeholder="CVV" id="cvvInput">
                    <button onclick="checkout.submitPayment()">Confirm Payment</button>
                    <p class="security-note">CVV is stored securely and never saved</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    submitPayment() {
        const cvv = document.getElementById('cvvInput').value;
        
        // Demo validation
        if (cvv === '999') {
            this.completeOrder();
        } else {
            this.showError('Invalid CVV. Use 999 for demo.');
        }
    }

    completeOrder() {
        const orderData = {
            orderId: 'ORD' + Date.now(),
            items: this.cartItems,
            total: this.calculateTotal(),
            status: 'placed',
            timeline: [
                {
                    status: 'placed',
                    timestamp: new Date().toISOString(),
                    description: 'Order placed'
                }
            ],
            address: this.userData.default_address,
            payment: {
                method: 'card',
                cardAlias: this.userData.saved_cards[0].alias
            }
        };

        // Save order to history
        this.saveOrder(orderData);
        
        // Show success and redirect
        this.showSuccessModal(orderData.orderId);
    }

    showSuccessModal(orderId) {
        const modal = `
            <div class="success-modal">
                <div class="modal-content">
                    <div class="success-icon">✓</div>
                    <h3>Order Confirmed!</h3>
                    <p>Order #${orderId}</p>
                    <button onclick="location.href='order-detail.html?id=${orderId}'">
                        Track Order
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
    }
}
