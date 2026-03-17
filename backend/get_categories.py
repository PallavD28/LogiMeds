import httpx, os, asyncio
from dotenv import load_dotenv
load_dotenv()

async def get_categories():
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://public-api.easyship.com/2024-09/item_categories",
            headers={"Authorization": f"Bearer {os.getenv('EASYSHIP_API_TOKEN')}"},
        )
        print(res.json())

asyncio.run(get_categories())