COMPANY_TEMPLATES = {
    "Tesla": {
        "role_family": "Robotics & Embedded Systems Engineer",
        "required_skills": ["Python", "C++", "ROS", "Computer Vision", "PyTorch", "CUDA", "Linux", "Git", "OpenCV", "Control Systems"],
        "preferred_skills": ["Rust", "SLAM", "Motion Planning", "Docker", "Kubernetes", "ONNX", "TensorRT"],
        "project_expectations": ["Autonomous navigation system", "Real-time object detection pipeline", "Embedded ML deployment", "Robotic arm control"],
        "interview_focus": ["System design for robotics", "ML model optimization", "Low-latency inference", "Sensor fusion"],
        "logo_color": "#E82127",
        "industry": "EV / Robotics"
    },
    "NVIDIA": {
        "role_family": "AI/ML Research & Systems Engineer",
        "required_skills": ["CUDA", "PyTorch", "Python", "C++", "GPU Programming", "Deep Learning", "Linux", "Git", "TensorRT"],
        "preferred_skills": ["Triton", "ONNX", "Distributed Training", "MLOps", "RAPIDS", "Hopper Architecture"],
        "project_expectations": ["GPU-accelerated ML training", "Custom CUDA kernels", "Inference optimization pipeline", "Large-scale distributed training"],
        "interview_focus": ["GPU architecture", "Memory hierarchy optimization", "Parallel programming", "ML system design"],
        "logo_color": "#76B900",
        "industry": "Semiconductors / AI"
    },
    "Google": {
        "role_family": "Software Engineer / ML Engineer",
        "required_skills": ["Python", "Go", "Java", "Distributed Systems", "ML", "TensorFlow", "Kubernetes", "SQL", "System Design"],
        "preferred_skills": ["JAX", "TPU programming", "BigQuery", "Spanner", "gRPC", "Protobuf"],
        "project_expectations": ["Scalable backend service", "ML pipeline on GCP", "Data processing at scale", "API design"],
        "interview_focus": ["Algorithms & data structures", "System design at scale", "ML fundamentals", "Coding quality"],
        "logo_color": "#4285F4",
        "industry": "Cloud / Search / AI"
    },
    "Microsoft": {
        "role_family": "AI Platform Engineer",
        "required_skills": ["Python", "C#", "Azure", "PyTorch", "Kubernetes", "REST APIs", "SQL", "Git", "TypeScript"],
        "preferred_skills": ["Azure ML", "ONNX Runtime", "Semantic Kernel", "Copilot SDK", "Power Platform"],
        "project_expectations": ["Azure-deployed AI service", "Enterprise LLM integration", "RAG pipeline", "MLOps on Azure"],
        "interview_focus": ["Cloud architecture", "LLM integration patterns", "Enterprise software design", "Security considerations"],
        "logo_color": "#00BCF2",
        "industry": "Cloud / Enterprise Software"
    },
    "Amazon": {
        "role_family": "ML Engineer / Applied Scientist",
        "required_skills": ["Python", "AWS", "PyTorch", "TensorFlow", "Spark", "SageMaker", "SQL", "Scala", "System Design"],
        "preferred_skills": ["AWS Lambda", "Kinesis", "DynamoDB", "MLflow", "Airflow", "Redshift"],
        "project_expectations": ["End-to-end ML pipeline on AWS", "Real-time recommendation system", "A/B testing framework", "Data lake design"],
        "interview_focus": ["Leadership principles", "ML system design", "Data engineering", "Operational excellence"],
        "logo_color": "#FF9900",
        "industry": "E-commerce / Cloud"
    },
    "Apple": {
        "role_family": "ML Systems Engineer",
        "required_skills": ["Python", "Swift", "Core ML", "PyTorch", "Metal", "On-device ML", "C++", "Optimization"],
        "preferred_skills": ["Neural Engine", "ANE optimization", "Privacy-preserving ML", "Federated Learning", "MLIR"],
        "project_expectations": ["On-device ML model deployment", "Core ML conversion pipeline", "Mobile-optimized neural network", "Privacy-first AI feature"],
        "interview_focus": ["On-device inference optimization", "Privacy and security", "Hardware-software co-design", "Energy efficiency"],
        "logo_color": "#555555",
        "industry": "Consumer Electronics / Software"
    },
    "Meta": {
        "role_family": "GenAI / Research Engineer",
        "required_skills": ["Python", "PyTorch", "LLMs", "Transformers", "CUDA", "Distributed Training", "Research", "C++"],
        "preferred_skills": ["Llama", "RLHF", "PEFT", "vLLM", "Triton", "Open Source contributions"],
        "project_expectations": ["LLM fine-tuning pipeline", "Multi-modal AI system", "RLHF implementation", "Open-source AI contribution"],
        "interview_focus": ["LLM architecture", "RLHF/RLAIF", "Research methodology", "Scaling laws"],
        "logo_color": "#0866FF",
        "industry": "Social Media / AI Research"
    },
    "OpenAI": {
        "role_family": "Applied AI Engineer",
        "required_skills": ["Python", "PyTorch", "LLMs", "API Design", "RAG", "Prompt Engineering", "Evals", "MLOps"],
        "preferred_skills": ["GPT fine-tuning", "Function calling", "Assistants API", "Safety techniques", "Red-teaming"],
        "project_expectations": ["Production LLM application", "Evaluation framework", "RAG system with citations", "Multi-agent workflow"],
        "interview_focus": ["LLM application architecture", "Safety and alignment", "Evaluation design", "Product thinking for AI"],
        "logo_color": "#10A37F",
        "industry": "AI Research & Products"
    }
}

