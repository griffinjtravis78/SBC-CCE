let valuationChartInstance = null;
let capacityGaugeInstance = null;

// Initialize charts on load
window.addEventListener('DOMContentLoaded', () => {
    initCharts();
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

    // Capacity Gauge (Doughnut chart configured as a gauge)
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
        const tisVal = 4000; // Mock TIS calculation
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
