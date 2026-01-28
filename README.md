# Clips Review Prototype

A high-fidelity prototype for testing the social media posting flow in the Riverside mobile app.

## What This Is

This prototype tests Phase 2 of the "Proactive Clips Push for Social Promotion" project - specifically the **Clips Review Experience** with:

1. **Clips Selection Screen** - TikTok-style swipeable carousel of Magic Clips
2. **Caption Editing Screen** - Pre-generated captions with edit capability
3. **Open in Reels Flow** - Simulated handoff to Instagram Reels

## Running Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/`

## Deploying to Vercel

**Live URL**: https://clips-review-prototype.vercel.app

To deploy updates:
```bash
npx vercel --prod
```

## Adding Real Clips

Place video files in `public/clips/`:
- `clip1.mp4`, `clip2.mp4`, etc.
- Optionally add thumbnails: `clip1-thumb.jpg`

Update the clips data in `src/App.tsx` to reference your files.

## Testing Goals

This prototype is designed to test:
- **Usability**: Is the flow intuitive?
- **Clarity**: Do users understand what to do at each step?
- **Value perception**: Do users find the pre-generated captions helpful?

## Key Metrics to Track

- Time to complete the flow
- Where users hesitate or get confused
- Do users edit the caption or use as-is?
- Drop-off points

## Related Docs

- [PRD: Proactive Clips Push](../prd-proactive-clips-push.md)
- [Figma Designs](https://www.figma.com/design/elDb3wqVSUkTrX7V3A2Vi6)
