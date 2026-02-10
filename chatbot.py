import os
from groq import Groq
from flask import jsonify, request
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Vector store for module documentation (simple in-memory for free tier)
MODULE_KNOWLEDGE = {
    "vectors": """Vector Spaces module teaches:
- Vector magnitude calculation using np.linalg.norm()
- Dot product using np.dot()
- Angle between vectors using arccos
- 3D visualization with Plotly

Common issues:
- Zero vectors have undefined angles
- Orthogonal vectors have dot product = 0""",
    
    "gradient": """Gradient Descent module demonstrates:
- Optimization algorithm for finding minima
- Learning rate controls step size
- Too high learning rate causes divergence
- Formula: x_new = x_old - learning_rate * gradient

Tips:
- Start with learning_rate = 0.1
- Watch the path converge to minimum
- If it bounces, reduce learning rate""",
    
    "matrices": """Matrix Operations module covers:
- Matrix multiplication using np.matmul()
- Determinant calculation
- Matrix inverse
- Transpose operations

Key concepts:
- Matrix dimensions must align for multiplication
- Only square matrices have determinants
- Singular matrices have no inverse""",
    
    "transformations": """Linear Transformations module shows:
- 2D shape transformations
- Rotation, scaling, shearing
- Matrix representation of transformations
- Composition of transformations

Applications:
- Computer graphics
- Image processing
- Coordinate system changes""",
    
    "systems": """Systems of Equations module demonstrates:
- Gaussian elimination algorithm
- Row reduction techniques
- Solution existence and uniqueness
- Augmented matrix representation

Tips:
- Check for inconsistent systems
- Pivot selection matters for numerical stability""",

    "eigen": """Eigenvalues & Eigenvectors module teaches:
- Spectral decomposition
- Characteristic polynomial
- Eigenvector computation
- Applications in PCA and stability analysis

Key insights:
- Eigenvalues show scaling factors
- Eigenvectors show invariant directions
- Symmetric matrices have real eigenvalues""",
    
    "neural": """Neural Network Visualizer demonstrates:
- Forward propagation
- Activation functions (sigmoid, ReLU, tanh)
- Layer-by-layer computation
- Weight and bias effects

Understanding:
- Each layer transforms input space
- Non-linear activations enable complex patterns
- Deeper networks learn hierarchical features""",
    
    "pca": """PCA (Principal Component Analysis) module shows:
- Dimensionality reduction technique
- Variance maximization
- Eigenvalue decomposition of covariance matrix
- Data projection onto principal components

Applications:
- Data compression
- Noise reduction
- Feature extraction
- Visualization of high-dimensional data""",
    
    "feature_space": """Feature Space & Classification module covers:
- Decision boundaries
- Linear vs non-linear classifiers
- Support Vector Machines
- Kernel methods

Concepts:
- Feature space representation
- Margin maximization
- Overfitting vs underfitting""",
    
    "convolution": """Convolution Filters module demonstrates:
- Image processing operations
- Edge detection (Sobel, Prewitt)
- Blur and sharpen filters
- Convolution operation mechanics

Applications:
- Computer vision
- CNN foundations
- Image enhancement""",
    
    "ml_model": """ML Model Trainer module provides:
- Interactive regression training
- Loss function visualization
- Gradient descent in action
- Model evaluation metrics

Learning objectives:
- Understanding training dynamics
- Hyperparameter tuning
- Convergence monitoring
- Overfitting detection"""
}

def get_chatbot_response(user_message, current_module=None, context=None, conversation_history=None):
    """Generate AI response using Groq API with enhanced context awareness"""
    
    # Build enhanced context-aware system prompt
    system_prompt = f"""You are a concise AI math tutor. Keep responses SHORT and DIRECT unless asked for details.

CURRENT CONTEXT:
- Module: {current_module or 'Homepage'}
- User is viewing: {context.get('page_title', 'Dashboard')}
- Recent actions: {context.get('recent_actions', 'Just opened page')}

RESPONSE RULES:
1. Be CONCISE - 2-3 sentences max unless user asks "explain in detail" or "tell me more"
2. Use LaTeX for math: $x^2$ or $$E=mc^2$$
3. Focus on what user is CURRENTLY doing
4. Suggest next actions based on context
5. Only elaborate when explicitly asked

MODULE CONTEXT:
{MODULE_KNOWLEDGE.get(current_module, "General platform knowledge")}

USER STATE:
{context if context else "No specific context"}"""
    
    # Build conversation messages with history
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history if provided (last 5 messages for context)
    if conversation_history:
        for msg in conversation_history[-5:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})
    
    try:
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=300,  # Reduced for concise responses
            stream=False
        )
        
        return {
            "response": chat_completion.choices[0].message.content,
            "success": True,
            "context": {
                "module": current_module,
                "timestamp": datetime.now().isoformat()
            }
        }
    except Exception as e:
        return {
            "response": f"Error: {str(e)}",
            "success": False
        }

