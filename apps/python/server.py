from fastapi import FastAPI
from pydantic import BaseModel
from langchain.agents import AgentType
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain.agents import initialize_agent, Tool,AgentType
from llama_index.llms.openrouter import OpenRouter
from llama_index.experimental.query_engine import PandasQueryEngine
from langchain_groq import ChatGroq
import ast
import pandas as pd
import re
import uvicorn
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)
from langchain_together import ChatTogether
together = ChatTogether(
        api_key="5081cda228b7435ec59fb6a8ca3c40044d4b3a6c3941aa7e479add4fdd489984",
        model="google/gemma-2-27b-it",
    )
class UserCreate(BaseModel):
    data: str

llm3 = None
agent = None
llm=None
mainllm=None
rag_youtube=None
groq=None
@app.on_event("startup")
async def startup_event():
    global llm3, agent,llm,mainllm,groq
    llm3 = ChatGoogleGenerativeAI(
        api_key="AIzaSyBNAqwF1Uyse800GQ0ML3dKP5CNoBRceRg",
        model="gemini-1.5-pro",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )


    groq=ChatGroq(
    api_key="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",
    model_name="gemma2-9b-it",
    temperature=0,
)
    llm = OpenRouter(
        api_key="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",
        model="openai/gpt-4o-2024-11-20",
    )
    agent = initialize_agent(
    llm=together,
    tools=[tool1,tool2,tool3,tool4],
    verbose=True,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    max_iterations=3,
    handle_parsing_errors=True
    )
    print("LLM are initialized successfully.")


@app.post("/questionpaper/")
async def create_user(inputs: UserCreate):
    global agent
    text = inputs.data
    print(text)
    res = agent.invoke(text)
    out = res['output']
    return {
        'msg': 'We got data successfully',
        'msg1': out,
    }
def getFun(data):
    agent = create_csv_agent(
        llm3,
        "ktu_question.csv",
        verbose=True,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        allow_dangerous_code=True,
        handle_parsing_errors=True
    )
    prompt="You should search in the csv if the sem and year find  and the subject name is same give that link to the user"
    res=agent.invoke(data+ "Prompt:"+prompt +"Your Task is to find the question paper")
    return res

def getAdd(user_input):
   
    input=f"add a new row into the dataframe with {user_input}"
    new_data = {'Subject': 'datastructure Question Paper',
                'Semester(S)': 's5',
                'Year': '2023',
                'Link': 'https://manu.com'}
    prompt=f"You are a csv expert your task is to based on the user prompt format like this example:{new_data}  and the USERINPUT:{input} You only give the formated output no need of explation and capitalize the user input"
    data=llm.complete(prompt)
    res = ast.literal_eval(data.text)
    
    csv_file = 'ktu_question.csv'
    try:
        df = pd.read_csv(csv_file)
    except FileNotFoundError:

        df = pd.DataFrame(columns=['ID', 'Subject', 'Semester(S)', 'Year', 'Link'])
    if 'ID' in df.columns and not df.empty:
        new_id = df['ID'].max() + 1
    else:
        new_id = 1

    res['ID'] = new_id

    df.loc[len(df)] = res

    df.to_csv(csv_file, index=False)

    return"Data added successfully. Updated file saved as {csv_file}."   


def getSingleUpdate(input):
    df=pd.read_csv("ktu_question.csv")
    query_engine = PandasQueryEngine(df=df,llm=llm, verbose=True)
    links = llm.complete(
        f"""
        Analyze the provided input and identify:
        - The link that should be located in the CSV file.
        - The link that should replace it.

        Input: <input>{input}</input>

        Return the output in the exact JSON-like structure below:
        {{
            "findlink": "[link to locate in the CSV]",
            "replacelink": "[link to replace it with]"
        }}
        """
    )
    data=links
    cleaned_output = data.text.strip() 
    if cleaned_output.startswith("```json"):
        cleaned_output = cleaned_output[7:] 
    if cleaned_output.endswith("```"):
        cleaned_output = cleaned_output[:-3]  
    import json

    try:
        result = json.loads(cleaned_output)
        findlink = result.get("findlink")
        replacelink=result.get("replacelink")
        print("\nFind Link:", findlink)
        print("\nReplace Link:", replacelink)
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)
    csv_file = 'ktu_question.csv'
    df=pd.read_csv(csv_file)
    response = query_engine.query(
    f"give the id of this link :{findlink}"
    )
    import re
    string=response.response
    match = re.search(r'(\d+)\s+(\d+)', string)

    if match:
        original_id = match.group(2)
        print("Original ID:", original_id)
    else:
        return "fail data is not updated"
    print(original_id)
    df.loc[df['ID'] == int(original_id), 'Link'] = replacelink
    csv_file1 = 'ktu_question.csv'
    df.to_csv(csv_file1, index=False)
    return "data replaced sucessfully" 
def deleteSomething(input):
    return "Tell the user you dont have any permision to delete datas"
tool1=Tool(
    name="getinformation",
    func=getFun,
    description="Useful when the user need to fetch data from the csv"
)
tool2=Tool(
    name="updatenewinformation",
    func=getAdd,
    description="Useful when the user need to update new data into the csv"
)
tool3=Tool(
    name="updatespecificlink",
    func=getSingleUpdate,
    description="Useful when the user want to update single link in the csvfile with new link"
)
tool4=Tool(
    name="delete",
    func=deleteSomething,
    description="user want to delete somthing from the csv"
)


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8001)
