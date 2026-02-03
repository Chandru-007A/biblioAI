# Import AI modules
from app.ai.recommender import RecommendationEngine
from app.ai.nlp_search import SemanticSearch
from app.ai.predictor import DemandPredictor

# Create global instances
recommender = RecommendationEngine()
semantic_search = SemanticSearch()
demand_predictor = DemandPredictor()

# Export
__all__ = [
    "recommender",
    "semantic_search",
    "demand_predictor"
]