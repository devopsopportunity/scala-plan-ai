// UI utilities and helper functions
const UIHelpers = {
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => { toast.style.opacity = '1'; }, 100);
        setTimeout(() => { 
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    addDeleteButton(item) {
        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Rimuovi";
        deleteBtn.textContent = "🗑️";
        deleteBtn.onclick = () => {
            item.remove();
            this.showToast("Attività eliminata");
        };
        item.appendChild(deleteBtn);
    },

    applyTransitionEffect(items, color) {
        items.forEach(item => {
            item.style.transition = 'all 0.5s ease-in-out';
            item.style.backgroundColor = color;
        });

        setTimeout(() => {
            items.forEach(item => {
                item.style.backgroundColor = '';
            });
        }, 500);
    }
};