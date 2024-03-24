from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import api_keys

app = FastAPI()
# connect to a vector db
# login endpoint set collection to username. Make vectorstore variable equal to that
# upload endpoint add the doc to vectorstore variable

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from langchain.document_loaders import WebBaseLoader # , TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import CohereEmbeddings
from langchain.vectorstores import Qdrant
from langchain.chat_models import JinaChat
from langchain.chat_models import ChatOpenAI
from langchain_community.chat_models import ChatCohere
from langchain.schema.runnable import RunnablePassthrough
from langchain import hub
from langchain.schema import StrOutputParser
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate
from langchain_core.messages import HumanMessage

from PyPDF2 import PdfReader
from io import BytesIO

# First endpoint
vector_db_now = {}
user = "default"

@app.get("/")
def read_root():
    return {"message": "Hello, World!"} # return some sort of main page

@app.get("/login") # called on clicking login
def login(username:str, pwd:str):
    # check for this somewhere
    # set user to be username
    # set vector_db to have all current filenames and pointers
    return {"message":"ok or not"} 

# Second endpoint
@app.post("/upload") 
async def upload_pdf(file: UploadFile = File(...)):
    # Check if the uploaded file is a PDF
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed."}

    # Process the PDF file (you can save it, analyze it, etc.)
    contents = await file.read()
    filename = file.filename
    print (filename)
    pdf_file = BytesIO(contents)
    pdf_reader = PdfReader(pdf_file)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=0)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    docs = text_splitter.split_text(text)

    embeddings = CohereEmbeddings(model="embed-english-light-v2.0", cohere_api_key=api_keys.Cohere)
    collection_name = user # collection_name = f"{user}_{filename}"
    vectorstore = Qdrant.from_texts(docs, embeddings, location=":memory:", collection_name=collection_name)
    # print(type(vectorstore))
    vector_db_now["file"] = vectorstore
    # change this to on premise with Docker
    # You can now use the 'contents' variable to perform further processing on the PDF file

@app.get("/url")
def upload_url(url: str):
    loader = WebBaseLoader(url)
    data = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=0)
    docs = text_splitter.split_documents(data)
    embeddings = CohereEmbeddings(model="embed-english-light-v2.0", cohere_api_key=api_keys.Cohere)
    collection_name = user
    vectorstore = Qdrant.from_documents(docs, embeddings, location=":memory:", collection_name=collection_name)
    vector_db_now["url"] = vectorstore

@app.get("/paste")
def upload_url(text_str: str):
    print("text_str=", text_str)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=0)
    docs = text_splitter.split_text(text_str)
    embeddings = CohereEmbeddings(model="embed-english-light-v2.0", cohere_api_key=api_keys.Cohere)
    collection_name = user
    vectorstore = Qdrant.from_texts(docs, embeddings, location=":memory:", collection_name=collection_name)
    vector_db_now["text"] = vectorstore

@app.get("/ask")
def get_answer(question: str, tab: int, llmName:str): # tab for file or url
    answer = ""
    try:
        llm = ""
        if (llmName=="JinaChat"):
            llm = JinaChat(jinachat_api_key=api_keys.Jina, temperature=0.5)
            # try another one at least
            # prompt = hub.pull("rlm/rag-prompt")
            # print(prompt, type(prompt))
            prompt = ChatPromptTemplate (
                input_variables=['question', 'context'], output_parser=None, partial_variables={}, messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['question', 'context'], output_parser=None, partial_variables={}, template="You are a helpful assistant for question-answering tasks. Speak in a friendly tone. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Answer in at most four sentences. If the context contains first person text, assume it refers to a narrator.\nQuestion: {question} \nContext: {context} \nAnswer:", template_format='f-string', validate_template=True), additional_kwargs={})]
            )
            #print(prompt, type(prompt))
            collection_name = user  # collection_name = f"{user}_{docname}"
            try:
                if tab == 0:
                    retriever = vector_db_now["file"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
                elif tab == 1:
                    retriever = vector_db_now["url"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
                else:
                    retriever = vector_db_now["text"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
            except:
                raise Exception("Please enter text before asking questions")

            def format_docs(docs):
                #return "\n\n".join(doc.page_content for doc in docs)
                try:
                    return "\n\n".join(doc.page_content for doc in docs)
            
                except:
                    return "\n\n".join(doc for doc in docs)

            rag_chain = (
            {"context": retriever | format_docs , "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
            )
        
            answer = rag_chain.invoke(question)

        elif (llmName == "OpenAI"):
            llm = ChatOpenAI(openai_api_key=api_keys.OpenAI, temperature=0.3)
            # try another one at least
            # prompt = hub.pull("rlm/rag-prompt")
            # print(prompt, type(prompt))
            prompt = ChatPromptTemplate (
                input_variables=['question', 'context'], output_parser=None, partial_variables={}, messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['question', 'context'], output_parser=None, partial_variables={}, template="You are a helpful assistant for question-answering tasks. Speak in a friendly tone. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Answer in at most four sentences. If the context contains first person text, assume it refers to a narrator.\nQuestion: {question} \nContext: {context} \nAnswer:", template_format='f-string', validate_template=True), additional_kwargs={})]
            )
            #print(prompt, type(prompt))
            collection_name = user  # collection_name = f"{user}_{docname}"
            try:
                if tab == 0:
                    retriever = vector_db_now["file"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
                elif tab == 1:
                    retriever = vector_db_now["url"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
                else:
                    retriever = vector_db_now["text"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
            except:
                raise Exception("Please enter text before asking questions")

            def format_docs(docs):
                #return "\n\n".join(doc.page_content for doc in docs)
                try:
                    return "\n\n".join(doc.page_content for doc in docs)
            
                except:
                    return "\n\n".join(doc for doc in docs)

            rag_chain = (
            {"context": retriever | format_docs , "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
            )
        
            answer = rag_chain.invoke(question)
        
        elif (llmName=="Cohere"):
            llm = ChatCohere(cohere_api_key=api_keys.Cohere, model="command", max_tokens=256, temperature=0.1)
            # prompt = ChatPromptTemplate (
            #     input_variables=['question', 'context'], output_parser=None, partial_variables={}, messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['question', 'context'], output_parser=None, partial_variables={}, template="You are a friendly and cheerful assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Keep the answer concise.\nQuestion: {question} \nContext: {context} \nAnswer:", template_format='f-string', validate_template=True), additional_kwargs={})]
            # )
            try:
                if tab == 0:
                    retriever = vector_db_now["file"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
                elif tab == 1:
                    retriever = vector_db_now["url"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
                else:
                    retriever = vector_db_now["text"].as_retriever(search_type="similarity", search_kwargs={"k": 6})
            except:
                raise Exception("Please enter text before asking questions")

            def format_docs(docs):
                try:
                    return "\n\n".join(doc.page_content for doc in docs)
            
                except:
                    return "\n\n".join(doc for doc in docs)
                
            context = format_docs(retriever.get_relevant_documents(question))
            print(context)
            message = [HumanMessage(content=f"You are a helpful assistant for question-answering tasks. Speak in a friendly tone. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Answer in at most four sentences. If the context contains first person text, assume it refers to a narrator. \nQuestion: {question} \nContext: {context} \nAnswer:")]
            answer = llm.invoke(message).content

        else:
            raise Exception("no LLM specified")


    except Exception as ex: 
        answer = f"Oops! Error generating response: {ex}"
        print(ex)

    
    print(answer)
    return JSONResponse(content={"answer": answer}, status_code=200)
