# Next.js Planning Poker Project

This project is a real-time Planning Poker estimation tool built with [Next.js](https://nextjs.org) and WebSockets. It was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or newer recommended)
- **npm**, **yarn**, **pnpm**, or **bun** installed

---

## Installation & Setup

### Install Dependencies

To install the necessary project dependencies, run one of the following commands in your terminal:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Running the Application

You need to run both the Next.js development server and the WebSocket server for the application to function correctly.

1. Run the Next.js Development Server

   Start the Next.js frontend by running:

```bash
npm run dev
```

2. Run the WebSocket Server

Navigate into the websocket-server directory, install its dependencies, and then start the server:

```bash
cd websocket-server
npm install
npm run dev
```

Once both servers are running, open your web browser and go to:

```
http://localhost:3000
```

---

## How to Use

Visit the Application: Navigate to http://localhost:3000.

Create or Join a Room: Enter a name and a room ID to either join an existing room or create a new one.

Example URL: http://localhost:3000/room/my-room?name=Alice

Invite Teammates: Share the room ID with your teammates. They can add use it to join the existing room.

Cast Votes: Click on a card to cast your vote. You have the flexibility to change your vote at any time until the results are revealed.

Reveal & Reset: The room creator has the ability to reveal votes once all participants have cast theirs. To start a new estimation round, use the "Clear votes" button.

## Project Highlights

✅ Real-time vote synchronization via WebSocket

🎴 Cards are hidden until all users have voted

✨ Automatic reveal when all votes are in

🎉 Emoji reactions on reveal

🌙 Dark mode with smooth transitions

📱 Mobile-responsive layout

🌀 Animations powered by Tailwind CSS
