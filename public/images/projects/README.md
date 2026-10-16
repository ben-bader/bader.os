# Project screenshots

Project records in `data/projects/*.ts` declare screenshots in their `images` array. A screenshot path is public and should begin with `/`.

The preferred storage convention is:

```
public/images/projects/<project-id>/image.png
```

Add the file, then reference it in the matching project record:

```ts
images: [{ src: '/images/projects/<project-id>/image.png', alt: 'Concise description of the visible interface' }]
```

Keep the preview placeholder by setting `images: []` when a verified screenshot is unavailable. Do not create screenshots or use unrelated project imagery as a substitute. Existing files under `public/projects/` remain valid until their references are deliberately migrated.
