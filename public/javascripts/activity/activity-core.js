// Core activity management and UI initialization
const ActivityCore = {
    // DOM Elements
    elements: {
        activityList: document.getElementById("activityList"),
        popup: document.getElementById("myPopup"),
        addActivityButton: document.getElementById("addActivity"),
        newActivityInput: document.getElementById("newActivity"),
        startTimeInput: document.getElementById("startTime"),
        durationInput: document.getElementById("duration"),
        prioritySelector: document.getElementById("prioritySelector"),
        flagSelector: document.getElementById("flagSelector"),
        quickOptions: document.querySelectorAll(".quick-option"),
        sortTimeButton: document.getElementById("sortTime"),
        distribute16hButton: document.getElementById("distribute16h"),
        distribute15minButton: document.getElementById("distribute15min"),
        saveButton: document.getElementById("save"),
        saveActivitiesCurrentButton: document.getElementById("saveActivitiesCurrent")
    },

    init() {
        console.log("ScalaAI loaded! 😊");
        this.initializeEventListeners();
        // this.initializeDragAndDrop();
        this.elements.activityList.querySelectorAll(".list-item").forEach(UIHelpers.addDeleteButton);
    },


    addActivityToList(emoji, description, startTime, duration, priority, flag) {
        const newListItem = document.createElement("li");
        newListItem.className = "list-item";
        newListItem.setAttribute("draggable", "true");
        newListItem.setAttribute("id", `item-${this.elements.activityList.children.length}`);
        
        // Format duration for display
        const durationText = duration ? `(${duration} min)` : '';
        
        newListItem.innerHTML = `
            <span class='timestamp'>${startTime || TimeManagement.getCurrentTime()}</span>
            <span class='emoji'>${emoji}</span>
            <span class='activity-text'>${description}</span>
            <span class='duration'>${durationText}</span>
            <span class='priority'>${priority || '🟩'}</span>
            <span class='flag'>${flag || '🏁'}</span>
        `;
        
        UIHelpers.addDeleteButton(newListItem);
        this.elements.activityList.appendChild(newListItem);
        this.attachDragListeners(newListItem);
        UIHelpers.showToast("Attività aggiunta");
    },

    /*
    addActivityToList(emoji, description) {
        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newListItem = document.createElement("li");
        newListItem.className = "list-item";
        newListItem.setAttribute("draggable", "true");
        newListItem.setAttribute("id", `item-${this.elements.activityList.children.length}`);
        // Format duration for display
        const durationText = duration ? `(${duration} min)` : '';

        newListItem.innerHTML = `
            <span class='timestamp'>${startTime || TimeManagement.getCurrentTime()}</span>
            <span class='emoji'>${emoji}</span>
            <span class='activity-text'>${description}</span>
            <span class='duration'>${durationText}</span>
            <span class='priority'>${priority || '🟩'}</span>
            <span class='flag'>${flag || '🏁'}</span>
        `;
        
        UIHelpers.addDeleteButton(newListItem);
        this.elements.activityList.appendChild(newListItem);
        this.attachDragListeners(newListItem);
        UIHelpers.showToast("Attività aggiunta");
    },
    */
   
    attachDragListeners(item) {
        item.addEventListener('dragstart', this.handleDragStart.bind(this));
        item.addEventListener('dragend', this.handleDragEnd.bind(this));
        item.addEventListener('dragover', this.handleDragOver.bind(this));
        item.addEventListener('drop', this.handleDrop.bind(this));
    },

    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.id);
    },

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    },

    handleDragOver(e) {
        e.preventDefault();
    },

    handleDrop(e) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedId);
        const dropTarget = e.target.closest('.list-item');

        if (dropTarget && draggedElement !== dropTarget) {
            const list = this.elements.activityList;
            const allItems = [...list.getElementsByClassName('list-item')];
            const draggedPos = allItems.indexOf(draggedElement);
            const dropPos = allItems.indexOf(dropTarget);

            if (draggedPos < dropPos) {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
            } else {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
            }
        }
    },

    initializeEventListeners() {

        // Sort button
        this.elements.sortTimeButton.onclick = TimeManagement.sortActivitiesByTime;

        // Add activity button with all fields
        this.elements.addActivityButton.onclick = () => {
            const newActivity = this.elements.newActivityInput.value.trim();
            const startTime = this.elements.startTimeInput.value;
            const duration = this.elements.durationInput.value;
            const priority = this.elements.prioritySelector.value;
            const flag = this.elements.flagSelector.value;

            if (newActivity) {
                this.addActivityToList("📝", newActivity, startTime, duration, priority, flag);
                this.elements.newActivityInput.value = "";
                this.elements.popup.style.display = "none";
            } else {
                alert("Per favore, inserisci un'attività valida.");
            }
        };

        // Quick options
        this.elements.quickOptions.forEach(button => {
            button.addEventListener("click", () => {
                const emoji = button.getAttribute("data-emoji");
                const description = button.textContent.replace(emoji, "").trim();
                this.addActivityToList(emoji, description);
                this.elements.popup.style.display = "none";
            });
        });

        // Distribution buttons
        this.elements.distribute16hButton.onclick = () => {
            TimeManagement.distribute16Hours();
            UIHelpers.showToast("Attività distribuite su 16 ore attive (7:00-23:00)");
        };

        this.elements.distribute15minButton.onclick = () => {
            TimeManagement.distribute15MinBlocks();
            UIHelpers.showToast("Attività distribuite in blocchi da 15 minuti");
        };

        // Save buttons
        this.elements.saveButton.onclick = () => {
            SaveManager.saveToYAML();
            UIHelpers.showToast("Attività salvate in YAML");
        };

        this.elements.saveActivitiesCurrentButton.onclick = () => {
            SaveManager.saveActivities('Current');
            UIHelpers.showToast("Attività salvate in folder Current");
        };

        // Popup controls
        this.initializePopupControls();
    },

    initializePopupControls() {
        document.getElementById("openPopup").onclick = () => this.elements.popup.style.display = "block";
        document.querySelector(".close").onclick = () => this.elements.popup.style.display = "none";
        window.onclick = event => {
            if (event.target == this.elements.popup) {
                this.elements.popup.style.display = "none";
            }
        };
    }
};
