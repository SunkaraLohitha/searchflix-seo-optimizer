from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
import requests
from bs4 import BeautifulSoup
from flask_sqlalchemy import SQLAlchemy # type: ignore
from datetime import datetime, timezone
import os


app = Flask(__name__)
CORS(app) 

@app.route('/')
def home():
    return "SEO Optimizer is running"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'seo_analysis.db')

print("Forced DB path:", DB_FILE)  # 👈 to verify


# ✅ Explicit DB location
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_FILE}'

'''basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'seo_analysis.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'''

#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///seo_analysis.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(300))
    title = db.Column(db.String(300))
    score = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'url': self.url,
            'title': self.title,
            'score': self.score,
            'created_at': self.created_at.isoformat()
        } 


def calculate_seo_score(soup, url=None):
    score = 0
    checks = {}

    def check(condition, key, points, fail_message):
        nonlocal score
        if condition:
            score += points
            checks[key] = "✅ Present"
        else:
            checks[key] = f"❌ Missing - {fail_message}"

    # Title
    check(soup.title, "Title Tag", 10, "Add a <title> tag.")
    
    # Meta Description
    check(soup.find('meta', attrs={'name': 'description'}), "Meta Description", 10, "Add a meta description.")
    
    # Canonical Tag
    check(soup.find('link', rel='canonical'), "Canonical Tag", 8, "Add a canonical tag.")
    
    # Open Graph Tags
    check(soup.find('meta', property='og:title'), "Open Graph Title", 5, "Add og:title for social sharing.")
    check(soup.find('meta', property='og:description'), "Open Graph Description", 5, "Add og:description for social preview.")
    
    # Twitter Card
    check(soup.find('meta', attrs={'name': 'twitter:card'}), "Twitter Card", 5, "Add Twitter Card metadata.")
    
    # H1 Tag
    h1_tags = soup.find_all('h1')
    if len(h1_tags) == 1:
        score += 5
        checks["H1 Tag"] = "✅ Present (1 H1)"
    elif len(h1_tags) == 0:
        checks["H1 Tag"] = "❌ Missing - Add one <h1> tag."
    else:
        checks["H1 Tag"] = f"⚠️ {len(h1_tags)} found - Use only one <h1> tag."

    # Robots Meta Tag
    check(soup.find('meta', attrs={'name': 'robots'}), "Robots Meta Tag", 3, "Add a robots meta tag.")

    # Viewport (for mobile friendliness)
    check(soup.find('meta', attrs={'name': 'viewport'}), "Viewport Tag", 5, "Add a responsive <meta name='viewport'> tag.")

    # Image Alt Tags
    images = soup.find_all('img')
    alt_missing = sum(1 for img in images if not img.get('alt'))
    if alt_missing == 0:
        score += 5
        checks["Image Alt Attributes"] = "✅ All images have alt tags."
    else:
        checks["Image Alt Attributes"] = f"⚠️ {alt_missing} image(s) missing alt attributes."

    # HTTPS Check
    if url:
        if url.startswith("https://"):
            score += 5
            checks["HTTPS"] = "✅ Secure HTTPS used."
        else:
            checks["HTTPS"] = "❌ Insecure HTTP used."

    # Structured Data (JSON-LD)
    check(soup.find('script', type='application/ld+json'), "Structured Data", 5, "Add schema.org structured data using JSON-LD.")

    # Page Load Speed Placeholder (Optional, real measure requires frontend timing or Lighthouse API)
    # checks["Page Speed"] = "⚠️ Not measured - Use Lighthouse or Web Vitals JS API"

    return min(score, 100), checks


'''def calculate_seo_score(soup):
    score = 0
    checks = {}

    def check(condition, key, points, fail_message):
        nonlocal score
        if condition:
            score += points
            checks[key] = "✅ Present"
        else:
            checks[key] = f"❌ Missing - {fail_message}"

    check(soup.title, "Title Tag", 20, "Add a <title> tag.")
    check(soup.find('meta', attrs={'name': 'description'}), "Meta Description", 20, "Add a meta description.")
    check(soup.find('link', rel='canonical'), "Canonical Tag", 15, "Add a canonical tag.")
    check(soup.find('meta', property='og:title'), "Open Graph Tag", 10, "Add Open Graph (og:title) metadata.")
    check(soup.find('meta', attrs={'name': 'twitter:card'}), "Twitter Card Tag", 10, "Add Twitter Card metadata.")
    check(soup.find('h1'), "H1 Tag", 10, "Add at least one <h1> tag.")
    check(soup.find('meta', attrs={'name': 'robots'}), "Robots Meta Tag", 5, "Add a robots meta tag.")

    return score, checks'''


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    url = data.get('url')

    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        html = requests.get(url, headers=headers, timeout=10).text
        soup = BeautifulSoup(html, 'html.parser')

        seo_score, seo_checks = calculate_seo_score(soup,url)

        # Save to database
        title = soup.title.string if soup.title else 'No Title'
        if not soup.title or not soup.find('meta'):
            return jsonify({'error': 'This page may require JavaScript to load. SEO data unavailable.'}), 400


        entry = Analysis(url=url, title=title, score=seo_score)
        db.session.add(entry)
        db.session.commit()
        print("Saving analysis for:", url)
        print("DB file (used by app):", DB_FILE)


        return jsonify({
            'seo_score': seo_score,
            'seo_checks': dict(sorted(seo_checks.items()))
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

'''@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        url = request.json['url']
        headers = {'User-Agent': 'Mozilla/5.0'}  # Avoid basic bot-blocks
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Pre-validation for missing SEO data
        if not soup.title or not soup.find('meta'):
            return jsonify({
                'error': 'Content appears to be dynamically rendered using JavaScript. Cannot extract SEO data.'
            }), 400

        seo_score, seo_checks = calculate_seo_score(soup, url)
        title = soup.title.string.strip() if soup.title else 'Untitled'

        entry = Analysis(url=url, title=title, score=seo_score)
        db.session.add(entry)
        db.session.commit()
        print("Saving analysis for:", url)
        print("DB file (used by app):", DB_FILE)

        return jsonify({
            'seo_score': seo_score,
            'seo_checks': seo_checks,
            'title': title
        })

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Network error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500'''




    

@app.route('/history', methods=['GET'])
def get_history():
    last_10 = Analysis.query.order_by(Analysis.id.desc()).limit(10).all()
    return jsonify([entry.to_dict() for entry in last_10])

    
@app.route('/clear-history', methods=['DELETE'])
def clear_history():
    try:
        num_rows_deleted = db.session.query(Analysis).delete()
        db.session.commit()
        return jsonify({'message': f'Deleted {num_rows_deleted} records.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    with app.app_context():
        db.create_all()   
    app.run(debug=True)
    

