# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.resume import Resume  # noqa
from app.models.analysis import Analysis  # noqa
