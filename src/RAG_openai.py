from openai import OpenAI
from src.pinecone_db import vectorDB
from dotenv import load_dotenv
from dataclasses import dataclass
from src import pinecone_db

load_dotenv()

client = OpenAI(
    api_key= 
)

class AIResponse:
    def __init__(self, userResponse, source_knowledge):
        self.userResponse = userResponse
        self.source_knowledge = source_knowledge

    def generatePrompt(self):
        try:
            aug_prompt = f"""
            You are a chatbot that is trained to answer for user response.
            You are given the following context:
            {self.source_knowledge}
            You are asked to generate short and accurate answer to the following question using above context.
            question:
            {self.userResponse}
            strictly do not hallucinate. only use the above context to generate an answer.
            """
            return aug_prompt

        except Exception as e:
            raise e
    
    def generateResponse(self):
        try:
            prompt = self.generatePrompt()
            response = client.chat.completions.create(
                model="gpt-4-1106-preview",
                max_tokens=1024,
                temperature=0,
                messages= [
                    {"role": "system", "content": prompt}
                ]
            )
            model_response = response.choices[0].message.content 
            return model_response
        
        except Exception as e:
            raise e