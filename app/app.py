from fastapi import FastAPI , HTTPException

app = FastAPI()
text_posts = {1: {"title": "First Post", "content": "This is the first post."},
              2: {"title": "Second Post", "content": "This is the second post."},
              3: {"title": "Third Post", "content": "This is the third post."},
              4: {"title": "Fourth Post", "content": "This is the fourth post."},
              5: {"title": "Fifth Post", "content": "This is the fifth post."},
              6: {"title": "Sixth Post", "content": "This is the sixth post."},
              7: {"title": "Seventh Post", "content": "This is the seventh post."},
              
              }


@app.get("/posts")
async def get_all_posts():
    return text_posts




@app.get("/posts/{id}")
async def get_post(id: int):
    post = text_posts.get(id)
    if post:
        return post
    else:
        raise HTTPException(status_code=404, detail="Post not found")