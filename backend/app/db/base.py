# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.resume import Resume  # noqa
from app.models.analysis import Analysis  # noqa
from app.models.market_skill import MarketSkill  # noqa
