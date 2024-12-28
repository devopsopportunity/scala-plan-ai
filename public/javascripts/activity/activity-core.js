// activity-core.js
const ActivityCore = {
    elements: {
        activityList: document.getElementById("activityList"),
        sortTimeButton: document.getElementById("sortTime"),
        distribute16hButton: document.getElementById("distribute16h"),
        distributeRemainingHoursButton: document.getElementById("distributeRemainingHours"),
        distribute15minButton: document.getElementById("distribute15min"),
        saveButton: document.getElementById("save"),
        saveActivitiesCurrentButton: document.getElementById("saveActivitiesCurrent")
    },

    init() {
        this.initializeEventListeners();
        DragDropManager.init(this.elements.activityList);
        this.elements.activityList.querySelectorAll(".list-item").forEach(UIHelpers.addDeleteButton);
        Editors.initializeEditors();
        console.log("ScalaPlanAI loaded! 😊");
    },

    addActivityToList(emoji, description, startTime, deadline, duration, priority, status) {
        const newListItem = document.createElement("li");
        newListItem.className = "list-item";
        newListItem.setAttribute("id", `item-${ActivityCore.elements.activityList.children.length}`);
        
        const durationText = duration ? `${duration} min` : '5 min';
        const deadlineDate = new Date(deadline);
        const day = String(deadlineDate.getDate()).padStart(2, '0');
        const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const year = deadlineDate.getFullYear();
        
        const deadlineFormatted = `${day}/${month}/${year}`;
        
        // Non c'è più bisogno di padding manuale della descrizione
        newListItem.innerHTML = `
            <span class="timestamp">${startTime}</span>
            <span class="deadline">${deadlineFormatted}</span>
            <span class="emoji">${emoji}</span>
            <span class="activity-text">${description}</span>
            <span class="duration">${durationText}</span>
            <span class="priority">${priority || '🟩'}</span>
            <span class="status">${status || '🏁'}</span>
        `;
        
        UIHelpers.addDeleteButton(newListItem);
        ActivityCore.elements.activityList.appendChild(newListItem);
        DragDropManager.attachListeners(newListItem);
    },

    distribute16Hours() {
        const activities = Array.from(this.elements.activityList.children);
        const startHour = 7; // 7:00
        const endHour = 23; // 23:00
        const totalMinutes = (endHour - startHour) * 60;
        const minutesPerActivity = Math.floor(totalMinutes / activities.length);

        activities.forEach((activity, index) => {
            const minutesFromStart = index * minutesPerActivity;
            const hours = Math.floor(minutesFromStart / 60) + startHour;
            const minutes = minutesFromStart % 60;
            
            const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            activity.querySelector('.timestamp').textContent = timeStr;
        });
    },

    distributeRemainingHours() {
        const activities = Array.from(this.elements.activityList.children);
        const currentTime = new Date(); // Ora corrente
        let currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
    
        const endHour = 23; // 23:00
        const totalRemainingMinutes = (endHour - currentHour) * 60 - currentMinute;
    
        if (totalRemainingMinutes <= 0) {
            UIHelpers.showToast("Tempo insufficiente per distribuire le attività!", "error");
            return;
        }
    
        const minutesPerActivity = Math.floor(totalRemainingMinutes / activities.length);
    
        activities.forEach((activity, index) => {
            const minutesFromNow = index * minutesPerActivity;
            const totalMinutes = currentMinute + minutesFromNow;
            const hours = Math.floor(totalMinutes / 60) + currentHour;
            const minutes = totalMinutes % 60;
    
            if (hours >= endHour) {
                UIHelpers.showToast("Attività oltre l'orario limite!", "warning");
                return;
            }
    
            const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            activity.querySelector('.timestamp').textContent = timeStr;
        });
    
        // Mostra un toast che le attività sono state distribuite correttamente
        UIHelpers.showToast("Attività distribuite correttamente!", "success");
    },
    
    distribute15MinBlocks() {
        const activities = Array.from(this.elements.activityList.children);
        let currentTime = new Date();
        currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 15) * 15); // Arrotonda ai prossimi 15 minuti

        activities.forEach(activity => {
            const hours = String(currentTime.getHours()).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            activity.querySelector('.timestamp').textContent = `${hours}:${minutes}`;
            currentTime.setMinutes(currentTime.getMinutes() + 15);
        });
    },

    sortActivitiesByTime() {
        const activities = Array.from(this.elements.activityList.children);
        activities.sort((a, b) => {
            const timeA = a.querySelector('.timestamp').textContent;
            const timeB = b.querySelector('.timestamp').textContent;
            return timeA.localeCompare(timeB);
        });

        activities.forEach(activity => this.elements.activityList.appendChild(activity));
    },

    initializeEventListeners() {
        this.elements.sortTimeButton.onclick = () => this.sortActivitiesByTime();

        this.elements.distribute16hButton.onclick = () => {
            this.distribute16Hours();
            UIHelpers.showToast("Attività distribuite su 16 ore attive (7:00-23:00)");
        };

        this.elements.distributeRemainingHoursButton.onclick = () => {
            this.distributeRemainingHours();
        };        

        this.elements.distribute15minButton.onclick = () => {
            this.distribute15MinBlocks();
            UIHelpers.showToast("Attività distribuite in blocchi da 15 minuti");
        };

        this.elements.saveButton.onclick = () => {
            SaveManager.saveToYAML();
            UIHelpers.showToast("Attività salvate in YAML");
        };

        this.elements.saveActivitiesCurrentButton.onclick = () => {
            SaveManager.saveActivities('Current');
            UIHelpers.showToast("Attività salvate in folder Current");
        };
    }
};