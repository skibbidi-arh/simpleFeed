from fastapi import FastAPI , HTTPException

from app.schemas import PostCreate

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
async def get_all_posts(limit: int = None):
    if limit :
        return list(text_posts.values())[:limit]
    return list(text_posts.values())




@app.get("/posts/{id}")
async def get_post(id: int):
    post = text_posts.get(id)
    if post:
        return post
    else:
        raise HTTPException(status_code=404, detail="Post not found")
    
    
@app.post("/posts")
def create_post(post: PostCreate):
    new_id = max(text_posts.keys()) + 1
    text_posts[new_id] = {"title": post.title, "content": post.content}
    return {"id": new_id, "title": post.title, "content": post.content}

@app.delete("/posts/{id}")
async def delete_post(id: int):
    # Check if the post exists and remove it
    if id in text_posts:
        deleted_post = text_posts.pop(id)
        return {"message": f"Post with id {id} was successfully deleted", "deleted_post": deleted_post}
    else:
        raise HTTPException(status_code=404, detail="Post not found")