// editors.js
const Editors = {
    // Handle editing of activity text
    handleTextEdit(currentText) {
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.value = currentText.textContent.trim();
        textInput.className = "text-editor";
        textInput.maxLength = 50;
        textInput.style.width = "auto";
        textInput.style.boxSizing = "border-box";
        textInput.placeholder = "Es. 💼 Lavoro, 🎉 Tempo libero";
    
        // Aggiungi il bordo temporaneo per evidenziare la modifica
        textInput.style.border = "2px solid #4CAF50";  // Colore di bordo evidenziato
        textInput.style.transition = "border 0.3s ease";  // Transizione per far sparire il bordo
    
        currentText.replaceWith(textInput);
        textInput.focus();
    
        // Funzione per salvare il testo
        const saveText = () => {
            const trimmedText = textInput.value.trim() || "Descrizione non inserita";
            currentText.textContent = trimmedText;
            
            // Rimuovi il bordo prima di sostituire il textInput con il testo
            textInput.style.border = "none";  // Rimuove il bordo evidenziato
    
            // Usa un timeout per ritardare la sostituzione, per evitare conflitti
            setTimeout(() => {
                textInput.replaceWith(currentText);  // Sostituisci l'input con il testo modificato
                UIHelpers.showToast("Descrizione salvata con successo.");
            }, 0);  // Ritardo di 0 ms, ma assicura che venga eseguito dopo il ciclo corrente
        };
    
        // Eventi per il salvataggio
        textInput.addEventListener("blur", saveText);
        textInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                saveText();
            }
        });
    },
    
    // Handle editing of the time field
    handleTimeEdit(currentTimestamp) {
        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.value = currentTimestamp.textContent;
        timeInput.className = "time-editor";        

        currentTimestamp.replaceWith(timeInput);
        timeInput.focus();

        // Save the edited time
        const saveTime = () => {
            currentTimestamp.textContent = timeInput.value || currentTimestamp.textContent;
            timeInput.replaceWith(currentTimestamp);

            UIHelpers.showToast("Orario aggiornato correttamente.");
        };

        timeInput.addEventListener("blur", saveTime);
        timeInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                saveTime();
            }
        });
    },

    // Handle editing of the duration field
    handleDurationEdit(currentDuration) {
        const durationInput = document.createElement("input");
        durationInput.type = "number";
        durationInput.value = currentDuration.textContent.trim().replace(/[^\d]/g, ''); // Extract the number part
        durationInput.className = "duration-editor";
        durationInput.max = 1440;  // Max duration in minutes (24 hours)
        durationInput.placeholder = "Es. 30"

        currentDuration.replaceWith(durationInput);
        durationInput.focus();

        // Save the edited duration
        const saveDuration = () => {
            const duration = durationInput.value.trim() || "0";
            currentDuration.textContent = `(${duration} min)`;
            durationInput.replaceWith(currentDuration);

            UIHelpers.showToast("Durata aggiornata correttamente.");
        };

        durationInput.addEventListener("blur", saveDuration);
        durationInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                saveDuration();
            }
        });
    },

    // Handle editing of the priority field
    handlePriorityEdit(currentPriority) {
        const priorityInput = document.createElement("select");
        priorityInput.className = "priority-editor";

        // Add priority options dynamically from ActivityConfig
        ActivityConfig.priorities.forEach(priority => {
            const option = document.createElement("option");
            option.value = priority.emoji;
            option.textContent = `${priority.emoji} ${priority.label}`;
            priorityInput.appendChild(option);
        });
        
        priorityInput.value = currentPriority.textContent.trim();

        currentPriority.replaceWith(priorityInput);
        priorityInput.focus();

        // Save the edited priority
        const savePriority = () => {
            currentPriority.textContent = priorityInput.value || currentPriority.textContent;
            priorityInput.replaceWith(currentPriority);

            UIHelpers.showToast("Priorità aggiornata correttamente.");
        };

        priorityInput.addEventListener("blur", savePriority);
        priorityInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                savePriority();
            }
        });
    },

    // Handle editing of the status field
    handleStatusEdit(currentStatus) {
        const statusInput = document.createElement("select");
        statusInput.className = "status-editor";

        // Add status options dynamically from ActivityConfig
        ActivityConfig.statuses.forEach(status => {
            const option = document.createElement("option");
            option.value = status.emoji;
            option.textContent = `${status.emoji} ${status.label}`;
            statusInput.appendChild(option);
        });
        
        statusInput.value = currentStatus.textContent.trim();

        currentStatus.replaceWith(statusInput);
        statusInput.focus();

        // Save the edited status
        const saveStatus = () => {
            currentStatus.textContent = statusInput.value || currentStatus.textContent;
            statusInput.replaceWith(currentStatus);

            UIHelpers.showToast("Status aggiornato correttamente.");
        };

        statusInput.addEventListener("blur", saveStatus);
        statusInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                saveStatus();
            }
        });
    },

    // Initialize editors for activity fields
    initializeEditors() {
        ActivityCore.elements.activityList.addEventListener("click", event => {
            const target = event.target;

            if (target.classList.contains("activity-text")) {
                this.handleTextEdit(target);
            }

            if (target.classList.contains("timestamp")) {
                this.handleTimeEdit(target);
            }

            if (target.classList.contains("duration")) {
                this.handleDurationEdit(target);
            }

            if (target.classList.contains("priority")) {
                this.handlePriorityEdit(target);
            }

            if (target.classList.contains("status")) {
                this.handleStatusEdit(target);
            }
        });
    }
};
