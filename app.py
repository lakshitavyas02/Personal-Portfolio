import json
from flask import Flask, send_from_directory, request, jsonify, render_template
from transformers import pipeline

app = Flask(__name__, template_folder='templates', static_folder='static')

# Load the resume JSON
with open('resume.json', 'r') as file:
    resume_data = json.load(file)

# Convert resume data into a readable string context
resume_context = f"""
name: {resume_data['name']}
education:
    - course: {resume_data['education'][0]['course']} 
    - university: {resume_data['education'][0]['university']}
    - graduation year: {resume_data['education'][0]['year_of_graduation']}
    - cgpa: {resume_data['education'][0]['cgpa']}
skills:
    programming languages: {', '.join(resume_data['skills']['programming_languages'])}
    frameworks: {', '.join(resume_data['skills']['libraries_and_frameworks'])}
    core concepts: {', '.join(resume_data['skills']['core_concepts'])}
    technical expertise: {', '.join(resume_data['skills']['technical_expertise'])}
experience:
    - {resume_data['experience']}
projects:
    - {resume_data['projects'][0]['title']}: {resume_data['projects'][0]['description']}
    - {resume_data['projects'][1]['title']}: {resume_data['projects'][1]['description']}
    - {resume_data['projects'][2]['title']}: {resume_data['projects'][2]['description']}
    - {resume_data['projects'][3]['title']}: {resume_data['projects'][3]['description']}
    - {resume_data['projects'][4]['title']}: {resume_data['projects'][4]['description']}
certifications: {', '.join(resume_data['certifications'])}
"""

# Load the chatbot model
qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

# Chatbot API endpoint
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('question').lower()
    print(user_input)
    if not user_input:
        return jsonify({"error": "No question provided"}), 400

    # If the user asks about "projects", return only project names
    if 'projects' in user_input:
        project_names = "\n".join([project['title'] for project in resume_data['projects']])
        return jsonify({"answer": f"Here are the names of the projects:\n{project_names}\n\nIf you want more details about any project, ask me to elaborate."})
    
    # If the user asks for more details (elaboration) on projects
    if 'elaborate' in user_input or 'details' in user_input:
        projects_list = "\n".join([f"{project['title']}: {project['description']}" for project in resume_data['projects']])
        return jsonify({"answer": f"Here are the details of the projects:\n{projects_list}"})

    if 'skills' in user_input:
        # Format the skills as a string
        skills = f"""
        Programming Languages: {', '.join(resume_data['skills']['programming_languages'])}
        Frameworks and Libraries: {', '.join(resume_data['skills']['libraries_and_frameworks'])}
        Core Concepts: {', '.join(resume_data['skills']['core_concepts'])}
        Technical Expertise: {', '.join(resume_data['skills']['technical_expertise'])}
        """
        return jsonify({"answer": f"Here are all the skills:{skills}"})
    
    if 'education' in user_input:
        degree_and_university = f"{resume_data['education'][0]['course']} at {resume_data['education'][0]['university']}"
        return jsonify({"answer": f"I studied {degree_and_university}."})

    # Handle specific queries for "university"
    if ('university' in user_input and 'name' in user_input) or 'your university' in user_input: 
        return jsonify({"answer": f"I studied at {resume_data['education'][0]['university']}."})

    # Handle specific queries for "name"
    if 'name' in user_input or 'your name' in user_input:
        return jsonify({"answer": f"My name is {resume_data['name']}."})
    
    if 'certification' in user_input:
        certifications_list = "\n".join([f"{certification}" for certification in resume_data['certifications']])
        return jsonify({"answer": f"Here are the details of my certifications:\n{certifications_list}"})

    result = qa_pipeline(question=user_input, context=resume_context)
    return jsonify({"answer": result['answer']})

# Serve the main HTML file
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/index.html')
def home_page():
    return render_template('index.html')

# Serve the About page
@app.route('/about.html')
def about():
    return render_template('about.html')

# Serve the Skills page
@app.route('/skills.html')
def skills():
    return render_template('skills.html')

# Serve the CSS file
@app.route('/style.css')
def serve_css():
    return send_from_directory('static', 'style.css')

# Serve JavaScript
@app.route('/script.js')
def serve_js():
    return send_from_directory('static', 'script.js')

# Serve images
@app.route('/main.webp')
def serve_file():
    return send_from_directory('static', 'main.webp')

@app.route('/assets/resume.pdf')
def resume_file():
    return send_from_directory('assets', 'resume.pdf')

if __name__ == '__main__':
    app.run(debug=True)