DEMO_RESUMES = {
    "aiml_student": """
Alex Chen | alex.chen@email.com | github.com/alexchen | linkedin.com/in/alexchen

EDUCATION
B.S. Computer Science, UC Berkeley, GPA 3.8 (2021-2025)
Relevant Coursework: Machine Learning, Deep Learning, Data Structures, Linear Algebra, Statistics

SKILLS
Languages: Python, C++, JavaScript, SQL
ML/AI: PyTorch, TensorFlow, scikit-learn, Pandas, NumPy, Matplotlib
Tools: Git, Docker, Linux, Jupyter, VS Code
Cloud: AWS (EC2, S3, basic SageMaker)

PROJECTS
Sentiment Analysis API (2024)
- Built BERT-based sentiment classifier achieving 91% accuracy on SST-2 dataset
- Deployed as REST API using FastAPI and Docker on AWS EC2
- Processed 10K+ reviews per hour with <100ms latency

Image Classification Pipeline (2023)
- Trained ResNet-50 on custom dataset of 50K images using transfer learning
- Reduced training time by 40% using mixed precision training
- Achieved 87% top-1 accuracy, 96% top-5 accuracy

Stock Price Predictor (2023)
- Built LSTM model for time-series forecasting using 5 years of NASDAQ data
- Integrated technical indicators as features improving RMSE by 23%

EXPERIENCE
ML Research Intern, Stanford HAI Lab (Summer 2024)
- Assisted in training language models for low-resource NLP tasks
- Familiar with transformer architectures and attention mechanisms
- Contributed to data pipeline improvements

AWARDS
- 2nd Place, Cal Hacks 10.0 (2023)
- Dean's List (2022, 2023)
""",
    "robotics_student": """
Priya Patel | priya.patel@email.com | github.com/priyarobotics

EDUCATION
M.S. Robotics Engineering, Carnegie Mellon University (2023-2025)
B.S. Mechanical Engineering, Georgia Tech, GPA 3.7 (2019-2023)

SKILLS
Languages: Python, C++, MATLAB
Robotics: ROS/ROS2, Gazebo, MoveIt, Nav2, SLAM (Cartographer, RTAB-Map)
ML/Vision: OpenCV, PyTorch, YOLOv8, Point Cloud Library
Hardware: Arduino, Raspberry Pi, NVIDIA Jetson, IMU, LiDAR
Tools: Git, Linux, Docker, SolidWorks

PROJECTS
Autonomous Mobile Robot for Warehouse Navigation (2024)
- Designed and implemented ROS2-based AMR with LiDAR SLAM for indoor navigation
- Achieved 98.5% successful navigation rate in simulated warehouse environment
- Integrated YOLOv8 for real-time obstacle classification at 30 FPS on Jetson Nano

Robotic Arm Manipulation with Vision (2024)
- Built 6-DOF robotic arm with vision-based pick-and-place using MoveIt
- Implemented grasp planning achieving 92% success rate on diverse objects

ROS2 Multi-Robot Coordination (2023)
- Developed decentralized coordination algorithm for 5-robot swarm
- Reduced task completion time by 35% compared to centralized approach

EXPERIENCE
Robotics Engineering Intern, Boston Dynamics (Summer 2024)
- Worked on perception pipeline for Spot robot
- Developed point cloud processing algorithms in C++

PUBLICATIONS
- "Efficient SLAM for Dynamic Indoor Environments" - ICRA Workshop 2024
""",
    "fullstack_student": """
Jordan Kim | jordan.kim@email.com | github.com/jordandev | portfolio.jordankim.dev

EDUCATION
B.S. Computer Science, University of Washington, GPA 3.6 (2021-2025)

SKILLS
Frontend: React, Next.js, TypeScript, Tailwind CSS, Redux, GraphQL
Backend: Node.js, Python, FastAPI, PostgreSQL, MongoDB, Redis
DevOps: Docker, GitHub Actions, Vercel, AWS basics, Linux
Tools: Git, Figma, Postman, Jest, Cypress

PROJECTS
E-Commerce Platform with AI Recommendations (2024)
- Built full-stack marketplace with Next.js 14 App Router and FastAPI backend
- Integrated collaborative filtering recommender serving 500+ products
- Implemented real-time order tracking with WebSockets
- Deployed on AWS with Docker Compose, handling 1000+ concurrent users

Real-Time Collaboration Tool (2023)
- Built Notion-like editor with real-time sync using Yjs CRDT and WebSockets
- Implemented permission system supporting 10+ permission levels
- Reduced latency by 60% with Redis-based pub/sub architecture

Open Source Contributions
- Contributed 3 PRs to shadcn/ui component library (merged)
- Maintained npm package with 500+ weekly downloads

EXPERIENCE
Software Engineering Intern, Stripe (Summer 2024)
- Built internal dashboard for fraud detection metrics using React and TypeScript
- Improved dashboard load time by 45% with data virtualization

AWARDS
- Winner, HackMIT 2023 (Best Developer Tool)
"""
}

