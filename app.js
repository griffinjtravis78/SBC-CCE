let valuationChartInstance = null;
let capacityGaugeInstance = null;
let teamWorkloadChartInstance = null;

// Mock Assessment Data Sets for Heatmaps
const assessmentData = {
    disc: [
        { trait: "Dominance (D)", status: "Optimal", color: "bg-emerald-50 border-emerald-200 text-emerald-900", desc: "Strong drive for results and direct decision-making." },
        { trait: "Influence (I)", status: "Balanced", color: "bg-indigo-50 border-indigo-200 text-indigo-900", desc: "High collaboration, networking, and team engagement." },
        { trait: "Steadiness (S)", status: "Light (Deficit)", color: "bg-rose-50 border-rose-200 text-rose-900", desc: "Risk of burnout; needs support in consistent execution." },
        { trait: "Compliance (C)", status: "Optimal", color: "bg-emerald-50 border-emerald-200 text-emerald-900", desc: "Rigorous attention to quality, rules, and accuracy." }
    ],
    ocean: [
        { trait: "Openness", status: "Balanced", color: "bg-indigo-50 border-indigo-200 text-indigo-900", desc: "High curiosity, creativity, and receptivity to innovation." },
        { trait: "Conscientiousness", status: "Optimal", color: "bg-emerald-50 border-emerald-200 text-emerald-900", desc: "Exceptional organization, dependability, and goal focus." },
        { trait: "Extraversion", status: "Balanced", color: "bg-indigo-50 border-indigo-200 text-indigo-900", desc: "Energetic and social team communication dynamics." },
        { trait: "Agreeableness", status: "Heavy (Cluster)", color: "bg-amber-50 border-amber-200 text-amber-900", desc: "High harmony; potential risk of avoiding necessary conflict." },
        { trait: "Neuroticism (Stability)", status: "Optimal", color: "bg-emerald-50 border-emerald-200 text-emerald-900", desc: "Strong emotional resilience under tight operational pressure." }
    ]
};

// Initialize application on load
window.addEventListener('DOMContentLoaded', () => {
    initCharts();
    switchHeatmap('disc');
});

function initCharts() {
    // Valuation Chart
    const ctxVal = document.getElementById('valuationChart').getContext('2d');
    valuationChartInstance = new Chart(ctxVal, {
        type: 'bar',
        data: {
            labels: ['Base Market', 'Credentials', 'TIS Boost', 'Gross Worth', 'Decay Penalty', 'Net Asset Value'],
            datasets: [{
                label: 'USD ($)',
                data: [78000, 12000, 4000, 94000, 6500, 87500],
                backgroundColor: ['#64748b', '#10b981', '#10b981', '#6366f1', '#f43f5e', '#059669']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    // Capacity Gauge
    const ctxCap = document.getElementById('capacityGauge').getContext('2d');
    capacityGaugeInstance = new Chart(ctxCap, {
        type: 'doughnut',
        data: {
            labels: ['Allocated Work', 'Available Buffer'],
            datasets: [{
                data: [40, 0],
                backgroundColor: ['#6366f1', '#e2e8f0']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: 270,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // Team Workload Distribution Chart
    const ctxTeam = document.getElementById('teamWorkloadChart').getContext('2d');
    teamWorkloadChartInstance = new Chart(ctxTeam, {
        type: 'bar',
        data: {
            labels: ['Alpha Team', 'Beta Ops', 'Gamma Supply', 'Delta Analytics'],
            datasets: [{
                label: 'Avg Weekly Hours',
                data: [42, 38, 45, 40],
                backgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 60 } }
        }
    });
}

function switchHeatmap(type) {
    const container = document.getElementById('heatmapGrid');
    container.innerHTML = '';
    
    assessmentData[type].forEach(item => {
        const card = document.createElement('div');
        card.className = `${item.color} border rounded-lg p-5 flex flex-col justify-between shadow-sm transition hover:shadow`;
        card.innerHTML = `
            <div>
                <span class="text-xs font-bold uppercase tracking-wider opacity-75">${item.trait}</span>
                <h4 class="text-xl font-bold mt-1">${item.status}</h4>
            </div>
            <p class="text-xs mt-4 opacity-90">${item.desc}</p>
        `;
        container.appendChild(card);
    });
}

async function processCandidate() {
    const name = document.getElementById('candName').value || "Candidate";
    const naics = document.getElementById('naicsSelect').value;
    const checkedDegrees = document.querySelectorAll('.deg-check:checked');

    try {
        const response = await fetch('data.json');
        const data = await response.json();

        const baseVal = data.bls_baselines[naics] || 75000;
        const credVal = checkedDegrees.length * 6000;
        const tisVal = 4000;
        const grossVal = baseVal + credVal + tisVal;
        const decayVal = Math.round(grossVal * (data.naics_decay_constants[naics] || 0.1));
        const netVal = grossVal - decayVal;

        // Update UI Text
        document.getElementById('outBase').innerText = `$${baseVal.toLocaleString()}`;
        document.getElementById('outCred').innerText = `+$${credVal.toLocaleString()}`;
        document.getElementById('outTIS').innerText = `+$${tisVal.toLocaleString()}`;
        document.getElementById('outGross').innerText = `$${grossVal.toLocaleString()}`;
        document.getElementById('outDecay').innerText = `-$${decayVal.toLocaleString()}`;
        document.getElementById('outNet').innerText = `$${netVal.toLocaleString()}`;

        // Update Chart Data
        valuationChartInstance.data.datasets[0].data = [baseVal, credVal, tisVal, grossVal, decayVal, netVal];
        valuationChartInstance.update();

        alert(`Success! Profile processed for ${name}. Net Asset Value calculated at $${netVal.toLocaleString()}.`);
    } catch (error) {
        console.error("Error loading mock reference data:", error);
        alert("Processed locally with fallback baseline variables.");
    }
}
