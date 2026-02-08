# 🚀 Missile Command - Base Mini App

Classic arcade defense game rebuilt for Base Network and Farcaster as a mobile-first Mini App.

## 🎮 Game Features

- **Classic Gameplay**: Defend 6 cities from endless missile attacks
- **Enemy Types**: ICBMs, MIRVs (splitting missiles), Bombers, Satellites, Smart Bombs
- **Mobile-First**: Intuitive swipe controls optimized for touch
- **Neon Aesthetic**: Retro arcade visuals with modern effects
- **60 FPS Canvas**: Smooth HTML5 Canvas rendering
- **Progressive Difficulty**: Waves get harder as you survive longer
- **Chain Reactions**: Strategic explosion timing for combo destruction
- **High Score System**: Compete with yourself and share scores

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom Canvas Rendering
- **Web3**: Base Network (EIP-155:8453)
- **Mini App**: Farcaster integration ready
- **Audio**: Web Audio API for sound effects
- **Haptics**: Vibration feedback on mobile

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 📱 Deployment

1. Deploy to Vercel
2. Set environment variable: `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
3. Generate Farcaster manifest at [Base Build](https://base.dev/preview?tab=account)
4. Update `public/.well-known/farcaster.json` with accountAssociation
5. Test with [Base Preview Tool](https://base.dev/preview)

## 🎯 Game Controls

- **Mobile**: Tap or swipe where you want to fire
- **Desktop**: Click to fire missiles
- The closest battery with ammo will launch

## 🏆 Scoring

- ICBM: 25 points
- MIRV: 50 points
- Bomber: 100 points
- Satellite: 100 points
- Smart Bomb: 125 points
- Bonus City: Every 10,000 points

## 📝 License

Original concept by Atari (1980). This remake is for educational purposes.

## 🔗 Links

- [Base Network](https://base.org)
- [Farcaster](https://farcaster.xyz)
- [Base Mini Apps Docs](https://docs.base.org/mini-apps)

---

Built with 💚 for the Base ecosystem
