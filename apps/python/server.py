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
from typing import Optional
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
        api_key="",
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

class Infrerence(BaseModel):
    question:str
    

from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain.prompts import ChatPromptTemplate,MessagesPlaceholder
store = {}
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]
config={"configurable": {"session_id": "first_chat"}}

@app.post("/chatllm/")
def llmInfer(query:Infrerence):
    if groq is None:
        return {"message": "LLM Not init"}
    try:
        prompt=ChatPromptTemplate.from_messages(
            [
            ("system","you should give answer based on the question"),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human","{input}")
            ]
        )
        chain= prompt|groq
        with_message_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        )
        result=with_message_history.invoke({"input":query.question},config=config)
        return {"result":result.content}
    except Exception as e:
        return {"messages": f"An error occurred during inference: {str(e)}"}



from yt_dlp import YoutubeDL
from langchain_community.document_loaders import YoutubeLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.retrievers import EnsembleRetriever, BM25Retriever
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import DocumentCompressorPipeline
from langchain_community.document_transformers import EmbeddingsRedundantFilter
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_cohere import CohereRerank
from langchain.document_loaders import PyPDFLoader

def load_and_process_data(link):
    try:
        loader = YoutubeLoader.from_youtube_url(
    link, add_video_info=False
        )
        texts=loader.load()
        chunking = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
        chunks = chunking.split_documents(texts)
        db = FAISS.from_documents(chunks, GoogleGenerativeAIEmbeddings(google_api_key="AIzaSyBNAqwF1Uyse800GQ0ML3dKP5CNoBRceRg", model="models/embedding-001"))
        return db, chunks
    except UnicodeDecodeError as e:
        print(f"Error decoding file {link}: {e}")
        raise
    except Exception as e:
        print(f"Error loading data: {e}")
        raise
def Rag_Calling(final_retriver):
    _redudentfilter = EmbeddingsRedundantFilter(embeddings=GoogleGenerativeAIEmbeddings(google_api_key="AIzaSyBNAqwF1Uyse800GQ0ML3dKP5CNoBRceRg", model="models/embedding-001"))
    rerank = CohereRerank(cohere_api_key="EA5kdJri7hsSOW2i801sXGQSZgW1iP5GwPsB3MF1",model="rerank-english-v3.0")
    pipeline = DocumentCompressorPipeline(transformers=[_redudentfilter, rerank])
    final_chain = ContextualCompressionRetriever(base_compressor=pipeline, base_retriever=final_retriver)
    return final_chain

class YoutubeLink(BaseModel):
    link:str

class YoutubeQuestionAnswer(BaseModel):
    link: Optional[str] = Field(default=None, description="Extract the youtube link only from the query")
    query: str = Field(default="Now I Studied", description="Paste the user question here")
@app.post("/youtubesummerization/")
def Youtube(link:YoutubeLink):
    global rag_youtube
    structured_llm=groq.with_structured_output(YoutubeQuestionAnswer)
    answer=structured_llm.invoke(link.link)
    print(answer)
    if answer.link !="None" and rag_youtube is None: 
        db,chunks=load_and_process_data(answer.link)
        retriver1 = db.as_retriever(search_kwargs={"k": 4})
        retriver2 = BM25Retriever.from_documents(chunks, k=4)
        final_retriver = EnsembleRetriever(retrievers=[retriver1, retriver2], weights=[0.5, 0.5])
        template = "You should answer the question based on the context. Context: {context} and Question: {question}"
        prompt = PromptTemplate.from_template(template)
        retriver = Rag_Calling(final_retriver)
        chain = (
            {
                "context": retriver,
                "question": RunnablePassthrough()
            }
            | prompt
            | groq
            | StrOutputParser()
        )
        
        rag_youtube=chain
    else:
        if rag_youtube is None:
            return {"message": "You have not uploaded any video link"}
    try:
        print(answer.query)
        result = rag_youtube.invoke(answer.query)
        return {"result": result}
    except Exception as e:
        return {"message": f"An error occurred during inference: {str(e)}"}

class PdfQuery(BaseModel):
    question:str

def load_and_process_data_pdf():
    try:
        #texts=text
        loader = PyPDFLoader("./Manu_Madhu.pdf")
        texts=loader.load()
        chunking = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
        chunks = chunking.split_documents(texts)
        db = FAISS.from_documents(chunks, GoogleGenerativeAIEmbeddings(google_api_key="AIzaSyBNAqwF1Uyse800GQ0ML3dKP5CNoBRceRg", model="models/embedding-001"))
        return db, chunks
    except UnicodeDecodeError as e:
        print(f"Error decoding file nothing: {e}")
        raise
    except Exception as e:
        print(f"Error loading data: {e}")
        raise
