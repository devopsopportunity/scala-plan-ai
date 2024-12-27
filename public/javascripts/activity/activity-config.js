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
        { label: "Sperimentale", emoji: "🏴‍☠️", value: "experimental" }
    ],

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
