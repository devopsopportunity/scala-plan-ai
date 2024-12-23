document.addEventListener("DOMContentLoaded", function () {

    console.log("ScalaAI loaded! 😊");
    // Inizia qui ad aggiungere logica

    // DOM Elements
    const activityList = document.getElementById("activityList");
    const popup = document.getElementById("myPopup");
    const addActivityButton = document.getElementById("addActivity");
    const newActivityInput = document.getElementById("newActivity");
    const quickOptions = document.querySelectorAll(".quick-option");
    const sortTimeButton = document.getElementById("sortTime");
    const distribute16hButton = document.getElementById("distribute16h");
    const distribute15minButton = document.getElementById("distribute15min");            
    const saveButton = document.getElementById("save");

    // Funzioni di utilità per il tempo
    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    // Funzione per distribuire le attività in 16 ore
    function distribute16Hours() {
        const items = [...activityList.querySelectorAll('.list-item')];
        if (items.length === 0) return;

        // Definizione dei limiti temporali (7:00 - 23:00)
        const startDayMinutes = 7 * 60;  // 7:00
        const endDayMinutes = 23 * 60;   // 23:00
        const availableMinutes = endDayMinutes - startDayMinutes;
        
        // Calcola l'intervallo tra le attività
        const intervalMinutes = Math.floor(availableMinutes / (items.length + 1));
        
        // Effetto visuale di inizio
        items.forEach(item => {
            item.style.transition = 'all 0.5s ease-in-out';
            item.style.backgroundColor = '#e3f2fd';
        });

        // Distribuisci le attività
        items.forEach((item, index) => {
            const newTimeMinutes = startDayMinutes + (intervalMinutes * (index + 1));
            const newTime = minutesToTime(newTimeMinutes);
            
            // Aggiorna il timestamp con animazione
            const timestamp = item.querySelector('.timestamp');
            timestamp.textContent = newTime;
            
            // Effetto di highlight temporaneo
            setTimeout(() => {
                item.style.backgroundColor = '';
            }, 500);
        });
    }

    // Funzione per distribuire le attività in blocchi da 15 minuti
    function distribute15MinBlocks() {
        const items = [...activityList.querySelectorAll('.list-item')];
        if (items.length === 0) return;

        // Inizia dalle 7:00
        let currentMinutes = 7 * 60;
        
        // Effetto visuale di inizio
        items.forEach(item => {
            item.style.transition = 'all 0.5s ease-in-out';
            item.style.backgroundColor = '#f3e5f5';
        });

        // Distribuisci le attività in blocchi da 15 minuti
        items.forEach((item, index) => {
            const timestamp = item.querySelector('.timestamp');
            
            // Se l'orario supera le 23:00, ricomincia dal giorno dopo alle 7:00
            if (currentMinutes >= 23 * 60) {
                currentMinutes = 7 * 60;
            }
            
            const newTime = minutesToTime(currentMinutes);
            timestamp.textContent = newTime;
            
            // Aggiungi 15 minuti per la prossima attività
            currentMinutes += 15;
            
            // Effetto di highlight temporaneo
            setTimeout(() => {
                item.style.backgroundColor = '';
            }, 500);
        });
    }

    // Funzione per salvare le attività in formato YAML
    function saveToYAML() {
        const items = [...activityList.querySelectorAll('.list-item')];
        if (items.length === 0) return;

        // Crea un array di oggetti che rappresentano le attività
        const activities = items.map(item => {
            const time = item.querySelector('.timestamp').textContent;
            const emoji = item.querySelector('.emoji').textContent;
            const description = item.querySelector('.activity-text').textContent;

            // Combina emoji e descrizione in un unico campo
            const combinedDescription = `${emoji} ${description}`;

            return {
                time: time,
                description: combinedDescription
            };
        });

        // Crea un oggetto con il titolo e il nome del file
        const date = new Date();
        const title = `Oggi ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} alle ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        const fileName = `activities-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}.yaml`;

        const fileContent = {
            title: title,
            fileName: fileName,
            activities: activities
        };

        // Converti l'oggetto in formato YAML
        const yamlContent = jsyaml.dump(fileContent);

        // Crea un blob con il contenuto YAML
        const blob = new Blob([yamlContent], { type: 'application/x-yaml' });

        // Crea un link per scaricare il file YAML
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        // Simula un clic sul link per avviare il download
        link.click();

        // Effetto visivo di inizio
        items.forEach(item => {
            item.style.transition = 'all 0.5s ease-in-out';
            item.style.backgroundColor = '#f3e5f5';
        });

        // Effetto di highlight temporaneo
        setTimeout(() => {
            items.forEach(item => {
                item.style.backgroundColor = '';
            });
        }, 500);

        // Mostra un toast di conferma
        showToast("Attività salvate in formato YAML");
    }

    // Funzione per mostrare un toast di conferma
    function showToast(message) {
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
        
        // Mostra e nasconde il toast
        setTimeout(() => { toast.style.opacity = '1'; }, 100);
        setTimeout(() => { 
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Time Sorting Function
    function sortActivitiesByTime() {
        const items = [...activityList.querySelectorAll('.list-item')];
        
        items.sort((a, b) => {
            const timeA = a.querySelector('.timestamp').textContent;
            const timeB = b.querySelector('.timestamp').textContent;
            
            // Converti i tempi in minuti per confrontarli
            const [hoursA, minutesA] = timeA.split(':').map(Number);
            const [hoursB, minutesB] = timeB.split(':').map(Number);
            
            const totalMinutesA = hoursA * 60 + minutesA;
            const totalMinutesB = hoursB * 60 + minutesB;
            
            return totalMinutesA - totalMinutesB;
        });

        // Effetto visuale durante l'ordinamento
        items.forEach(item => {
            item.style.transition = 'all 0.3s ease-in-out';
            item.style.backgroundColor = '#f0f8ff';  // Colore di evidenziazione
        });

        // Rimuovi e reinserisci gli elementi ordinati
        items.forEach(item => activityList.appendChild(item));

        // Ripristina lo stile dopo l'animazione
        setTimeout(() => {
            items.forEach(item => {
                item.style.backgroundColor = '';
            });
            // Mostra un toast di conferma
            showToast("Attività ordinate per tempo");
        }, 300);
    }

    // Drag and Drop Functions
    function initializeDragAndDrop() {
        activityList.addEventListener("dragstart", handleDragStart);
        activityList.addEventListener("dragend", handleDragEnd);
        activityList.addEventListener("dragover", handleDragOver);
        
        // Set draggable attribute
        activityList.querySelectorAll(".list-item").forEach(item => {
            item.setAttribute("draggable", "true");
        });
    }

    function handleDragStart(event) {
        if (event.target.classList.contains("list-item")) {
            event.dataTransfer.setData("text/plain", event.target.id);
            event.target.classList.add("dragging");
        }
    }

    function handleDragEnd(event) {
        if (event.target.classList.contains("list-item")) {
            event.target.classList.remove("dragging");
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        const draggingElement = activityList.querySelector(".dragging");
        const closestElement = getClosestElement(activityList, event.clientY);
        
        if (closestElement && closestElement !== draggingElement) {
            activityList.insertBefore(draggingElement, closestElement);
        }
    }

    function getClosestElement(container, mouseY) {
        const listItems = [...container.querySelectorAll(".list-item:not(.dragging)")];
        return listItems.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = mouseY - box.top - box.height / 2;
            return offset < 0 && offset > closest.offset 
                ? { offset, element: child }
                : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Activity Management Functions
    function addActivityToList(emoji, description) {
        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newListItem = document.createElement("li");
        newListItem.className = "list-item";
        newListItem.setAttribute("draggable", "true");
        newListItem.setAttribute("id", `item-${activityList.children.length}`);
        newListItem.innerHTML = `
            <span class='timestamp'>${time}</span>
            <span class='emoji'>${emoji}</span>
            <span class='activity-text'>${description}</span>
        `;
        
        addDeleteButton(newListItem);
        activityList.appendChild(newListItem);
        // Mostra un toast di conferma
        showToast("Attività aggiunta");
    }

    function addDeleteButton(item) {
        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Rimuovi";
        deleteBtn.textContent = "🗑️";
        deleteBtn.onclick = () => item.remove();
        item.appendChild(deleteBtn);
        // Mostra un toast di conferma
        showToast("Attività eliminata");
    }

    // Edit Functions
    function saveText(originalElement, inputElement) {
        originalElement.textContent = inputElement.value;
        inputElement.replaceWith(originalElement);
        // Mostra un toast di conferma
        showToast("Testo Attività salvato");
    }

    function saveTime(originalElement, inputElement) {
        originalElement.textContent = inputElement.value;
        inputElement.replaceWith(originalElement);
        showToast("Tempo Attività salvata");
    }

    // Aggiunta dei nuovi event listeners nella funzione initializeEventListeners
    // Event Listeners
    function initializeEventListeners() {
        // Sort button
        sortTimeButton.onclick = sortActivitiesByTime;

        // Add activity button
        addActivityButton.onclick = () => {
            const newActivity = newActivityInput.value.trim();
            if (newActivity) {
                addActivityToList("📝", newActivity);
                newActivityInput.value = "";
                popup.style.display = "none";
            } else {
                alert("Per favore, inserisci un'attività valida.");
            }
        };

        // Quick options
        quickOptions.forEach(button => {
            button.addEventListener("click", () => {
                const emoji = button.getAttribute("data-emoji");
                const description = button.textContent.replace(emoji, "").trim();
                addActivityToList(emoji, description);
                popup.style.display = "none";
            });
        });

        // Edit functionality
        activityList.addEventListener("click", event => {
            if (event.target.classList.contains("activity-text")) {
                handleTextEdit(event.target);
            }
            if (event.target.classList.contains("timestamp")) {
                handleTimeEdit(event.target);
            }
        });

        // Popup controls
        document.getElementById("openPopup").onclick = () => popup.style.display = "block";
        document.querySelector(".close").onclick = () => popup.style.display = "none";
        window.onclick = event => {
            if (event.target == popup) {
                popup.style.display = "none";
            }
        };

        // Nuovo evento per distribuzione 16 ore
        distribute16hButton.onclick = () => {
            distribute16Hours();
            // Mostra un toast di conferma
            showToast("Attività distribuite su 16 ore attive (7:00-23:00)");
        };

        // Nuovo evento per distribuzione 15 minuti
        distribute15minButton.onclick = () => {
            distribute15MinBlocks();
            // Mostra un toast di conferma
            showToast("Attività distribuite in blocchi da 15 minuti");
        };

        saveButton.onclick = () => {
            saveToYAML();
            // Mostra un toast di conferma
            showToast("Attività salvate in YAML");
        };
    }

    function handleTextEdit(currentText) {
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.value = currentText.textContent;
        textInput.className = "text-editor";

        currentText.replaceWith(textInput);
        textInput.focus();

        textInput.addEventListener("blur", () => saveText(currentText, textInput));
        textInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                saveText(currentText, textInput);
            }
        });
    }

    function handleTimeEdit(currentTimestamp) {
        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.value = currentTimestamp.textContent;
        timeInput.className = "time-editor";

        currentTimestamp.replaceWith(timeInput);
        timeInput.focus();

        timeInput.addEventListener("blur", () => saveTime(currentTimestamp, timeInput));
        timeInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                saveTime(currentTimestamp, timeInput);
            }
        });
    }

    // Initialize everything
    initializeDragAndDrop();
    initializeEventListeners();
    activityList.querySelectorAll(".list-item").forEach(addDeleteButton); 
}); 
