async function loadStagingData() {
    try {
        const [candRes, teamRes, taskRes] = await Promise.all([
            fetch('data/candidates.json'),
            fetch('data/team_members.json'),
            fetch('data/tasks.json')
        ]);
        
        const candidates = await candRes.json();
        const teamMembers = await teamRes.json();
        const tasks = await taskRes.json();

        console.log(`Loaded Staging Data: ${candidates.length} candidates, ${teamMembers.length} team members, ${tasks.length} tasks.`);
    } catch (error) {
        console.error("Error loading staging data files:", error);
    }
}

// Call on page load
window.addEventListener('DOMContentLoaded', () => {
    loadStagingData();
});
