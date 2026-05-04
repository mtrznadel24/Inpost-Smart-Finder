from arq.connections import RedisSettings
from app.lockers.sync_service import fetch_and_save_inpost_data
from app.core.config import settings


async def startup(ctx):
    print("Worker started! Fetching and saving InPost data...")
    await ctx['arq_pool'].enqueue_job('fetch_and_save_inpost_data')


class WorkerSettings:
    redis_settings = RedisSettings(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT
    )

    functions = [fetch_and_save_inpost_data]

    on_startup = startup

    cron_jobs = [
        arq.cron(fetch_and_save_inpost_data, minute=0)
    ]