import logging

import arq
from arq.connections import RedisSettings
from app.lockers.sync_service import fetch_and_save_inpost_data
from app.core.config import settings

logger = logging.getLogger(__name__)

async def startup(ctx):
    logger.info("Worker started! Fetching and saving InPost data...")

    redis = await arq.create_pool(WorkerSettings.redis_settings)

    await redis.enqueue_job('fetch_and_save_inpost_data')

    await redis.close()


class WorkerSettings:
    redis_settings = RedisSettings(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT
    )

    functions = [fetch_and_save_inpost_data]

    job_timeout = 3600

    on_startup = startup

    cron_jobs = [
        arq.cron(fetch_and_save_inpost_data, minute=0)
    ]