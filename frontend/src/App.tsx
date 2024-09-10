import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [design, setDesign] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateDesign = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const result = await backend.generateDesign(prompt);
      setDesign(result);
    } catch (error) {
      console.error('Error generating design:', error);
      setDesign('Error generating design. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GEMS Design Generator
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className="container">
        <Alert severity="info" sx={{ mb: 2 }}>
          Note: AI-generated designs are currently unavailable. The app will return a placeholder response.
        </Alert>
        <TextField
          fullWidth
          label="Enter your design prompt"
          variant="outlined"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateDesign}
          disabled={loading || !prompt}
        >
          Generate Design
        </Button>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {design && (
          <div className="design-output">
            <Typography variant="h6">Generated Design:</Typography>
            <Typography>{design}</Typography>
          </div>
        )}
      </Container>
    </div>
  );
};

export default App;
