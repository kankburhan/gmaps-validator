document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const validateBtn = document.getElementById('validateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const keyStatusBadge = document.getElementById('keyStatusBadge');
    const servicesGrid = document.getElementById('servicesGrid');
    const costTableBody = document.getElementById('costTableBody');
    const totalCostDisplay = document.getElementById('totalCost');
    const riskLevelDisplay = document.getElementById('riskLevel');
    const reqRange = document.getElementById('reqRange');
    const reqCountDisplay = document.getElementById('reqCountDisplay');

    // Pricing Constants (approximate pricing per 1000 requests)
    const PRICING = {
        'Maps JavaScript API': 7.00,
        'Directions API': 5.00,
        'Geocoding API': 5.00,
        'Places API (New)': 17.00, // Using a high-tier average for estimation
        'Distance Matrix API': 10.00
    };

    let currentEnabledApis = [];

    // Event Listeners
    validateBtn.addEventListener('click', startValidation);
    apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startValidation();
    });

    reqRange.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        reqCountDisplay.textContent = value.toLocaleString();
        updatePricing(value);
    });

    async function startValidation() {
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            alert('Please enter an API key');
            return;
        }

        // UI Reset
        setLoading(true);
        resultsSection.classList.add('hidden');
        servicesGrid.innerHTML = '';
        currentEnabledApis = [];

        // Basic Pattern Check
        if (apiKey.length < 30 || !apiKey.startsWith('AIza')) {
            showResults(false, []);
            setLoading(false);
            return;
        }

        // Perform Checks
        const results = await Promise.all([
            checkMapsJS(apiKey),
            checkStaticMap(apiKey),
            checkGeocoding(apiKey),
            checkDirections(apiKey),
            checkPlaces(apiKey)
            // Add more checks here
        ]);

        const enabledServices = results.filter(r => r.status === 'success');
        const validKey = enabledServices.length > 0;

        showResults(validKey, results);
        setLoading(false);
    }

    function setLoading(isLoading) {
        const btnText = validateBtn.querySelector('.btn-text');
        const loader = validateBtn.querySelector('.loader');

        if (isLoading) {
            btnText.textContent = 'Checking...';
            loader.classList.add('active');
            apiKeyInput.disabled = true;
            validateBtn.disabled = true;
        } else {
            btnText.textContent = 'Validate Key';
            loader.classList.remove('active');
            apiKeyInput.disabled = false;
            validateBtn.disabled = false;
        }
    }

    // --- API CHECKERS ---

    function checkMapsJS(key) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=Function.prototype`;
            script.onload = () => {
                resolve({ name: 'Maps JavaScript API', status: 'success', msg: 'Authorized' });
                script.remove();
            };
            script.onerror = () => {
                // Assume success if onload fires, failure if onerror fires

                resolve({ name: 'Maps JavaScript API', status: 'error', msg: 'Failed to load' });
                script.remove();
            };
            document.head.appendChild(script);
        });
    }

    async function checkStaticMap(key) {
        // Static Maps API
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=1x1&key=${key}`;
        return checkFetch(url, 'Static Maps API');
    }

    async function checkGeocoding(key) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${key}`;
        return checkFetch(url, 'Geocoding API');
    }

    async function checkDirections(key) {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=${key}`;
        return checkFetch(url, 'Directions API');
    }

    async function checkPlaces(key) {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${key}`;
        return checkFetch(url, 'Places API (New)'); // Labelling generically, though could be TextSearch
    }


    async function checkFetch(url, name) {
        try {
            const response = await fetch(url);
            const data = await response.json().catch(() => ({})); // Handle non-JSON responses gracefully

            if (response.ok) {
                // Even 200 OK might have "error_message" in body for some Google APIs
                if (data.error_message) {
                    return { name: name, status: 'error', msg: data.error_message };
                }
                return { name: name, status: 'success', msg: 'Authorized' };
            } else {
                // Determine specific error status if possible
                let msg = 'Denied';
                if (data.error_message) msg = data.error_message;
                else if (response.status === 403) msg = '403 Forbidden';
                else if (data.status) msg = data.status; // Common in G-Maps responses (e.g., REQUEST_DENIED)

                return { name: name, status: 'error', msg: msg };
            }
        } catch (error) {
            // CORS errors often end up here
            return { name: name, status: 'warning', msg: 'CORS/Network Error (Possibly Restricted)' };
        }
    }

    // --- DISPLAY LOGIC ---

    function showResults(isValid, services) {
        resultsSection.classList.remove('hidden');

        // Update Badge
        if (isValid) {
            keyStatusBadge.textContent = 'Active Key';
            keyStatusBadge.className = 'badge badge-valid';
        } else {
            keyStatusBadge.textContent = 'Invalid / Inactive';
            keyStatusBadge.className = 'badge badge-invalid';
        }

        // Render Services
        services.forEach(service => {
            const el = document.createElement('div');
            el.className = 'service-item';

            let statusClass = 'dot-red';
            if (service.status === 'success') statusClass = 'dot-green';
            if (service.status === 'warning') statusClass = 'dot-yellow';

            el.innerHTML = `
                <div class="service-name">${service.name}</div>
                <div class="service-status">
                    <span class="status-dot ${statusClass}"></span>
                    <span>${service.msg}</span>
                </div>
            `;
            servicesGrid.appendChild(el);

            if (service.status === 'success') {
                currentEnabledApis.push(service.name);
            }
        });

        // Initial Pricing
        updatePricing(parseInt(reqRange.value));

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function updatePricing(requestCount) {
        // Calculate costs
        let total = 0;
        let htmlRows = '';

        // If no APIs enabled but key is valid, we might not show any cost.
        // If key invalid, cost is 0.

        costTableBody.innerHTML = ''; // Clear table

        if (currentEnabledApis.length === 0) {
            totalCostDisplay.textContent = '$0.00';
            riskLevelDisplay.textContent = 'None';
            riskLevelDisplay.className = 'risk-badge risk-low';
            costTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-secondary);">No enabled billable APIs detected.</td></tr>';
            return;
        }

        currentEnabledApis.forEach(apiName => {
            const pricePer1k = PRICING[apiName] || 0;
            const cost = (requestCount / 1000) * pricePer1k;
            total += cost;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${apiName}</td>
                <td><span style="color:var(--success-color)">Enabled</span></td>
                <td>$${pricePer1k.toFixed(2)}</td>
                <td>$${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            `;
            costTableBody.appendChild(tr);
        });

        totalCostDisplay.textContent = '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Determine Risk
        let risk = 'Low';
        let riskClass = 'risk-low';

        if (total > 5000) {
            risk = 'High';
            riskClass = 'risk-high';
        } else if (total > 1000) {
            risk = 'Medium';
            riskClass = 'risk-medium';
        }

        riskLevelDisplay.textContent = risk;
        riskLevelDisplay.className = `risk-badge ${riskClass}`;
    }
});
