// save-manager.js
// Save and export functionality
const SaveManager = {
    getStatus(activityTime) {
        const now = new Date();
        const [hour, minute] = activityTime.split(':').map(num => parseInt(num, 10));
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        return (hour > currentHour || (hour === currentHour && minute > currentMinute))
            ? '⏳' // Attività futura
            : '🟠'; // Attività passata
    },

    saveToYAML() {
        const items = [...ActivityCore.elements.activityList.querySelectorAll('.list-item')];
        if (items.length === 0) return;

        const activities = this.getActivitiesData(items);
        const fileContent = this.createYAMLContent(activities);
        const yamlContent = jsyaml.dump(fileContent);
        
        this.downloadYAMLFile(yamlContent, fileContent.fileName);
        UIHelpers.applyTransitionEffect(items, '#f3e5f5');
    },

    saveActivities(folderType) {
        const items = [...ActivityCore.elements.activityList.querySelectorAll('.list-item')];
        if (items.length === 0) return;

        const activities = this.getActivitiesData(items);
        let postData = this.createPostData(activities);

        this.sendActivitiesToServer(postData, items);
    },

    getActivitiesData(items) {
        return items.map(item => ({
            time: item.querySelector('.timestamp').textContent,
            emoji: item.querySelector('.emoji').textContent,
            description: item.querySelector('.activity-text').textContent
        }));
    },

    createYAMLContent(activities) {
        const date = new Date();
        return {
            title: `Oggi ${date.toLocaleDateString()} alle ${date.toLocaleTimeString()}`,
            fileName: `activities-${date.toISOString().split('.')[0].replace(/:/g, '-')}.yaml`,
            activities: activities.map(({time, emoji, description}) => ({
                time,
                description: `${emoji} ${description}`
            }))
        };
    },

    downloadYAMLFile(content, fileName) {
        const blob = new Blob([content], { type: 'application/x-yaml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    },

    createPostData(activities) {
        let postData = `activities:\n`;
        activities.forEach(({time, emoji, description}) => {
            const status = this.getStatus(time);
            postData += `  - time: '${time}'\n    description: ${emoji} ${description}\n    status: ${status}\n`;
        });
        return postData;
    },

    sendActivitiesToServer(postData, items) {
        fetch('/saveActivities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/yaml' },
            body: postData,
        })
        .then(response => response.text())
        .then(data => {
            UIHelpers.showToast(`Attività salvate con successo: ${data}`);
            UIHelpers.applyTransitionEffect(items, '#f3e5f5');
        })
        .catch(error => {
            console.error('Errore durante il salvataggio delle attività:', error);
            UIHelpers.showToast("Errore durante il salvataggio delle attività");
        });
    }
};