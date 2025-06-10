from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import openai

app = Flask(__name__)
CORS(app)

openai.api_key = "API_KEY"

@app.route('/api/whisper', methods=['POST', 'OPTIONS'])
def transcribe():
    if request.method == "OPTIONS":
        return '', 200
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        audio_bytes = audio_file.read()
        audio_stream = BytesIO(audio_bytes)
        audio_stream.name = "recording.webm"

        transcript = openai.audio.transcriptions.create(
            model="whisper-1",
            file=audio_stream
        )
        return jsonify({"text": transcript.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
