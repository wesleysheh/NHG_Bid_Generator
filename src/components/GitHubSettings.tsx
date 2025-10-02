import React, { useState, useEffect } from 'react';
import { githubService } from '../services/githubService';

const GitHubSettings: React.FC = () => {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [isConfigured, setIsConfigured] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const config = githubService.loadConfig();
    if (config) {
      setToken(config.token);
      setOwner(config.owner);
      setRepo(config.repo);
      setBranch(config.branch || 'main');
      setIsConfigured(true);
    }
  }, []);

  const handleSave = async () => {
    if (!token || !owner || !repo) {
      setTestMessage('Please fill in all required fields');
      return;
    }

    githubService.initialize({ token, owner, repo, branch });
    setIsConfigured(true);
    
    const result = await githubService.testConnection();
    setTestMessage(result.message);
  };

  const handleClear = () => {
    githubService.clearConfig();
    setToken('');
    setOwner('');
    setRepo('');
    setBranch('main');
    setIsConfigured(false);
    setTestMessage('Configuration cleared');
  };

  const handleTest = async () => {
    const result = await githubService.testConnection();
    setTestMessage(result.message);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      marginTop: '20px' 
    }}>
      <h3>GitHub Integration Settings</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          GitHub Personal Access Token:
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type={showToken ? 'text' : 'password'}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            style={{ 
              padding: '8px', 
              width: '300px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={() => setShowToken(!showToken)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showToken ? 'Hide' : 'Show'}
          </button>
        </div>
        <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
          Create token at: https://github.com/settings/tokens/new
          <br />
          Required scope: repo (for private repos) or public_repo (for public repos)
        </small>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          GitHub Username/Organization:
        </label>
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="your-username"
          style={{ 
            padding: '8px', 
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Repository Name:
        </label>
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="bid-storage"
          style={{ 
            padding: '8px', 
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Branch (optional):
        </label>
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="main"
          style={{ 
            padding: '8px', 
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Save Configuration
        </button>
        
        {isConfigured && (
          <>
            <button
              onClick={handleTest}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test Connection
            </button>
            
            <button
              onClick={handleClear}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Configuration
            </button>
          </>
        )}
      </div>

      {testMessage && (
        <div style={{
          padding: '10px',
          backgroundColor: testMessage.includes('Connected') ? '#d4edda' : '#f8d7da',
          color: testMessage.includes('Connected') ? '#155724' : '#721c24',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          {testMessage}
        </div>
      )}

      {isConfigured && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          ✓ GitHub integration is configured. Bids will be automatically saved to: {owner}/{repo}
        </div>
      )}
    </div>
  );
};

export default GitHubSettings;