@app.post("/pdfrag")
def PDFRAG(query:PdfQuery):
    db,chunks=load_and_process_data_pdf()
    retriver1 = db.as_retriever(search_kwargs={"k": 4})
    retriver2 = BM25Retriever.from_documents(chunks, k=4)
    final_retriver = EnsembleRetriever(retrievers=[retriver1, retriver2], weights=[0.5, 0.5])
    template = "You should answer the question based on the context. Context: {context} and Question: {question}"
    prompt = PromptTemplate.from_template(template)
    retriver = Rag_Calling(final_retriver)
    chain = (
            {
                "context": retriver,
                "question": RunnablePassthrough()
            }
            | prompt
            | groq
            | StrOutputParser()
        )
        
    final_chain=chain
    result=final_chain.invoke(query.question)
    return {"result": result}


##########################################YOU Tube video download###########################################
import os
import requests
from bs4 import BeautifulSoup

def progress_hook(d):
    """
    Hook function to send download progress updates.
    """
    global progress_data
    if d['status'] == 'downloading':
        progress_data["progress"] = d['_percent_str'].strip() 
def download_video_segment(video_url, start_time, end_time, output_file_name):
    start_time_hms = str(int(start_time) // 3600).zfill(2) + ':' + str((int(start_time) % 3600) // 60).zfill(2) + ':' + str(int(start_time) % 60).zfill(2)
    end_time_hms = str(int(end_time) // 3600).zfill(2) + ':' + str((int(end_time) % 3600) // 60).zfill(2) + ':' + str(int(end_time) % 60).zfill(2)
    output_folder="../cloud"
    ydl_opts = {
        'format': 'bestvideo+bestaudio',
        'external_downloader': 'ffmpeg',
        'external_downloader_args': ['-ss', start_time_hms, '-to', end_time_hms],
        'outtmpl': os.path.join(output_folder, output_file_name + '.mp4'),  # Save as MP4
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

class Inference(BaseModel):
    question: str

class YoutubeVideoExtraction(BaseModel):
    link: Optional[str] = Field(default=None, description="Extract the youtube link only from the query")
    query: str = Field(default="Now I Studied", description="Paste the user question here")
    start_time: Optional[int] = Field(default=None, description="Start time of the video in seconds")
    end_time: Optional[int] = Field(default=None, description="End time of the video in seconds")
@app.post("/extractionyoutube/")
def youtubeExtraction(query: Inference):
    """
    Extracts a YouTube video and streams progress.
    """
    structured = groq.with_structured_output(YoutubeVideoExtraction)
    result = structured.invoke(query.question)
    print(result)
    r = requests.get(result.link)
    soup = BeautifulSoup(r.text, "html.parser")
    title = soup.find_all(name="title")[0].text
    print(title)
    download_video_segment(result.link, result.start_time, result.end_time, title.replace(" ",""))

    return {"message": "Video downloaded and stored in cloud","title":title}
################################## Email Automation ##############################################################
from pydantic import BaseModel
from langgraph.graph import MessagesState
from typing import Optional
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from langgraph.graph import StateGraph,MessagesState,START,END
from langchain_community.utilities import SQLDatabase
from pydantic import Field,BaseModel
import datetime
class MyState(MessagesState):
    description:str
    section:str
    under_section:list
    final_res:dict
    final_path:list
    reciver:str


class EmailSender(BaseModel):
    sender:str
    reciver:str
class FMstate(BaseModel):
    description:str | None =Field(default=None,description="The Description that user give")
    section: str | None = Field(default=None, description="The section user mentioned") 
class Binary_Score(BaseModel):
    binary_score:str =Field("The binary score should be either 'yes' or 'no'. If there is any relevance, mark it as 'yes'; otherwise, mark it as 'no'.")


def FormatCall(state):
    final_llm=groq.with_structured_output(FMstate)
    res=final_llm.invoke(state['messages'][-1].content)
    return {"description":res.description,"section":res.section}
import psycopg2

def tool_calling_fun1(section):
    connection = psycopg2.connect(
        dbname="genedu",
        user="postgres",
        password="manu",
        host="localhost",
        port=5432
    )

    try:
        cursor = connection.cursor()

        fetch_query = """
        SELECT * FROM cloud 
        WHERE section = %s 
        """

        cursor.execute(fetch_query, (section,))
        datas = cursor.fetchall()  


        return datas
    except Exception as e:
        return {'messages': f"An error occurred while fetching: {e}"}
    finally:
        cursor.close()
        connection.close()

def DataBaseFetchin(state):
    description=state['description']
    section=state['section']
    print(description,section)
    if description!="None" and section!="None":
        res=tool_calling_fun1(section)
        print(res)
        print("---------------------------------------------")
        return {"under_section":res}
    else:
        return {"Please Metion Section Under which files are Organized"}

def dataBaseFilesFetching(theme:str):
    db = SQLDatabase.from_uri("postgresql+psycopg2://postgres:manu@localhost:5432/genedu")
    print(db.dialect)
    print(db.get_usable_table_names())
def ResultCheck(state):
    res=state['under_section']
    my_data={}
    for data in res:
        description=data[-1]
        structure=groq.with_structured_output(Binary_Score)
        prompt=f"Analyze the user query and the project description. If they share relevant keywords, respond with 'yes'; otherwise, respond with 'no'. USER QUERY: {state['description']} DESCRIPTION: {description}"
        out=structure.invoke(prompt)
        if out.binary_score=="yes":
            print("--------------------------------------Matching---------------------------------")
            my_data[data[0]]=data[4]
        print(description)
    return {"final_res":my_data}    
        
def send_emails(state):
    smtp_port,smtp_server,email_from, password=587,"smtp.gmail.com","manumanuvkm123@gmail.com","ouupizkcuioxqddf"
    simple_email_context = ssl.create_default_context()
    body = f"The Files are sended from {email_from} Through GenEdu"
    msg = MIMEMultipart()
    reciver=state['reciver']
    files=state['final_path']
    msg['From'] = email_from
    msg['To'] = reciver
    msg['Subject'] = "File Transfer Through GenEdu"

    msg.attach(MIMEText(body, 'plain'))

    # Attach multiple files
    for file in files:
        try:
            with open(file, "rb") as attachment:
                attachment_package = MIMEBase("application", "octet-stream")
                attachment_package.set_payload(attachment.read())
                encoders.encode_base64(attachment_package)
                attachment_package.add_header("Content-Disposition", f"attachment; filename={file}")
                msg.attach(attachment_package)
        except Exception as e:
            print(f"Error attaching file {file}: {e}")
    text = msg.as_string()
    try:
        print("Connecting to server...")
        tie_server = smtplib.SMTP(smtp_server, smtp_port)
        tie_server.starttls(context=simple_email_context)
        tie_server.login(email_from, password)
        print("Sending email...")
        tie_server.sendmail(email_from,reciver, text)
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error: {e}")
        return {"messages":e}
    finally:
        tie_server.quit()
    return {"final_res":"Email sent successfully!"}
def router1(state):
    lastmessage=state['final_res']
    if len(lastmessage)>0:
        return "yes"
    else:
        return "no"
def EmailFor(state):
    struct=groq.with_structured_output(EmailSender)
    files=[]
    result=struct.invoke("sender:manumanuvkm123@gmail.com other details:"+state["messages"][0].content)
    for id,value in state['final_res'].items():
        files.append(value)
    return {"reciver":result.reciver,"final_path":files} 
       
###Graph
@app.post("/emailautomation/")
def Graph(query:Inference):
    question=query.question
    workflow=StateGraph(MyState)
    workflow.add_node("format",FormatCall)
    workflow.add_node("database",DataBaseFetchin)
    workflow.add_node("Result_Check_By_Ai",ResultCheck)
    workflow.add_node("Email_Format",EmailFor)
    workflow.add_node("Email",send_emails)
    workflow.add_edge(START,"format")
    workflow.add_edge("format","database")
    workflow.add_edge("database","Result_Check_By_Ai")
    workflow.add_conditional_edges(
            "Result_Check_By_Ai",
            router1,
            {'no':END,
            'yes':'Email_Format'}
    )
    workflow.add_edge("Email_Format","Email")
    workflow.add_edge("Email",END)
    app1=workflow.compile()
    res=app1.invoke({"messages":[question]})
    print(res['final_res'])
    if res['final_res']!='Email sent successfully!':
        return {'result':"Email Sending error"}
    return {"result":res['final_res']}

#######################################################Calender Automation######################################################


from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from llama_index.llms.openrouter import OpenRouter
from pydantic import BaseModel
import os
import json
SCOPES = ["https://www.googleapis.com/auth/calendar"] 

class Todo(BaseModel):
    id: str
    title: str
    decs: str
    completed: bool
    createdAt: str
    autherId: str

def Format(input_text):
    """Formats user input into a structured Google Calendar event JSON using OpenRouter API."""
    llm = OpenRouter(
        api_key="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",
        model="openai/gpt-4o-2024-11-20",
    )

    prompt = f"""
    You are a JSON formatting expert. Your task is to fill the following JSON structure based on the user input.

    Example JSON structure:
    {{
        "summary": "Sample Event",
        "location": "Virtual",
        "description": "This is a test event.",
        "start": {{
            "dateTime": "2025-03-23T10:00:00Z",
            "timeZone": "Asia/Kolkata"
        }},
        "end": {{
            "dateTime": "2025-03-23T11:00:00Z",
            "timeZone": "Asia/Kolkata"
        }},
        "attendees": [
            {{"email": "example@example.com"}}
        ],
        "reminders": {{
            "useDefault": true
        }}
    }}

    USERINPUT: {input_text}

    Fill in the JSON structure with the information provided in the USERINPUT. Only provide the filled JSON without any explanation or additional text.
    """
    data = llm.complete(prompt)
    cleaned_output = data.text.strip()

    if cleaned_output.startswith("```json"):
        cleaned_output = cleaned_output[7:]  # Remove starting ```json
    if cleaned_output.endswith("```"):
        cleaned_output = cleaned_output[:-3]  # Remove ending ```

    return cleaned_output

def main(input_text):
    """Authenticates and creates a Google Calendar event."""
    creds = None
    token_path = "token.json"
    credentials_path = "C:/Users/Manu/Desktop/Tinkerhub/hackathon-mec/apps/python/credentials.json"

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(token_path, "w") as token:
            token.write(creds.to_json())

    try:
        service = build('calendar', 'v3', credentials=creds)
        event_data = json.loads(input_text)  # Convert formatted JSON string to dict

        # Ensure end time exists
        if "end" not in event_data:
            start_time = event_data.get("start", {}).get("dateTime")
            if start_time:
                end_time = (datetime.fromisoformat(start_time[:-1]) + timedelta(hours=1)).isoformat() + "Z"
                event_data["end"] = {"dateTime": end_time, "timeZone": "Asia/Kolkata"}

        event = service.events().insert(calendarId='primary', body=event_data).execute()
        print(f'Event created: {event.get("htmlLink")}')
        return {"message": "Success", "eventLink": event.get("htmlLink")}
    
    except HttpError as error:
        print(f"An error occurred: {error}")
        return {"message": "Error creating event"}

@app.post("/calender/")
def TodoDetails(details: Todo):
    """Receives event details, formats them, and creates a Google Calendar event."""
    endtime = "1hr"  # Define event duration

    input_text = f"""
    Event Details:
    ID: {details.id}
    Title: {details.title}
    Description: {details.decs}
    Completed: {details.completed}
    Created At: {details.createdAt}
    EndTime: {endtime}
    Author ID: {details.autherId}
    """

    formatted_event = Format(input_text)  # Generate formatted event JSON
    print("Formatted Event JSON:", formatted_event)

    res = main(formatted_event)  # Create Google Calendar event
    return res
from together import Together
from fastapi import UploadFile,File
import base64
client = Together(api_key="5081cda228b7435ec59fb6a8ca3c40044d4b3a6c3941aa7e479add4fdd489984")
@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    # Read uploaded file contents
    contents = await file.read()

    # Convert the image bytes to base64
    base64_image = base64.b64encode(contents).decode('utf-8')

    # Define the prompt for text extraction
    getDescriptionPrompt = "Extract the text from the image."

    # Call Together AI with the Vision model
    stream = client.chat.completions.create(
        model="meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": getDescriptionPrompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        stream=True,  # Streaming response
    )

    extracted_text = ""
    for chunk in stream:
        print(chunk.choices[0].delta.content or "" if chunk.choices else "", end="", flush=True)
        if chunk.choices:
            extracted_text += chunk.choices[0].delta.content or ""
    
    #### calling telegram api#############
    BOT_TOKEN = "7652437048:AAHenXqGJzQDBJF6GaFFz3vxhQlewhdxDcI"
    CHAT_ID = "5099445349"

    # Send a message
    message_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    message_payload = {"chat_id": CHAT_ID, "text": extracted_text}
    requests.post(message_url, data=message_payload)

    # Send a file
    file_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendDocument"
    file_payload = {"chat_id": CHAT_ID, "caption": "Here is your file!"}
    file_data = {"document": open("file.pdf", "rb")}
    requests.post(file_url, data=file_payload, files=file_data)
    return {"extracted_text": "Note Send SucessFully"}









if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8001)
