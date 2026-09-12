"""make client email nullable and remove unique constraint

Revision ID: 0014_client_email
Revises: 0013_discount_dates
Create Date: 2024-09-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0014_client_email'
down_revision: Union[str, None] = '0013_discount_dates'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Try to drop the unique constraint on email column (may not exist)
    try:
        op.drop_constraint('clientes_email_key', 'clientes', type_='unique')
    except Exception:
        pass
    
    # Make email column nullable
    op.alter_column('clientes', 'email',
                    existing_type=sa.String(150),
                    nullable=True)


def downgrade() -> None:
    # Make email column non-nullable
    op.alter_column('clientes', 'email',
                    existing_type=sa.String(150),
                    nullable=False)
    
    # Add unique constraint back
    op.create_unique_constraint('uq_clientes_email', 'clientes', ['email'])
