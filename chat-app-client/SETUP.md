# Setup Instructions

## First Time Setup

### 1. Install Client Dependencies
```bash
cd chat-app-client
npm install
```

### 2. Install Server Dependencies (if not done already)
```bash
cd ../chat-app-server
npm install
```

## Running the Application

### Terminal 1: Start the Server
```bash
cd chat-app-server
npm run dev
```
You should see: `🚀 Server running on port 3001`

### Terminal 2: Start the Client
```bash
cd chat-app-client
npm run dev
```
You should see: `Local: http://localhost:5173/`

### Open in Browser
- Open http://localhost:5173 in your browser
- Open the same URL in a second tab/window to test with multiple users
- Check the browser console (F12) for connection status

## Troubleshooting

**If you see "site can't be reached":**
1. Make sure both servers are running (check both terminals)
2. Make sure dependencies are installed (`npm install` in both folders)
3. Check if ports 3001 and 5173 are already in use
4. Try a different browser or clear browser cache
5. Check browser console (F12) for error messages

**Connection issues:**
- The status indicator (red/green dot) shows connection status
- Check browser console for connection errors
- Make sure server is running before client tries to connect

