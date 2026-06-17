document.addEventListener('DOMContentLoaded', () => {
    // Menu logic
    const menuBtns = document.querySelectorAll('.menu-btn');
    const viewSections = document.querySelectorAll('.view-section');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            menuBtns.forEach(b => b.classList.remove('active'));
            viewSections.forEach(v => v.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Maps View Elements ---
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
    const pocCard = document.getElementById('pocCard');
    const pocCommands = document.getElementById('pocCommands');
    const copyAllCurlBtn = document.getElementById('copyAllCurlBtn');

    // --- API View Elements ---
    const apiApiKeyInput = document.getElementById('apiApiKeyInput');
    const apiValidateBtn = document.getElementById('apiValidateBtn');
    const apiResultsSection = document.getElementById('apiResultsSection');
    const apiKeyStatusBadge = document.getElementById('apiKeyStatusBadge');
    const apiServicesGrid = document.getElementById('apiServicesGrid');
    const apiPocCard = document.getElementById('apiPocCard');
    const apiPocCommands = document.getElementById('apiPocCommands');
    const apiCopyAllCurlBtn = document.getElementById('apiCopyAllCurlBtn');

    // Pricing Constants (approximate pricing per 1000 requests)
    const PRICING = {
        'Maps JavaScript API': 7.00,
        'Directions API': 5.00,
        'Geocoding API': 5.00,
        'Places API (New)': 17.00,
        'Distance Matrix API': 10.00
    };

    let currentEnabledApis = [];

    // Curl templates for POC generation
    const CURL_TEMPLATES = {
        'Maps JavaScript API': (key) => `# Maps JavaScript API\ncurl -s -o /dev/null -w "%{http_code}" "https://maps.googleapis.com/maps/api/js?key=${key}"`,
        'Static Maps API': (key) => `# Static Maps API\ncurl -s -o map.png -w "%{http_code}" "https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=400x400&key=${key}"`,
        'Geocoding API': (key) => `# Geocoding API\ncurl -s "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${key}"`,
        'Directions API': (key) => `# Directions API\ncurl -s "https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=${key}"`,
        'Places API (New)': (key) => `# Places API\ncurl -s "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${key}"`
    };

    const API_CURL_TEMPLATES = {
        'YouTube Data API v3': (key) => `# YouTube Data API v3\ncurl -s "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=surfing&key=${key}"`,
        'Custom Search API': (key) => `# Custom Search API\ncurl -s "https://www.googleapis.com/customsearch/v1?q=test&cx=017576662512468239146:omuauf_lfve&key=${key}"`,
        'Drive API': (key) => `# Google Drive API\ncurl -s "https://www.googleapis.com/drive/v3/files?key=${key}"`,
        'Calendar API': (key) => `# Google Calendar API\ncurl -s "https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${key}"`,
        'Translate API': (key) => `# Google Translate API\ncurl -s "https://translation.googleapis.com/language/translate/v2?target=en&q=hola&key=${key}"`,
        'Sheets API': (key) => `# Google Sheets API\ncurl -s "https://sheets.googleapis.com/v4/spreadsheets/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms?key=${key}"`,
        'Books API': (key) => `# Google Books API\ncurl -s "https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=${key}"`,
        'Blogger API': (key) => `# Google Blogger API\ncurl -s "https://www.googleapis.com/blogger/v3/blogs/2399953?key=${key}"`,
        'Tasks API': (key) => `# Google Tasks API\ncurl -s "https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${key}"`,
        'Web Fonts API': (key) => `# Google Web Fonts API\ncurl -s "https://www.googleapis.com/webfonts/v1/webfonts?key=${key}"`,
        'Safe Browsing API': (key) => `# Google Safe Browsing API\ncurl -s "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}"`,
        'Fitness API': (key) => `# Google Fitness API\ncurl -s "https://www.googleapis.com/fitness/v1/users/me/dataSources?key=${key}"`,
        'YouTube Analytics API': (key) => `# YouTube Analytics API\ncurl -s "https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2017-01-01&endDate=2017-12-31&metrics=views&key=${key}"`,
        'Play Developer API': (key) => `# Google Play Developer API\ncurl -s "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.google.android.googlequicksearchbox/reviews?key=${key}"`,
        'Docs API': (key) => `# Google Docs API\ncurl -s "https://docs.googleapis.com/v1/documents/195j9eDD3ccgjCG2_72EXCEmVDg4q2N0Z3rP3_m_wZ0?key=${key}"`,
        'Slides API': (key) => `# Google Slides API\ncurl -s "https://slides.googleapis.com/v1/presentations/1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc?key=${key}"`,
        'Forms API': (key) => `# Google Forms API\ncurl -s "https://forms.googleapis.com/v1/forms/1FAIpQLSfQ9_K1_U-M72UxtlQ03MvE6f8p4e-F5G0b8G199_2?key=${key}"`,
        'Maps Roads API': (key) => `# Google Maps Roads API\ncurl -s "https://roads.googleapis.com/v1/snapToRoads?path=-35.27801,149.12958|-35.28032,149.12907&interpolate=true&key=${key}"`,
        'Maps Elevation API': (key) => `# Google Maps Elevation API\ncurl -s "https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=${key}"`,
        'Maps Time Zone API': (key) => `# Google Maps Time Zone API\ncurl -s "https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key=${key}"`,
        'Cloud Storage API': (key) => `# Google Cloud Storage API\ncurl -s "https://storage.googleapis.com/storage/v1/b?project=test&key=${key}"`,
        'Firebase Dynamic Links API': (key) => `# Firebase Dynamic Links API\ncurl -s "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${key}"`,
        'My Business API': (key) => `# Google My Business API\ncurl -s "https://mybusiness.googleapis.com/v4/accounts?key=${key}"`,
        'Analytics Data API (GA4)': (key) => `# Google Analytics Data API\ncurl -s "https://analyticsdata.googleapis.com/v1beta/properties/1234567/metadata?key=${key}"`,
        'Cloud Natural Language API': (key) => `# Google Cloud Natural Language API\ncurl -s "https://language.googleapis.com/v1/documents:analyzeSentiment?key=${key}"`,
        'Cloud Vision API': (key) => `# Google Cloud Vision API\ncurl -s "https://vision.googleapis.com/v1/images:annotate?key=${key}"`,
        'Compute Engine API': (key) => `# Google Compute Engine API\ncurl -s "https://compute.googleapis.com/compute/v1/projects/debian-cloud/global/images/family/debian-11?key=${key}"`,
        'Knowledge Graph Search API': (key) => `# Google Knowledge Graph Search API\ncurl -s "https://kgsearch.googleapis.com/v1/entities:search?query=taylor+swift&key=${key}"`,
        'Distance Matrix API': (key) => `# Google Maps Distance Matrix API\ncurl -s "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington,DC&destinations=New+York+City,NY&key=${key}"`,
        'Street View Static API': (key) => `# Google Street View Static API\ncurl -s "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=40.720032,-73.988354&fov=90&heading=235&pitch=10&key=${key}"`,
        'YouTube Live Streaming API': (key) => `# YouTube Live Streaming API\ncurl -s "https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=all&key=${key}"`,
        'Classroom API': (key) => `# Google Classroom API\ncurl -s "https://classroom.googleapis.com/v1/courses?key=${key}"`,
        'Keep API': (key) => `# Google Keep API\ncurl -s "https://keep.googleapis.com/v1/notes?key=${key}"`,
        'Cloud Translation API (Advanced)': (key) => `# Google Cloud Translation Advanced API\ncurl -s "https://translation.googleapis.com/v3/projects/project-id/supportedLanguages?key=${key}"`,
        'Search Console API': (key) => `# Google Search Console API\ncurl -s "https://searchconsole.googleapis.com/webmasters/v3/sites?key=${key}"`,
        'Site Verification API': (key) => `# Google Site Verification API\ncurl -s "https://siteverification.googleapis.com/v1/webResource?key=${key}"`,
        'Cloud Billing API': (key) => `# Google Cloud Billing API\ncurl -s "https://cloudbilling.googleapis.com/v1/billingAccounts?key=${key}"`,
        'Cloud KMS API': (key) => `# Google Cloud KMS API\ncurl -s "https://cloudkms.googleapis.com/v1/projects/test/locations/global/keyRings?key=${key}"`,
        'Identity Toolkit API': (key) => `# Google Identity Toolkit API\ncurl -s "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}"`,
        'Firestore API': (key) => `# Google Firestore API\ncurl -s "https://firestore.googleapis.com/v1/projects/test/databases/(default)/documents?key=${key}"`,
        'Cloud Video Intelligence API': (key) => `# Google Cloud Video Intelligence API\ncurl -s "https://videointelligence.googleapis.com/v1/operations?key=${key}"`,
        'Cloud Speech-to-Text API': (key) => `# Google Cloud Speech-to-Text API\ncurl -s "https://speech.googleapis.com/v1/operations?key=${key}"`,
        'Cloud Text-to-Speech API': (key) => `# Google Cloud Text-to-Speech API\ncurl -s "https://texttospeech.googleapis.com/v1/voices?key=${key}"`,
        'People API': (key) => `# Google People API\ncurl -s "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses&key=${key}"`,
        'Play Games Services API': (key) => `# Google Play Games Services API\ncurl -s "https://games.googleapis.com/games/v1/players/me?key=${key}"`,
        'Maps Solar API': (key) => `# Google Maps Solar API\ncurl -s "https://solar.googleapis.com/v1/dataLayers:get?location.latitude=37.4449739&location.longitude=-122.1391465&radiusMeters=10&key=${key}"`,
        'YouTube Reporting API': (key) => `# YouTube Reporting API\ncurl -s "https://youtubereporting.googleapis.com/v1/jobs?key=${key}"`,
        'Cloud Tasks API': (key) => `# Google Cloud Tasks API\ncurl -s "https://cloudtasks.googleapis.com/v2/projects/test/locations/global/queues?key=${key}"`,
        'Cloud Logging API': (key) => `# Google Cloud Logging API\ncurl -s "https://logging.googleapis.com/v2/projects/test/metrics?key=${key}"`,
        'Firebase ML API': (key) => `# Firebase ML API\ncurl -s "https://firebaseml.googleapis.com/v1beta2/projects/test/models?key=${key}"`
    };

    // Event Listeners (Maps)
    validateBtn.addEventListener('click', startValidation);
    apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startValidation();
    });

    reqRange.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        reqCountDisplay.textContent = value.toLocaleString();
        updatePricing(value);
    });

    copyAllCurlBtn.addEventListener('click', () => {
        const allCurls = Array.from(pocCommands.querySelectorAll('.curl-code'))
            .map(el => el.textContent)
            .join('\n\n');
        copyToClipboard(allCurls, copyAllCurlBtn.querySelector('span'));
    });

    // Event Listeners (APIs)
    apiValidateBtn.addEventListener('click', startApiValidation);
    apiApiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startApiValidation();
    });

    apiCopyAllCurlBtn.addEventListener('click', () => {
        const allCurls = Array.from(apiPocCommands.querySelectorAll('.curl-code'))
            .map(el => el.textContent)
            .join('\n\n');
        copyToClipboard(allCurls, apiCopyAllCurlBtn.querySelector('span'));
    });


    // --- MAPS VALIDATION ---
    async function startValidation() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) { alert('Please enter an API key'); return; }

        setLoading(validateBtn, apiKeyInput, true);
        resultsSection.classList.add('hidden');
        servicesGrid.innerHTML = '';
        currentEnabledApis = [];

        if (apiKey.length < 30 || !apiKey.startsWith('AIza')) {
            showResults(false, [], 'maps', apiKey);
            setLoading(validateBtn, apiKeyInput, false);
            return;
        }

        const results = await Promise.all([
            checkMapsJS(apiKey),
            checkFetch(`https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=1x1&key=${apiKey}`, 'Static Maps API'),
            checkFetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`, 'Geocoding API'),
            checkFetch(`https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=${apiKey}`, 'Directions API'),
            checkFetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=${apiKey}`, 'Places API (New)')
        ]);

        const validKey = results.some(r => r.status === 'success');
        showResults(validKey, results, 'maps', apiKey);
        setLoading(validateBtn, apiKeyInput, false);
    }

    // --- GENERAL API VALIDATION ---
    async function startApiValidation() {
        const apiKey = apiApiKeyInput.value.trim();
        if (!apiKey) { alert('Please enter an API key'); return; }

        setLoading(apiValidateBtn, apiApiKeyInput, true);
        apiResultsSection.classList.add('hidden');
        apiServicesGrid.innerHTML = '';

        if (apiKey.length < 30 || !apiKey.startsWith('AIza')) {
            showResults(false, [], 'api', apiKey);
            setLoading(apiValidateBtn, apiApiKeyInput, false);
            return;
        }

        const results = await Promise.all([
            checkFetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=surfing&key=${apiKey}`, 'YouTube Data API v3'),
            checkFetch(`https://www.googleapis.com/customsearch/v1?q=test&cx=017576662512468239146:omuauf_lfve&key=${apiKey}`, 'Custom Search API'),
            checkFetch(`https://www.googleapis.com/drive/v3/files?key=${apiKey}`, 'Drive API'),
            checkFetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${apiKey}`, 'Calendar API'),
            checkFetch(`https://translation.googleapis.com/language/translate/v2?target=en&q=hola&key=${apiKey}`, 'Translate API'),
            checkFetch(`https://sheets.googleapis.com/v4/spreadsheets/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms?key=${apiKey}`, 'Sheets API'),
            checkFetch(`https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=${apiKey}`, 'Books API'),
            checkFetch(`https://www.googleapis.com/blogger/v3/blogs/2399953?key=${apiKey}`, 'Blogger API'),
            checkFetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${apiKey}`, 'Tasks API'),
            checkFetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`, 'Web Fonts API'),
            checkFetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, 'Safe Browsing API'),
            checkFetch(`https://www.googleapis.com/fitness/v1/users/me/dataSources?key=${apiKey}`, 'Fitness API'),
            checkFetch(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2017-01-01&endDate=2017-12-31&metrics=views&key=${apiKey}`, 'YouTube Analytics API'),
            checkFetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.google.android.googlequicksearchbox/reviews?key=${apiKey}`, 'Play Developer API'),
            checkFetch(`https://docs.googleapis.com/v1/documents/195j9eDD3ccgjCG2_72EXCEmVDg4q2N0Z3rP3_m_wZ0?key=${apiKey}`, 'Docs API'),
            checkFetch(`https://slides.googleapis.com/v1/presentations/1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc?key=${apiKey}`, 'Slides API'),
            checkFetch(`https://forms.googleapis.com/v1/forms/1FAIpQLSfQ9_K1_U-M72UxtlQ03MvE6f8p4e-F5G0b8G199_2?key=${apiKey}`, 'Forms API'),
            checkFetch(`https://roads.googleapis.com/v1/snapToRoads?path=-35.27801,149.12958|-35.28032,149.12907&interpolate=true&key=${apiKey}`, 'Maps Roads API'),
            checkFetch(`https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=${apiKey}`, 'Maps Elevation API'),
            checkFetch(`https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key=${apiKey}`, 'Maps Time Zone API'),
            checkFetch(`https://storage.googleapis.com/storage/v1/b?project=test&key=${apiKey}`, 'Cloud Storage API'),
            checkFetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`, 'Firebase Dynamic Links API'),
            checkFetch(`https://mybusiness.googleapis.com/v4/accounts?key=${apiKey}`, 'My Business API'),
            checkFetch(`https://analyticsdata.googleapis.com/v1beta/properties/1234567/metadata?key=${apiKey}`, 'Analytics Data API (GA4)'),
            checkFetch(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`, 'Cloud Natural Language API'),
            checkFetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, 'Cloud Vision API'),
            checkFetch(`https://compute.googleapis.com/compute/v1/projects/debian-cloud/global/images/family/debian-11?key=${apiKey}`, 'Compute Engine API'),
            checkFetch(`https://kgsearch.googleapis.com/v1/entities:search?query=taylor+swift&key=${apiKey}`, 'Knowledge Graph Search API'),
            checkFetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington,DC&destinations=New+York+City,NY&key=${apiKey}`, 'Distance Matrix API'),
            checkFetch(`https://maps.googleapis.com/maps/api/streetview?size=400x400&location=40.720032,-73.988354&fov=90&heading=235&pitch=10&key=${apiKey}`, 'Street View Static API'),
            checkFetch(`https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=all&key=${apiKey}`, 'YouTube Live Streaming API'),
            checkFetch(`https://classroom.googleapis.com/v1/courses?key=${apiKey}`, 'Classroom API'),
            checkFetch(`https://keep.googleapis.com/v1/notes?key=${apiKey}`, 'Keep API'),
            checkFetch(`https://translation.googleapis.com/v3/projects/project-id/supportedLanguages?key=${apiKey}`, 'Cloud Translation API (Advanced)'),
            checkFetch(`https://searchconsole.googleapis.com/webmasters/v3/sites?key=${apiKey}`, 'Search Console API'),
            checkFetch(`https://siteverification.googleapis.com/v1/webResource?key=${apiKey}`, 'Site Verification API'),
            checkFetch(`https://cloudbilling.googleapis.com/v1/billingAccounts?key=${apiKey}`, 'Cloud Billing API'),
            checkFetch(`https://cloudkms.googleapis.com/v1/projects/test/locations/global/keyRings?key=${apiKey}`, 'Cloud KMS API'),
            checkFetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, 'Identity Toolkit API'),
            checkFetch(`https://firestore.googleapis.com/v1/projects/test/databases/(default)/documents?key=${apiKey}`, 'Firestore API'),
            checkFetch(`https://videointelligence.googleapis.com/v1/operations?key=${apiKey}`, 'Cloud Video Intelligence API'),
            checkFetch(`https://speech.googleapis.com/v1/operations?key=${apiKey}`, 'Cloud Speech-to-Text API'),
            checkFetch(`https://texttospeech.googleapis.com/v1/voices?key=${apiKey}`, 'Cloud Text-to-Speech API'),
            checkFetch(`https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses&key=${apiKey}`, 'People API'),
            checkFetch(`https://games.googleapis.com/games/v1/players/me?key=${apiKey}`, 'Play Games Services API'),
            checkFetch(`https://solar.googleapis.com/v1/dataLayers:get?location.latitude=37.4449739&location.longitude=-122.1391465&radiusMeters=10&key=${apiKey}`, 'Maps Solar API'),
            checkFetch(`https://youtubereporting.googleapis.com/v1/jobs?key=${apiKey}`, 'YouTube Reporting API'),
            checkFetch(`https://cloudtasks.googleapis.com/v2/projects/test/locations/global/queues?key=${apiKey}`, 'Cloud Tasks API'),
            checkFetch(`https://logging.googleapis.com/v2/projects/test/metrics?key=${apiKey}`, 'Cloud Logging API'),
            checkFetch(`https://firebaseml.googleapis.com/v1beta2/projects/test/models?key=${apiKey}`, 'Firebase ML API')
        ]);

        const validKey = results.some(r => r.status === 'success');
        showResults(validKey, results, 'api', apiKey);
        setLoading(apiValidateBtn, apiApiKeyInput, false);
    }

    function setLoading(btn, input, isLoading) {
        const btnText = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.loader');

        if (isLoading) {
            btnText.textContent = 'Checking...';
            loader.classList.add('active');
            input.disabled = true;
            btn.disabled = true;
        } else {
            btnText.textContent = 'Validate Key';
            loader.classList.remove('active');
            input.disabled = false;
            btn.disabled = false;
        }
    }

    function checkMapsJS(key) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=Function.prototype`;
            script.onload = () => {
                resolve({ name: 'Maps JavaScript API', status: 'success', msg: 'Authorized' });
                script.remove();
            };
            script.onerror = () => {
                resolve({ name: 'Maps JavaScript API', status: 'error', msg: 'Failed to load' });
                script.remove();
            };
            document.head.appendChild(script);
        });
    }

    async function checkFetch(url, name) {
        try {
            const response = await fetch(url);
            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                if (data.error_message) return { name: name, status: 'error', msg: data.error_message };
                if (data.errorMessage) return { name: name, status: 'error', msg: data.errorMessage };
                if (data.error && data.error.message) return { name: name, status: 'error', msg: data.error.message };
                if (data.status === 'REQUEST_DENIED') return { name: name, status: 'error', msg: data.errorMessage || data.error_message || 'Request Denied' };
                return { name: name, status: 'success', msg: 'Authorized' };
            } else {
                let msg = 'Denied';
                if (data.error_message) msg = data.error_message;
                else if (data.errorMessage) msg = data.errorMessage;
                else if (data.error && data.error.message) msg = data.error.message;
                else if (response.status === 403) msg = '403 Forbidden';
                else if (data.status) msg = data.status;

                return { name: name, status: 'error', msg: msg };
            }
        } catch (error) {
            return { name: name, status: 'warning', msg: 'CORS/Network Error' };
        }
    }

    // --- DISPLAY LOGIC ---
    function showResults(isValid, services, type, apiKey) {
        const isMaps = type === 'maps';
        const section = isMaps ? resultsSection : apiResultsSection;
        const badge = isMaps ? keyStatusBadge : apiKeyStatusBadge;
        const grid = isMaps ? servicesGrid : apiServicesGrid;
        
        section.classList.remove('hidden');

        if (isValid) {
            badge.textContent = 'Active Key';
            badge.className = 'badge badge-valid';
        } else {
            badge.textContent = 'Invalid / Inactive';
            badge.className = 'badge badge-invalid';
        }

        const successServices = [];
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
            grid.appendChild(el);

            if (service.status === 'success') {
                if (isMaps) currentEnabledApis.push(service.name);
                successServices.push(service.name);
            }
        });

        renderPocCurls(apiKey, successServices, type);

        if (isMaps) {
            updatePricing(parseInt(reqRange.value));
        }

        section.scrollIntoView({ behavior: 'smooth' });
    }

    function renderPocCurls(apiKey, successServices, type) {
        const pCommands = type === 'maps' ? pocCommands : apiPocCommands;
        const pCard = type === 'maps' ? pocCard : apiPocCard;
        const templates = type === 'maps' ? CURL_TEMPLATES : API_CURL_TEMPLATES;

        pCommands.innerHTML = '';
        if (successServices.length === 0) {
            pCard.classList.add('hidden');
            return;
        }

        pCard.classList.remove('hidden');

        successServices.forEach(serviceName => {
            const template = templates[serviceName];
            if (!template) return;

            const curlCmd = template(apiKey);
            const item = document.createElement('div');
            item.className = 'poc-item';
            item.innerHTML = `
                <div class="poc-item-header">
                    <span class="poc-service-name">
                        <span class="status-dot dot-green"></span>
                        ${serviceName}
                    </span>
                    <button class="btn-copy" title="Copy curl command">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copy</span>
                    </button>
                </div>
                <pre class="curl-block"><code class="curl-code">${escapeHtml(curlCmd)}</code></pre>
            `;

            const copyBtn = item.querySelector('.btn-copy');
            copyBtn.addEventListener('click', () => {
                copyToClipboard(curlCmd, copyBtn.querySelector('span'));
            });

            pCommands.appendChild(item);
        });
    }

    function copyToClipboard(text, feedbackEl) {
        navigator.clipboard.writeText(text).then(() => {
            const original = feedbackEl.textContent;
            feedbackEl.textContent = 'Copied!';
            feedbackEl.parentElement.classList.add('copied');
            setTimeout(() => {
                feedbackEl.textContent = original;
                feedbackEl.parentElement.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            const original = feedbackEl.textContent;
            feedbackEl.textContent = 'Copied!';
            feedbackEl.parentElement.classList.add('copied');
            setTimeout(() => {
                feedbackEl.textContent = original;
                feedbackEl.parentElement.classList.remove('copied');
            }, 2000);
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function updatePricing(requestCount) {
        let total = 0;
        costTableBody.innerHTML = '';

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

        let risk = 'Low';
        let riskClass = 'risk-low';
        if (total > 5000) { risk = 'High'; riskClass = 'risk-high'; }
        else if (total > 1000) { risk = 'Medium'; riskClass = 'risk-medium'; }

        riskLevelDisplay.textContent = risk;
        riskLevelDisplay.className = `risk-badge ${riskClass}`;
    }
});
