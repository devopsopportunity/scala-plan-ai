// activity-config.js
const ActivityConfig = {
    priorities: [
        { label: "Bassa", emoji: "🟩", value: "low", color: "#00FF00" },
        { label: "Media", emoji: "🟨", value: "medium", color: "#FFFF00" },
        { label: "Alta", emoji: "🟥", value: "high", color: "#FF0000" },
        { label: "Bloccata", emoji: "🟦", value: "blocked", color: "#0000FF" },
        { label: "Speciale", emoji: "🟪", value: "purple", color: "#800080" },
        { label: "Rallentamento", emoji: "🟧", value: "delay", color: "#FFA500" }
    ],
    statuses: [
        { label: "Completato", emoji: "🏁", value: "completed" },
        { label: "Alta Priorità", emoji: "🚩", value: "highPriority" },
        { label: "Collaborativo", emoji: "🎌", value: "collaborative" },
        { label: "Bloccato", emoji: "🏴", value: "blocked" },
        { label: "Pausa", emoji: "🏳", value: "pause" },
        { label: "Sperimentale", emoji: "🏴‍☠️", value: "experimental" },
        { label: "Revisione", emoji: "🔍", value: "review" },
        { label: "In Progresso", emoji: "⏳", value: "inProgress" },
        { label: "In Attesa", emoji: "🕒", value: "pending" },
        { label: "Annullato", emoji: "❌", value: "cancelled" }
    ],
    commonActivities: [
        { emoji: "💻", text: "Lavorare" },
        { emoji: "📝", text: "Pianificare" },
        { emoji: "🍴", text: "Pranzare" },
        { emoji: "🏃‍♂️", text: "Camminare" },
        { emoji: "🌙", text: "Riflettere" },
        { emoji: "📖", text: "Leggere" },
        { emoji: "🧘", text: "Meditare" }
    ],

    initQuickOptions(elements, callbackAddActivity, callbackClose) {
        const quickOptionsContainer = document.querySelector('.quick-options');
        
        // Puliamo il contenitore per evitare duplicazioni
        quickOptionsContainer.innerHTML = '';
    
        // Aggiungiamo ogni attività come bottone
        this.commonActivities.forEach(activity => {
            const button = document.createElement('button');
            button.classList.add('quick-option');
            button.setAttribute('data-emoji', activity.emoji);
            button.textContent = `${activity.emoji} ${activity.text}`;
            
            // Aggiungi l'evento di click, passiamo entrambe le callback
            button.addEventListener("click", () => {
                this.handleQuickOptionClick(button, ActivityPopup.elements, callbackAddActivity, callbackClose);
            });
            
            quickOptionsContainer.appendChild(button);
        })
    },  

    handleQuickOptionClick(button, elements, callbackAddActivity, callbackClose) {
        // Recupera tutti i dati necessari
        const emoji = button.getAttribute("data-emoji");
        const description = button.textContent.replace(emoji, "").trim();
        const startTime = elements.startTimeInput.value;
        const deadline = elements.deadlineInput.value;
        const duration = elements.durationInput.value;
        const priority = elements.prioritySelector.value;
        const status = elements.statusSelector.value;

        // Esegui la prima callback (aggiungi l'attività alla lista)
        callbackAddActivity(emoji, description, startTime, deadline, duration, priority, status);
        
        // Esegui la seconda callback (chiudi la finestra)
        callbackClose();

        // Mostra un messaggio di conferma
        UIHelpers.showToast("Attività aggiunta");
    },

    init() {
        const prioritySelector = document.getElementById('prioritySelector');
        const statusSelector = document.getElementById('statusSelector');
        
        this.priorities.forEach(priority => {
            const option = new Option(`${priority.emoji} ${priority.label}`, priority.emoji);
            prioritySelector.add(option);
        });
        
        this.statuses.forEach(status => {
            const option = new Option(`${status.emoji} ${status.label}`, status.emoji);
            statusSelector.add(option);
        });
    }
};