SAMPLE_JOB_DESCRIPTIONS = {
    "Tesla Robotics Engineer": """
Tesla is looking for a Robotics Software Engineer to join the Optimus team.

Requirements:
- 2+ years experience in robotics software development
- Strong C++ and Python skills
- Experience with ROS/ROS2 and robotics simulation
- Knowledge of computer vision and sensor fusion
- Experience with SLAM and path planning algorithms
- Familiarity with NVIDIA CUDA and GPU programming
- Experience deploying ML models on embedded systems

Preferred:
- Experience with reinforcement learning for robotics
- Knowledge of control theory and dynamics
- Experience with TensorRT or ONNX for inference optimization
- Contributions to open-source robotics projects

Responsibilities:
- Develop perception and navigation systems for humanoid robots
- Optimize real-time inference pipelines for embedded deployment
- Collaborate with mechanical and electrical teams
- Build simulation environments for testing
""",
    "NVIDIA AI Engineer": """
NVIDIA Research is seeking a Senior AI/ML Engineer.

Must Have:
- Expert-level Python and CUDA programming
- Deep expertise in PyTorch and distributed training
- Experience optimizing ML inference (TensorRT, quantization, pruning)
- Strong understanding of GPU memory hierarchy and optimization
- Experience with transformer architectures

Nice to Have:
- Experience with NVIDIA Triton Inference Server
- Knowledge of ONNX and model export pipelines
- Research publication record
- Experience with multi-GPU and multi-node training

What You'll Do:
- Design and implement high-performance ML training infrastructure
- Optimize foundation models for production inference
- Develop CUDA kernels for novel operations
- Work with cutting-edge AI research teams
"""
}

