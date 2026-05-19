import re
from urllib.parse import urlparse

def extract_features(url: str) -> dict:
    features = {}
    parsed_url = urlparse(url)
    
    # 1. URL Length
    features['url_length'] = len(url)
    
    # 2. Domain Length
    domain = parsed_url.netloc
    features['domain_length'] = len(domain)
    
    # 3. Path Length
    features['path_length'] = len(parsed_url.path)
    
    # 4. Use of IP Address
    ip_pattern = re.compile(
        r'(([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.'
        r'([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\/)|'
        r'((0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\/)'
    )
    features['has_ip'] = 1 if ip_pattern.search(domain) else 0
    
    # 5. Suspicious Characters
    features['count_at'] = url.count('@')
    features['count_dash'] = domain.count('-')
    features['count_dot'] = domain.count('.')
    features['count_equal'] = url.count('=')
    features['count_question'] = url.count('?')
    features['count_underscore'] = url.count('_')
    features['count_percent'] = url.count('%')
    features['count_slash'] = url.count('/')
    features['count_star'] = url.count('*')
    features['count_tilde'] = url.count('~')
    features['count_comma'] = url.count(',')
    
    # 6. HTTPS usage
    features['is_https'] = 1 if parsed_url.scheme == 'https' else 0
    
    # 7. Suspicious words
    suspicious_words = ['login', 'verify', 'update', 'secure', 'account', 'bank', 'pay', 'free', 'bonus', 'signin', 'auth', 'billing', 'confirm']
    features['has_suspicious_word'] = 1 if any(word in url.lower() for word in suspicious_words) else 0
    
    # 8. Shortening Services
    shortening_services = r"bit\.ly|tinyurl\.com|is\.gd|cli\.gs|yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|db\.tt|qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|q\.gs|is\.gd|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|x\.co|prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|tr\.im|link\.zip\.net"
    match = re.search(shortening_services, domain)
    features['is_shortened'] = 1 if match else 0

    return features

def get_feature_names():
    return list(extract_features("http://example.com").keys())
