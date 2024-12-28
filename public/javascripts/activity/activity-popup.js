// activity-popup.js
const ActivityPopup = {
    elements: {
        popup: document.getElementById("myPopup"),
        addActivityButton: document.getElementById("addActivity"),
        newActivityInput: document.getElementById("newActivity"),
        startTimeInput: document.getElementById("startTime"),
        deadlineInput: document.getElementById("deadline"),
        durationInput: document.getElementById("duration"),
        prioritySelector: document.getElementById("prioritySelector"),
        statusSelector: document.getElementById("statusSelector"),
        quickOptions: document.querySelectorAll(".quick-option")
    },

    init() {
        this.initializeEventListeners();
        this.initializePopupObserver();
        this.initializeTextLimit();
    },

    open() {
        this.elements.popup.style.display = "block";
    },

    close() {
        ActivityPopup.elements.popup.style.display = "none";
    },

    initializeTextLimit() {
        // Aggiungi il limite di caratteri all'input dell'attività
        this.elements.newActivityInput.maxLength = 50;
        
        // Opzionale: aggiungi un counter visuale
        const container = this.elements.newActivityInput.parentElement;
        const counter = document.createElement('span');
        counter.className = 'char-counter';
        counter.style.fontSize = '0.8em';
        counter.style.color = '#666';
        container.appendChild(counter);

        const updateCounter = () => {
            const remaining = 50 - this.elements.newActivityInput.value.length;
            counter.textContent = `${remaining} caratteri rimanenti`;
        };

        this.elements.newActivityInput.addEventListener('input', updateCounter);
        updateCounter(); // Inizializza il counter
    },

    initializePopupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'style' &&
                    this.elements.popup.style.display === 'block') {
                    this.updateTimeInputs();
                }
            });
        });

        observer.observe(this.elements.popup, {
            attributes: true,
            attributeFilter: ['style']
        });
    },

    updateTimeInputs() {
        const now = new Date();
        
        // Aggiorna startTimeInput (ora di inizio) - 5 minuti nel futuro
        const futureTime = new Date(now.getTime() + 5 * 60000);
        const startHours = String(futureTime.getHours()).padStart(2, '0');
        const startMinutes = String(futureTime.getMinutes()).padStart(2, '0');
        this.elements.startTimeInput.value = `${startHours}:${startMinutes}`;
        this.elements.startTimeInput.min = `${startHours}:${startMinutes}`;

        // Aggiorna deadlineInput (data di scadenza) - giorno successivo
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        this.elements.deadlineInput.value = tomorrowStr;
        this.elements.deadlineInput.min = now.toISOString().split('T')[0];
    },

    initializeEventListeners() {

        this.elements.addActivityButton.onclick = () => {
            const newActivity = this.elements.newActivityInput.value.trim();
            const startTime = this.elements.startTimeInput.value;
            const deadline = this.elements.deadlineInput.value;
            const duration = this.elements.durationInput.value;
            const priority = this.elements.prioritySelector.value;
            const status = this.elements.statusSelector.value;

            if (newActivity) {
                ActivityCore.addActivityToList("📝", newActivity, startTime, deadline, duration, priority, status);
                this.elements.newActivityInput.value = "";
                this.close();
                UIHelpers.showToast("Attività aggiunta");
            } else {
                alert("Per favore, inserisci un'attività valida.");
            }
        };

        ActivityConfig.initQuickOptions(this.elements, ActivityCore.addActivityToList, ActivityPopup.close)

        /*
        ActivityConfig.initQuickOptions();

        this.elements.quickOptions.forEach(button => {
            button.addEventListener("click", () => {
                const emoji = button.getAttribute("data-emoji");
                const description = button.textContent.replace(emoji, "").trim();
                const startTime = this.elements.startTimeInput.value;
                const deadline = this.elements.deadlineInput.value;
                const duration = this.elements.durationInput.value;
                const priority = this.elements.prioritySelector.value;
                const status = this.elements.statusSelector.value;
                    
                ActivityCore.addActivityToList(emoji, description, startTime, deadline, duration, priority, status);
                this.close();
                UIHelpers.showToast("Attività aggiunta");
            });
        });
        */

        // Validazione input temporali
        this.elements.startTimeInput.addEventListener('input', (e) => {
            const selectedTime = e.target.value;
            const now = new Date();
            const currentHours = String(now.getHours()).padStart(2, '0');
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentTimeStr = `${currentHours}:${currentMinutes}`;
            
            if (selectedTime < currentTimeStr) {
                const futureTime = new Date(now.getTime() + 5 * 60000);
                const futureHours = String(futureTime.getHours()).padStart(2, '0');
                const futureMinutes = String(futureTime.getMinutes()).padStart(2, '0');
                e.target.value = `${futureHours}:${futureMinutes}`;
            }
        });

        this.elements.deadlineInput.addEventListener('input', (e) => {
            const selectedDate = new Date(e.target.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                e.target.value = today.toISOString().split('T')[0];
            }
        });

        const closeButton = document.querySelector(".close");
        if (closeButton) {
            closeButton.onclick = () => this.close();
        }

        window.onclick = event => {
            if (event.target == this.elements.popup) {
                this.close();
            }
        };
    }
};