def get_mock_analysis(resume_text: str, job_text: str, company_name: str = None) -> dict:
    """Generate mock analysis without requiring AI APIs."""
    import random
    import re
    
    resume_lower = resume_text.lower()
    job_lower = job_text.lower() if job_text else ""
    
    # Common skill keywords
    all_skills = [
        "python", "pytorch", "tensorflow", "cuda", "c++", "ros", "ros2", "docker",
        "kubernetes", "aws", "gcp", "azure", "sql", "postgresql", "redis", "git",
        "linux", "react", "typescript", "node.js", "fastapi", "transformer",
        "bert", "gpt", "llm", "computer vision", "nlp", "sklearn", "numpy",
        "pandas", "matplotlib", "jupyter", "spark", "kafka", "mlflow", "airflow",
        "next.js", "tailwind", "graphql", "mongodb", "elasticsearch", "jenkins"
    ]
    
    resume_skills = [s for s in all_skills if s in resume_lower]
    job_skills = [s for s in all_skills if s in job_lower] if job_lower else []
    
    if company_name and company_name in COMPANY_TEMPLATES:
        template = COMPANY_TEMPLATES[company_name]
        job_skills = [s.lower() for s in template["required_skills"]]
    
    matched = list(set(resume_skills) & set(job_skills)) if job_skills else resume_skills[:6]
    missing = list(set(job_skills) - set(resume_skills)) if job_skills else all_skills[20:26]
    
    skill_match = min(95, round(len(matched) / max(len(job_skills), 1) * 100, 1)) if job_skills else random.randint(45, 70)
    semantic = round(random.uniform(0.55, 0.88) * 100, 1)
    project_rel = round(random.uniform(0.50, 0.85) * 100, 1)
    exp_depth = round(random.uniform(0.50, 0.80) * 100, 1)
    ats = round(random.uniform(0.65, 0.92) * 100, 1)
    
    final_score = round(
        0.30 * skill_match +
        0.25 * semantic +
        0.20 * project_rel +
        0.15 * exp_depth +
        0.10 * ats, 1
    )
    
    interview_readiness = round((skill_match * 0.4 + project_rel * 0.6), 1)
    
    improved_bullets = [
        {
            "original": "Worked on machine learning projects",
            "improved": "Designed and deployed 3 production ML models achieving 87-91% accuracy, serving 10K+ daily requests with <100ms latency",
            "why": "Added specific metrics, scale, and impact"
        },
        {
            "original": "Familiar with Docker and deployment",
            "improved": "Containerized 5 microservices using Docker Compose, reducing deployment time by 70% and enabling zero-downtime rollouts",
            "why": "Replaced vague 'familiar with' with quantified achievement"
        },
        {
            "original": "Helped improve team performance",
            "improved": "Refactored data pipeline architecture reducing processing time from 4 hours to 23 minutes for 50GB daily batch",
            "why": "Added specific before/after metrics and context"
        }
    ]
    
    recommendations = [
        {"type": "skill", "title": f"Learn {missing[0].title() if missing else 'CUDA'}", "description": "This is a top required skill for your target role", "priority": "high"},
        {"type": "project", "title": "Build an end-to-end deployment project", "description": "Show production-ready code with CI/CD, monitoring, and scaling", "priority": "high"},
        {"type": "resume", "title": "Quantify your impact", "description": "Add specific numbers, percentages, and scale to all bullet points", "priority": "medium"},
        {"type": "skill", "title": f"Add {missing[1].title() if len(missing) > 1 else 'distributed training'} experience", "description": "Your target company heavily uses this technology", "priority": "medium"},
    ]
    
    summary = f"Your resume shows strong {', '.join(matched[:3]) if matched else 'technical'} skills. "
    summary += f"The alignment with {'the target role' if not company_name else company_name} is {final_score:.0f}%. "
    summary += f"Key gaps include {', '.join(missing[:3]) if missing else 'production deployment experience'}. "
    summary += "Focus on quantifying achievements and building deployment-focused projects to improve your score."
    
    return {
        "final_fit_score": final_score,
        "ats_score": ats,
        "skill_match_score": skill_match,
        "semantic_match_score": semantic,
        "project_relevance_score": project_rel,
        "experience_depth_score": exp_depth,
        "interview_readiness_score": interview_readiness,
        "matched_skills": matched[:10],
        "missing_skills": missing[:8],
        "improved_bullets": improved_bullets,
        "summary": summary,
        "recommendations": recommendations
    }

