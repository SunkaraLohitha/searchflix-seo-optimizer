# 🎬 SearchFlix: SEO Companion for Streaming Pages

A full-stack web application that evaluates and scores the SEO quality of OTT content pages (like Netflix, Prime Video, etc.). It helps content teams, developers, and SEO specialists analyze metadata, detect missing elements, and export clean PDF reports — all in real-time.

---

## 🔍 Project Summary

SearchFlix automates SEO metadata analysis for streaming content pages. Built with Flask and React, the tool provides an SEO score based on the presence of key tags like `<title>`, meta descriptions, Open Graph data, and more. It’s especially useful for QA, content, and marketing teams working on OTT platforms.

---

## ✨ Features

- ✅ Real-time SEO scoring for any OTT content page
- 🎯 Highlights missing tags like title, canonical, and meta description
- 🌗 Dark/Light mode toggle
- 🧾 PDF export of SEO report
- 📜 SEO score history with timestamps
- 🛡️ Input validation and graceful error handling
- 🔗 Copy/share link feature

---

## 🛠️ Technologies Used

| Layer       | Tech Stack                    |
|-------------|-------------------------------|
| Frontend    | React.js, JavaScript, HTML/CSS |
| Backend     | Python, Flask, Flask-CORS     |
| Parsing     | BeautifulSoup, Requests       |
| Database    | SQLite + SQLAlchemy           |
| Reporting   | html2pdf.js                   |

---

## ⚙️ How to Run Locally

### 🔹 Backend (Flask + Python)

```bash
# Navigate to backend directory
cd backend

# (Optional) Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
python app.py


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
