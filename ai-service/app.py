from flask import Flask
from routes.describe import describe_bp
import os

app = Flask(__name__)

# Register route
app.register_blueprint(describe_bp)

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    app.run(host=host, port=port, debug=True)