def get_interview_questions(company_name: str = None, role: str = None, missing_skills: list = None) -> list:
    questions = []
    
    technical = [
        {"question": "Explain the difference between batch normalization and layer normalization. When would you use each?", "category": "Technical", "difficulty": "Medium", "answer_hint": "Batch norm across batch dimension, layer norm across feature dimension. Batch norm better for CNNs, layer norm for transformers/RNNs."},
        {"question": "How would you design a system to serve 1 million ML inference requests per day?", "category": "System Design", "difficulty": "Hard", "answer_hint": "Consider: load balancing, model serving (Triton/TorchServe), caching, batching, async queues, monitoring."},
        {"question": "Walk me through implementing gradient descent from scratch in NumPy.", "category": "Technical", "difficulty": "Medium", "answer_hint": "Initialize weights, compute loss, calculate gradients, update weights by -lr * gradient. Discuss learning rate, momentum."},
        {"question": "What is the attention mechanism and how does it work in transformers?", "category": "Technical", "difficulty": "Medium", "answer_hint": "Q, K, V matrices. Scaled dot-product attention: softmax(QK^T / sqrt(d_k)) * V. Multi-head attention."},
        {"question": "How do you prevent overfitting in deep neural networks?", "category": "Technical", "difficulty": "Easy", "answer_hint": "Dropout, L1/L2 regularization, data augmentation, early stopping, batch normalization, reduce model capacity."},
    ]
    
    behavioral = [
        {"question": "Tell me about a time you had to debug a complex ML issue in production.", "category": "Behavioral", "difficulty": "Medium", "answer_hint": "Use STAR format. Focus on systematic debugging, monitoring tools, impact, and prevention measures."},
        {"question": "Describe a project where you had to make tradeoffs between model accuracy and latency.", "category": "Behavioral", "difficulty": "Medium", "answer_hint": "Discuss quantization, pruning, distillation, batching strategies. Show product thinking."},
        {"question": "How do you stay current with AI/ML research?", "category": "Behavioral", "difficulty": "Easy", "answer_hint": "ArXiv, Papers With Code, Hugging Face blog, Twitter/X ML community, conference proceedings."},
    ]
    
    company_specific = {
        "Tesla": [
            {"question": "How would you design a real-time object detection system for autonomous vehicles with strict latency requirements?", "category": "Company-Specific", "difficulty": "Hard", "answer_hint": "TensorRT optimization, CUDA streams, INT8 quantization, hardware-aware NAS, edge deployment on NVIDIA Drive."},
            {"question": "Explain SLAM and how you would improve it for dynamic environments.", "category": "Company-Specific", "difficulty": "Hard", "answer_hint": "Feature extraction, data association, loop closure. For dynamic environments: object tracking, semantic segmentation to remove dynamic elements."},
        ],
        "NVIDIA": [
            {"question": "Write a CUDA kernel to perform matrix multiplication efficiently.", "category": "Company-Specific", "difficulty": "Hard", "answer_hint": "Shared memory tiling, coalesced memory access, warp divergence avoidance, occupancy optimization."},
            {"question": "How does NVIDIA's Tensor Core work and how do you maximize its utilization?", "category": "Company-Specific", "difficulty": "Hard", "answer_hint": "Tensor Cores perform D = A*B+C in one operation on 16x16 tiles. Need mixed precision (FP16/BF16), proper tensor shapes, aligned memory."},
        ],
        "OpenAI": [
            {"question": "How would you build a robust evaluation framework for a large language model?", "category": "Company-Specific", "difficulty": "Hard", "answer_hint": "Automated metrics (BLEU, ROUGE, perplexity), human evaluation, adversarial testing, task-specific benchmarks, A/B testing in production."},
            {"question": "Explain RLHF and its limitations. What alternatives have emerged?", "category": "Company-Specific", "difficulty": "Hard", "answer_hint": "RLHF: supervised fine-tuning + reward model + PPO. Limitations: reward hacking, expensive human labeling. Alternatives: DPO, RLAIF, Constitutional AI."},
        ]
    }
    
    questions.extend(technical[:3])
    questions.extend(behavioral[:2])
    
    if company_name and company_name in company_specific:
        questions.extend(company_specific[company_name])
    
    return questions

