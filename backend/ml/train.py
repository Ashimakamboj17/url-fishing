import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
from features import get_feature_names

# 1. Generate Synthetic Dataset (Since we don't have a public one immediately available)
def generate_synthetic_data(num_samples=2000):
    print("Generating synthetic data...")
    feature_names = get_feature_names()
    
    # Generate random features
    # For a real project, this would be replaced by reading a CSV from UCI Machine Learning Repository
    data = []
    labels = []
    
    for _ in range(num_samples):
        is_phishing = np.random.choice([0, 1])
        
        # Simulate features based on label
        if is_phishing:
            # Phishing URLs tend to be longer, have IPs, more dots, suspicious words, etc.
            url_length = np.random.randint(50, 150)
            domain_length = np.random.randint(15, 50)
            path_length = url_length - domain_length - 8
            has_ip = np.random.choice([0, 1], p=[0.7, 0.3])
            count_at = np.random.choice([0, 1], p=[0.9, 0.1])
            count_dash = np.random.randint(0, 5)
            count_dot = np.random.randint(2, 6)
            count_equal = np.random.randint(0, 3)
            count_question = np.random.choice([0, 1])
            count_underscore = np.random.randint(0, 3)
            count_percent = np.random.randint(0, 3)
            count_slash = np.random.randint(3, 8)
            count_star = np.random.choice([0, 1], p=[0.95, 0.05])
            count_tilde = np.random.choice([0, 1], p=[0.95, 0.05])
            count_comma = np.random.choice([0, 1], p=[0.95, 0.05])
            is_https = np.random.choice([0, 1], p=[0.6, 0.4])
            has_suspicious_word = np.random.choice([0, 1], p=[0.4, 0.6])
            is_shortened = np.random.choice([0, 1], p=[0.8, 0.2])
        else:
            # Legitimate URLs
            url_length = np.random.randint(20, 80)
            domain_length = np.random.randint(5, 20)
            path_length = url_length - domain_length - 8 if url_length - domain_length - 8 > 0 else 0
            has_ip = 0
            count_at = 0
            count_dash = np.random.randint(0, 2)
            count_dot = np.random.randint(1, 3)
            count_equal = np.random.choice([0, 1], p=[0.8, 0.2])
            count_question = np.random.choice([0, 1], p=[0.8, 0.2])
            count_underscore = np.random.choice([0, 1], p=[0.9, 0.1])
            count_percent = np.random.choice([0, 1], p=[0.9, 0.1])
            count_slash = np.random.randint(2, 5)
            count_star = 0
            count_tilde = 0
            count_comma = 0
            is_https = np.random.choice([0, 1], p=[0.1, 0.9])
            has_suspicious_word = np.random.choice([0, 1], p=[0.9, 0.1])
            is_shortened = np.random.choice([0, 1], p=[0.95, 0.05])

        row = [
            url_length, domain_length, path_length, has_ip, count_at, count_dash,
            count_dot, count_equal, count_question, count_underscore, count_percent,
            count_slash, count_star, count_tilde, count_comma, is_https,
            has_suspicious_word, is_shortened
        ]
        data.append(row)
        labels.append(is_phishing)
        
    df = pd.DataFrame(data, columns=feature_names)
    df['label'] = labels
    return df

def train_model():
    df = generate_synthetic_data(5000)
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature Importance
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    print("\nFeature ranking:")
    feature_names = X.columns
    for f in range(X.shape[1]):
        print(f"{f + 1}. feature {feature_names[indices[f]]} ({importances[indices[f]]:.4f})")
    
    # Save Model
    model_path = os.path.join(os.path.dirname(__file__), 'model.joblib')
    joblib.dump(model, model_path)
    print(f"\nModel saved to {model_path}")

if __name__ == "__main__":
    train_model()
