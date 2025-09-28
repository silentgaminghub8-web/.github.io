// js/orders.js
class OrderTracker {
    constructor() {
        this.orderData = null;
        this.statusTimers = new Map();
        this.init();
    }

    init() {
        this.loadOrderData();
        this.startStatusProgression();
        this.renderProgressBar();
    }

    loadOrderData() {
        const orderId = new URLSearchParams(window.location.search).get('id');
        this.orderData = this.getOrderFromStorage(orderId);
    }

    startStatusProgression() {
        if (this.orderData.status === 'placed') {
            // Simulate shipped after 3 hours (3 minutes for demo)
            const shippedTimer = setTimeout(() => {
                this.updateOrderStatus('shipped');
            }, 3 * 60 * 1000); // 3 minutes for demo

            // Simulate delivered after 24 hours (10 minutes for demo)
            const deliveredTimer = setTimeout(() => {
                this.updateOrderStatus('delivered');
            }, 10 * 60 * 1000); // 10 minutes for demo

            this.statusTimers.set('shipped', shippedTimer);
            this.statusTimers.set('delivered', deliveredTimer);
        }
    }

    updateOrderStatus(newStatus) {
        this.orderData.status = newStatus;
        this.orderData.timeline.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            description: this.getStatusDescription(newStatus)
        });

        this.saveOrderUpdate();
        this.renderProgressBar();
        this.showStatusUpdateToast(newStatus);
    }

    renderProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        const statusPoints = document.querySelectorAll('.status-point');
        
        const statusIndex = this.getStatusIndex(this.orderData.status);
        const progressPercent = (statusIndex / (statusPoints.length - 1)) * 100;
        
        progressBar.style.width = progressPercent + '%';
        
        // Update status points
        statusPoints.forEach((point, index) => {
            if (index <= statusIndex) {
                point.classList.add('completed');
            }
        });
    }

    getStatusIndex(status) {
        const statusOrder = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
        return statusOrder.indexOf(status);
    }
}