def get_project_suggestions(missing_skills: list = None, company_name: str = None) -> list:
    all_projects = [
        {
            "title": "Production RAG-based AI Assistant",
            "tech_stack": ["Python", "LangChain", "OpenAI API", "Pinecone", "FastAPI", "Docker", "PostgreSQL"],
            "description": "Build a production-ready Retrieval-Augmented Generation system that ingests PDF documents, chunks and embeds them, stores in vector DB, and answers questions with citations. Include streaming, conversation history, and confidence scoring.",
            "resume_bullet": "Architected production RAG system processing 1000+ documents, achieving 89% answer accuracy with sub-2s response time using LangChain, Pinecone, and GPT-4",
            "difficulty": "Intermediate"
        },
        {
            "title": "Dockerized ML Model Serving Platform",
            "tech_stack": ["Python", "PyTorch", "FastAPI", "Docker", "Kubernetes", "Prometheus", "Grafana", "Redis"],
            "description": "Create a complete ML model serving infrastructure with model versioning, A/B testing, real-time monitoring, and auto-scaling. Deploy multiple models behind a unified API gateway.",
            "resume_bullet": "Built ML serving platform handling 50K daily inferences with 99.9% uptime, implementing A/B testing framework and real-time monitoring via Prometheus/Grafana",
            "difficulty": "Advanced"
        },
        {
            "title": "ROS2 Autonomous Navigation Robot",
            "tech_stack": ["Python", "C++", "ROS2", "Nav2", "SLAM", "YOLOv8", "NVIDIA Jetson", "OpenCV"],
            "description": "Implement a complete autonomous mobile robot using ROS2 with LiDAR-based SLAM, obstacle avoidance, and vision-based object recognition. Deploy on NVIDIA Jetson for edge inference.",
            "resume_bullet": "Developed ROS2 AMR achieving 97% navigation success rate in dynamic environments, integrating real-time SLAM with YOLOv8 object detection at 30 FPS on Jetson Nano",
            "difficulty": "Advanced"
        },
        {
            "title": "GPU-Optimized Training Pipeline",
            "tech_stack": ["Python", "PyTorch", "CUDA", "Distributed Training", "W&B", "Docker", "AWS EC2"],
            "description": "Build a multi-GPU training pipeline for vision transformers with gradient checkpointing, mixed precision, and distributed data parallelism. Include experiment tracking and hyperparameter optimization.",
            "resume_bullet": "Engineered distributed training pipeline reducing ViT training time by 4x using DDP across 4 A100 GPUs with gradient checkpointing and automated HPO via Optuna",
            "difficulty": "Advanced"
        },
        {
            "title": "Real-Time Stock Trading Signal System",
            "tech_stack": ["Python", "Kafka", "PostgreSQL", "Redis", "FastAPI", "React", "Docker", "Airflow"],
            "description": "Build a real-time data pipeline that ingests market data via Kafka, runs ML models for signal generation, stores results in PostgreSQL with Redis caching, and visualizes on a live dashboard.",
            "resume_bullet": "Architected real-time trading signal pipeline processing 100K events/sec via Kafka with <50ms end-to-end latency, ML model achieving 62% directional accuracy",
            "difficulty": "Advanced"
        },
        {
            "title": "LLM Fine-Tuning Pipeline with PEFT",
            "tech_stack": ["Python", "PyTorch", "Transformers", "PEFT", "LoRA", "W&B", "HuggingFace", "Docker"],
            "description": "Create an end-to-end pipeline for fine-tuning open-source LLMs using LoRA/QLoRA with DPO alignment. Include dataset preparation, training, evaluation with LM-Eval harness, and deployment.",
            "resume_bullet": "Fine-tuned Llama-3 8B using QLoRA achieving 91% of GPT-4 performance on domain tasks at 8x lower inference cost, deployed via vLLM with 3x throughput vs naive serving",
            "difficulty": "Advanced"
        }
    ]
    return all_projects[:4]