def create_chat_routes(app):
    """Add chatbot routes to Flask app"""
    
    @app.route('/api/chat', methods=['POST'])
    def chat():
        data = request.json
        user_message = data.get('message', '')
        current_module = data.get('module', None)
        context = data.get('context', {})
        conversation_history = data.get('history', [])
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        result = get_chatbot_response(user_message, current_module, context, conversation_history)
        return jsonify(result)
    
    @app.route('/api/chat/suggest', methods=['POST'])
    def suggest_actions():
        """Generate dynamic context-aware suggestions"""
        data = request.json
        module = data.get('module')
        recent_messages = data.get('recent_messages', [])
        last_user_message = data.get('last_user_message', '')
        has_conversation = data.get('has_conversation', False)
        
        # Analyze conversation to generate relevant suggestions
        suggestions = []
        
        # Module-specific base suggestions (relevant to actual functionality)
        module_suggestions = {
            "gradient": [
                "Why isn't my optimization converging?",
                "What learning rate should I use?",
                "Explain the gradient descent formula"
            ],
            "vectors": [
                "How do I calculate dot product?",
                "What makes vectors orthogonal?",
                "Explain vector magnitude"
            ],
            "matrices": [
                "How to find matrix inverse?",
                "What is determinant used for?",
                "Explain matrix multiplication"
            ],
            "neural": [
                "Compare activation functions",
                "How do weights affect output?",
                "Explain forward propagation"
            ],
            "pca": [
                "How does PCA reduce dimensions?",
                "What is explained variance?",
                "When should I use PCA?"
            ],
            "eigen": [
                "What are eigenvalues?",
                "How to find eigenvectors?",
                "Why are eigenvalues important?"
            ],
            "transformations": [
                "How do rotation matrices work?",
                "Explain scaling transformations",
                "What is matrix composition?"
            ],
            "systems": [
                "How does Gaussian elimination work?",
                "When is a system inconsistent?",
                "Explain row reduction"
            ],
            "feature_space": [
                "What is a decision boundary?",
                "How does SVM work?",
                "Explain feature engineering"
            ],
            "convolution": [
                "How do edge detection filters work?",
                "What is convolution operation?",
                "Explain kernel matrices"
            ],
            "ml_model": [
                "What is overfitting?",
                "How to evaluate model performance?",
                "Explain loss functions"
            ],
            "home": [
                "What should I learn first?",
                "Explain the learning path",
                "Which module is most important?"
            ]
        }
        
        # Get base suggestions for current module
        base_suggestions = module_suggestions.get(module, [
            "What can you help me with?",
            "Explain this module",
            "Show me an example"
        ])
        
        # If there's conversation history, generate follow-up suggestions
        if has_conversation and last_user_message:
            # Generate contextual follow-ups based on last message
            if any(word in last_user_message.lower() for word in ['what', 'explain', 'how']):
                suggestions = [
                    "Tell me more about this",
                    "Show me an example",
                    "How is this used in practice?"
                ]
            elif any(word in last_user_message.lower() for word in ['why', 'not working', 'error', 'problem']):
                suggestions = [
                    "What should I try instead?",
                    "Explain the common mistakes",
                    "How do I debug this?"
                ]
            elif any(word in last_user_message.lower() for word in ['example', 'show', 'demonstrate']):
                suggestions = [
                    "Explain the math behind this",
                    "What are the key concepts?",
                    "How does this relate to other topics?"
                ]
            else:
                # Use module-specific suggestions
                suggestions = base_suggestions[:3]
        else:
            # No conversation yet, show module-specific suggestions
            suggestions = base_suggestions[:3]
        
        return jsonify({"suggestions": suggestions})
    
    @app.route('/api/chat/clear', methods=['POST'])
    def clear_chat():
        """Clear chat session"""
        return jsonify({"success": True, "message": "Chat session cleared"})
