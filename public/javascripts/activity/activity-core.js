const ActivityCore = {
    elements: {
        activityList: document.getElementById("activityList"),
        popup: document.getElementById("myPopup"),
        addActivityButton: document.getElementById("addActivity"),
        newActivityInput: document.getElementById("newActivity"),
        startTimeInput: document.getElementById("startTime"),
        durationInput: document.getElementById("duration"),
        prioritySelector: document.getElementById("prioritySelector"),
        statusSelector: document.getElementById("statusSelector"),
        quickOptions: document.querySelectorAll(".quick-option"),
        sortTimeButton: document.getElementById("sortTime"),
        distribute16hButton: document.getElementById("distribute16h"),
        distribute15minButton: document.getElementById("distribute15min"),
        saveButton: document.getElementById("save"),
        saveActivitiesCurrentButton: document.getElementById("saveActivitiesCurrent")
    },

    // Initialize all necessary components and events
    init() {
        this.initializeEventListeners();
        
        // Initialize drag and drop functionality
        DragDropManager.init(this.elements.activityList);
        
        // Add delete buttons to existing activities
        this.elements.activityList.querySelectorAll(".list-item").forEach(UIHelpers.addDeleteButton);

        // Initialize editors for activity text and time fields
        Editors.initializeEditors();  // Called without .call(this) for direct invocation

        console.log("ScalaPlanAI loaded! 😊");
    },

    // Add new activity to the list with the specified details
    addActivityToList(emoji, description, startTime, duration, priority, status) {
        const newListItem = document.createElement("li");
        newListItem.className = "list-item";
        newListItem.setAttribute("id", `item-${this.elements.activityList.children.length}`);
        
        const durationText = duration ? `(${duration} min)` : '(5 min)';
        /* rivedere meglio: <span class='timestamp'>${startTime || TimeManagement.getCurrentTime()}</span> */
        newListItem.innerHTML = `
            <span class='timestamp'>${TimeManagement.getCurrentTime()}</span>
            <span class='emoji'>${emoji}</span>
            <span class='activity-text'>${description}</span>
            <span class='duration'>${durationText}</span>
            <span class='priority'>${priority || '🟩'}</span>
            <span class='status'>${status || '🏁'}</span>
        `;
        
        UIHelpers.addDeleteButton(newListItem);
        this.elements.activityList.appendChild(newListItem);
        DragDropManager.attachListeners(newListItem);
        UIHelpers.showToast("Attività aggiunta");
    },

    // Set up event listeners for the various buttons and actions
    initializeEventListeners() {
        this.elements.sortTimeButton.onclick = TimeManagement.sortActivitiesByTime;

        // Add new activity on button click
        this.elements.addActivityButton.onclick = () => {
            const newActivity = this.elements.newActivityInput.value.trim();
            const startTime = this.elements.startTimeInput.value;
            const duration = this.elements.durationInput.value;
            const priority = this.elements.prioritySelector.value;
            const status = this.elements.statusSelector.value;

            if (newActivity) {
                this.addActivityToList("📝", newActivity, startTime, duration, priority, status);
                this.elements.newActivityInput.value = "";
                this.elements.popup.style.display = "none";
            } else {
                alert("Per favore, inserisci un'attività valida.");
            }
        };

        // Quick options for adding predefined activities
        this.elements.quickOptions.forEach(button => {
            button.addEventListener("click", () => {
                const emoji = button.getAttribute("data-emoji");
                const description = button.textContent.replace(emoji, "").trim();
                const startTime = this.elements.startTimeInput.value;
                const duration = this.elements.durationInput.value;
                const priority = this.elements.prioritySelector.value;
                const status = this.elements.statusSelector.value;
                    
                this.addActivityToList(emoji, description, startTime, duration, priority, status);
                this.elements.popup.style.display = "none";
            });
        });

        // Distribute activities over 16 hours (7:00-23:00)
        this.elements.distribute16hButton.onclick = () => {
            TimeManagement.distribute16Hours();
            UIHelpers.showToast("Attività distribuite su 16 ore attive (7:00-23:00)");
        };

        // Distribute activities in 15-minute blocks
        this.elements.distribute15minButton.onclick = () => {
            TimeManagement.distribute15MinBlocks();
            UIHelpers.showToast("Attività distribuite in blocchi da 15 minuti");
        };

        // Save activities to a YAML file
        this.elements.saveButton.onclick = () => {
            SaveManager.saveToYAML();
            UIHelpers.showToast("Attività salvate in YAML");
        };

        // Save activities in the current folder
        this.elements.saveActivitiesCurrentButton.onclick = () => {
            SaveManager.saveActivities('Current');
            UIHelpers.showToast("Attività salvate in folder Current");
        };

        // Initialize popup controls
        this.initializePopupControls();
    },

    // Set up the popup control functionality
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
