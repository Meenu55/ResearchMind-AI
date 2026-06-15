
def collect_insights(
    papers
):

    insights = []

    for paper in papers:

        insights.append({

            "title":
            paper["title"],

            "abstract":
            paper["abstract"]

        })

    return insights