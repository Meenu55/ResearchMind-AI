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

    for paper in results["results"]:

        st.subheader(
            paper["title"]
        )

        st.write(
            paper["abstract"]
        )

        st.divider()