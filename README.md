# Google Maps API Key Validator & Cost Estimator 🌍

A lightweight, client-side tool to validate Google Maps API keys, detect enabled services, and estimate potential pricing exposure.

![Project Preview](https://via.placeholder.com/800x400?text=G-Maps+Validator+Preview)

## ✨ Features

- **Instant Validation**: Checks if your API key is active and formatted correctly.
- **Service Detection**: Identifies enabled APIs (Maps JS, Geocoding, Places, Directions, etc.).
- **Cost Estimation**: Calculates potential monthly costs based on simulated request volume.
- **Risk Assessment**: Classifies exposure risk (Low, Medium, High).
- **Client-Side Only**: No backend required. Your API keys never leave your browser (except to call Google's servers).
- **Premium UI**: Glassmorphism design with animated backgrounds.
- **SEO Optimized**: Built with meta tags, Open Graph support, and structured data for better discoverability.

## 🚀 Deployment (GitHub Pages)

This project is designed to be hosted directly on **GitHub Pages**.

1.  **Fork or Clone** this repository.
2.  Go to **Settings** > **Pages** in your GitHub repository.
3.  Under **Source**, select `main` (or `master`) branch.
4.  Click **Save**.
5.  Your site will be live at `https://kankburhan.github.io/gmaps-validator/`.

## 🛠️ Local Development

1.  Clone the repository:
    ```bash
    git clone https://github.com/kankburhan/gmaps-validator.git
    cd gmaps-validator
    ```
2.  Open `index.html` in your browser.
    - *Note: Some APIs might block requests from `file://` protocol due to CORS. For best results, use a local server.*

    ```bash
    # using python
    python3 -m http.server 8000
    # then open http://localhost:8000
    ```

## ⚠️ Disclaimer

This tool is for **educational and security auditing purposes only**.
- Only test API keys that **you own** or have explicit permission to audit.
- Misuse of API keys may violate Google’s Terms of Service.
- This tool provides **estimates** based on public pricing and does not reflect custom enterprise contracts.

## 📄 License

MIT License. Free to use and modify.
