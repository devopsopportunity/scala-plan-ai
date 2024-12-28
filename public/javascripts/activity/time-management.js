// time-management.js
// Time distribution and management functions
const TimeManagement = {
    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    },

    distribute16Hours() {
        const items = [...ActivityCore.elements.activityList.querySelectorAll('.list-item')];
        if (items.length === 0) return;

        const startDayMinutes = 7 * 60;  // 7:00
        const endDayMinutes = 23 * 60;   // 23:00
        const availableMinutes = endDayMinutes - startDayMinutes;
        const intervalMinutes = Math.floor(availableMinutes / (items.length + 1));
        
        UIHelpers.applyTransitionEffect(items, '#e3f2fd');

        items.forEach((item, index) => {
            const newTimeMinutes = startDayMinutes + (intervalMinutes * (index + 1));
            const timestamp = item.querySelector('.timestamp');
            timestamp.textContent = this.minutesToTime(newTimeMinutes);
        });
    },

    distribute15MinBlocks() {
        const items = [...ActivityCore.elements.activityList.querySelectorAll('.list-item')];
        if (items.length === 0) return;

        let currentMinutes = 7 * 60;
        UIHelpers.applyTransitionEffect(items, '#f3e5f5');

        items.forEach(item => {
            if (currentMinutes >= 23 * 60) {
                currentMinutes = 7 * 60;
            }
            
            const timestamp = item.querySelector('.timestamp');
            timestamp.textContent = this.minutesToTime(currentMinutes);
            currentMinutes += 15;
        });
    },

    sortActivitiesByTime() {
        const items = [...ActivityCore.elements.activityList.querySelectorAll('.list-item')];
        
        items.sort((a, b) => {
            const [hoursA, minutesA] = a.querySelector('.timestamp').textContent.split(':').map(Number);
            const [hoursB, minutesB] = b.querySelector('.timestamp').textContent.split(':').map(Number);
            return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
        });

        UIHelpers.applyTransitionEffect(items, '#f0f8ff');
        items.forEach(item => ActivityCore.elements.activityList.appendChild(item));
        UIHelpers.showToast("Attività ordinate per tempo");
    },

    getCurrentTime() {
        // Crea un oggetto con il titolo e il nome del file
        const date = new Date();
        const currentTimestamp = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return currentTimestamp
    }
};