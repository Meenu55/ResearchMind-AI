from backend.services.idea_generator import (
    generate_ideas
)

class InnovationAgent:

    def generate(
        self,
        gaps
    ):

        return generate_ideas(
            gaps
        )