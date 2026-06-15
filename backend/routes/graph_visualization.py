from fastapi import APIRouter

router = APIRouter()


@router.get(
    "/graph-data"
)

def graph_data():

    return [

        {
            "source":
            "Transformer",

            "target":
            "Attention"
        },

        {
            "source":
            "Transformer",

            "target":
            "BERT"
        }
    ]