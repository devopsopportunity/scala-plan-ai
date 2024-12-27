const DragDropManager = {
    init(listElement) {
        this.listElement = listElement;
        this.draggingElement = null;
        this.initializeItems();
    },

    initializeItems() {
        this.listElement.querySelectorAll(".list-item").forEach(item => {
            this.attachListeners(item);
        });
    },

    attachListeners(item) {
        item.setAttribute("draggable", "true");
        item.addEventListener('dragstart', this.handleDragStart.bind(this));
        item.addEventListener('dragend', this.handleDragEnd.bind(this));
        this.listElement.addEventListener('dragover', this.handleDragOver.bind(this));
    },

    handleDragStart(e) {
        e.stopPropagation();
        const item = e.target.closest('.list-item');
        if (item) {
            this.draggingElement = item;
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.id); // Mantiene compatibilità con il comportamento nativo
        } else {
            console.log("Elemento non valido per il dragstart:", e.target);
        }
    },

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.draggingElement) return;

        const items = [...this.listElement.getElementsByClassName('list-item')];
        const closestItem = this.getClosestItem(e.clientY, items, this.draggingElement);

        if (closestItem) {
            const rect = closestItem.getBoundingClientRect();
            const shouldInsertBefore = e.clientY < (rect.top + rect.height / 2);

            if (shouldInsertBefore) {
                this.listElement.insertBefore(this.draggingElement, closestItem);
            } else {
                this.listElement.insertBefore(this.draggingElement, closestItem.nextSibling);
            }
        }
    },

    handleDragEnd(e) {
        e.stopPropagation();
        if (this.draggingElement) {
            this.draggingElement.classList.remove('dragging');
        }
        this.draggingElement = null;
    },

    getClosestItem(mouseY, items, draggingElement) {
        let closestItem = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        items.forEach(item => {
            if (item === draggingElement) return;

            const rect = item.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const distance = Math.abs(mouseY - center);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
        });

        return closestItem;
    }
};
