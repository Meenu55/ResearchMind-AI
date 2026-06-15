import streamlit as st
import requests


st.title(
    "ResearchMind AI"
)

query = st.text_input(
    "Search Research Topic"
)

if st.button("Search"):

    response = requests.get(
        "http://127.0.0.1:8000/search",
        params={
            "query": query
        }
    )

    results = response.json()

    papers = results.get(
        "results",
        []
    )

    if not papers:

        st.warning(
            "No papers found"
        )

    else:

        for paper in papers:

            st.subheader(
                paper["title"]
            )

            st.write(
                paper["abstract"]
            )

            st.divider()
uploaded_file = st.file_uploader(
    "Upload Research Paper",
    type=["pdf"]
)
if uploaded_file:

    files = {
        "file": uploaded_file
    }
    
    response = requests.post(
        "http://127.0.0.1:8000/upload",
        files=files
    )

    st.success("Uploaded")
    upload_result = response.json()

    path = upload_result[
        "file_path"
    ]
    with st.spinner(
    "Analyzing paper..."
):

        analysis_response = requests.post(
        "http://127.0.0.1:8000/analyze",
        json={
            "file_path": path
        }
    )

        if analysis_response.status_code == 200:

            analysis = analysis_response.json()

            st.markdown(
                analysis["analysis"]
            )

        else:

            st.error(
                analysis_response.text
            )
            
st.header(
    "Semantic Search"
)

semantic_query = st.text_input(
    "Ask ResearchMind"
)
if st.button(
    "Semantic Search"
):

    response = requests.get(
        "http://127.0.0.1:8000/semantic-search",
        params={
            "query": semantic_query
        }
    )

    results = response.json()


    if "documents" in results:


        documents = results["documents"][0]

        for doc in documents:

            st.markdown(doc)

            st.divider()

    else:

        st.error(
            "No documents returned"
        )

st.header(
    "Knowledge Graph"
)

topic = st.text_input(
    "Research Topic"
)

if st.button(
    "Explore Graph"
):

    response = requests.get(

        "http://127.0.0.1:8000/graph",

        params={
            "topic": topic
        }
    )

    st.write(
        response.json()
    )

st.header(
    "Knowledge Graph Visualization"
)

if st.button(
    "Visualize Graph"
):

    response = requests.get(

        "http://127.0.0.1:8000/graph-data"
    )

    relationships = (
        response.json()
    )