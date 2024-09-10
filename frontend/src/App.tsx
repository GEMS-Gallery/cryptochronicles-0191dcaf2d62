import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, CircularProgress, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { backend } from 'declarations/backend';

interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', author: '', body: EditorState.createEmpty() });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const htmlContent = draftToHtml(convertToRaw(newPost.body.getCurrentContent()));
      await backend.createPost(newPost.title, htmlContent, newPost.author);
      setNewPost({ title: '', author: '', body: EditorState.createEmpty() });
      setShowNewPostForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crypto Blog
          </Typography>
          <Button color="inherit" onClick={() => setShowNewPostForm(true)}>
            New Post
          </Button>
        </Toolbar>
      </AppBar>
      <Container className="container">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {showNewPostForm && (
              <div className="post">
                <Typography variant="h4">Create New Post</Typography>
                <input
                  type="text"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                />
                <Editor
                  editorState={newPost.body}
                  onEditorStateChange={(editorState) => setNewPost({ ...newPost, body: editorState })}
                  wrapperClassName="rich-text-editor"
                  editorClassName="rich-text-editor"
                />
                <Button variant="contained" color="primary" onClick={handleCreatePost}>
                  Create Post
                </Button>
              </div>
            )}
            {posts.map((post) => (
              <div key={post.id} className="post">
                <Typography variant="h4">{post.title}</Typography>
                <div className="post-meta">
                  <span>By {post.author}</span> |
                  <span>Posted on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              </div>
            ))}
          </>
        )}
      </Container>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowNewPostForm(true)}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default App;
