from flask import Flask, request, jsonify

app = Flask(__name__)

# Configuration
app.config['UPLOAD_FOLDER'] = './uploads'  # Directory to save uploaded files
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    # Check if a file was uploaded
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Validate file type
    if file and allowed_file(file.filename):
        file_path = f"{app.config['UPLOAD_FOLDER']}/{file.filename}"
        file.save(file_path)  # Save file locally
        return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True)
    app.run(port=3000)
