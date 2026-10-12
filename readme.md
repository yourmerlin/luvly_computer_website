# welcome to my website <3

made with love and care <3

i think messy code bases can be very beautiful. i want my website to feel like my room---imperfect, messy and disorganized.

## running it

the site is react now (vite + react router)

```
npm install      # first time only
npm run dev      # opens a local version that updates as you save
npm run build    # makes the final site in dist/
```

- pages live in `src/pages/`, shared bits (nav, footer, cursor, dither bg) in `src/components/`
- projects on the work page are in `src/data/work.json`, images go in `public/work_imgs/`
- anything in `public/` (images, pdfs) is served as-is
- pushing to main deploys to netlify automatically (settings in `netlify.toml`)
