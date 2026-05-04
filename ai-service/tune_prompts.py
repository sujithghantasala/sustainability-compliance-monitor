import os
import json
from services.groq_client import GroqClient
from dotenv import load_dotenv

load_dotenv()

def run_tuning():
    client = GroqClient()
    
    # Current prompt (Day 6 tuned)
    prompt_path = os.path.join(os.path.dirname(__file__), 'prompts', 'sustainability_expert.txt')
    with open(prompt_path, 'r') as f:
        system_prompt = f.read().strip()
    
    inputs = [
        "Are data privacy breaches considered a material ESG risk for an e-commerce platform?",
        "How should a cement manufacturer approach setting science-based targets for decarbonization?",
        "Does a company with no board diversity face governance risks under the new SEC guidelines?",
        "What are the social compliance requirements for sourcing palm oil from Indonesia?",
        "Is greenwashing a significant risk when a company claims its plastics are 100% ocean-bound without third-party verification?",
        "How does water scarcity in semiconductor manufacturing regions impact a company's ESG profile?",
        "What are the implications of the Uyghur Forced Labor Prevention Act for solar panel supply chains?",
        "How can a financial institution ensure its loan portfolio is aligned with the Paris Agreement?",
        "What role does executive compensation tied to sustainability metrics play in corporate governance?",
        "Can Scope 3 emissions be entirely excluded from an IT company's initial sustainability report?"
    ]
    
    print(f"Testing Prompt: {system_prompt}\n")
    
    results = []
    for i, user_input in enumerate(inputs):
        print(f"Running input {i+1}/10: {user_input}")
        response = client.get_completion(user_input, system_prompt=system_prompt)
        results.append({
            "input": user_input,
            "output": response
        })
        
    with open("tuning_results.json", "w") as f:
        json.dump(results, f, indent=4)
    
    print("\nResults saved to tuning_results.json")

if __name__ == "__main__":
    run_tuning()
