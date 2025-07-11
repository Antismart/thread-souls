# Thread Souls

Thread Souls is a decentralized application (dApp) that enables users to mint, manage, and interact with unique digital collectibles (ThreadSouls) on the blockchain. The project leverages smart contracts, NFT standards, and modern web technologies to provide a seamless and engaging user experience.

## Features
- Mint and customize ThreadSouls NFTs
- On-chain notifications and webhook integrations
- Integration with Zora and Pinata for NFT storage and management
- Modern, responsive UI built with Next.js and Tailwind CSS
- Real-time updates and notifications using Redis

## Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Smart Contracts:** Solidity (Zora, CoinFactory, CoinV4)
- **Backend:** Node.js (API routes), Redis
- **Storage:** Pinata (IPFS)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
cd thread-souls-frontend
npm install
# or
yarn install
```

### Running the App
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:3000`.

## Folder Structure

- `app/` - Main Next.js app directory
- `components/` - Reusable React components
- `hooks/` - Custom React hooks
- `utils/` - Utility functions (e.g., Pinata integration)
- `lib/` - Backend libraries (notifications, Redis)
- `pages/api/` - API routes (e.g., Pinata upload)
- `abi/` - Smart contract ABIs
- `public/` - Static assets

## How It Works
1. Users connect their wallet and mint a ThreadSoul NFT.
2. Metadata is uploaded to IPFS via Pinata.
3. Smart contracts handle minting and ownership.
4. Notifications are sent via the integrated notification system.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
