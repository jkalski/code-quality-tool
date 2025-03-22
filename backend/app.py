from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_code():
    try:
        # Grab the incoming data from frontend
        data = request.json
        code = data.get('code')
        language = data.get('language')

        print("🟢 Received request")
        print("Language:", language)
        print("Code:\n", code)

        if language != "python":
            return jsonify({"error": "Only Python linting is supported right now."}), 400

        # Save the code to a temp .py file
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.py', delete=False) as temp_file:
            temp_file.write(code)
            temp_file.flush()
            filename = temp_file.name
            print("📄 Temp file created:", filename)

        result = subprocess.run(
            ['pylint', filename, '--disable=all', '--enable=E,W'],
            capture_output=True,
            text=True
        )
        
        print("📢 Pylint output:\n", result.stdout)

        return jsonify({"output": result.stdout})

    except Exception as e:
        print("❌ ERROR in /analyze route:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
