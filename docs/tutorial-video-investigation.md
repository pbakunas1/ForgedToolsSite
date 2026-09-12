# Return Here tutorial sizing investigation — 2026-09-12

## Verified delivery state

- The tutorial is at `/return-here/` and loads `/return-here.css`, not `styles.css`.
- GitHub main was `3bf34b773332642845ff7e943b280f46ebd9a42a`.
  Its [Cloudflare Pages check](https://github.com/pbakunas1/ForgedToolsSite/runs/103625401567)
  completed successfully at 21:38:13 UTC, with deployment
  `23a0d9a9-69e2-4368-b98d-dee4450306c9`.
- At 21:46–21:48 UTC the repository CSS, custom-domain CSS, Pages production
  alias, [immutable deployment](https://23a0d9a9.forgedtoolssite.pages.dev/return-here.css),
  fresh query URL, and no-cache request all had SHA-256
  `444640477d3e84ede24df9289857ee9836fb93c0e41d617e5a18480917e279e7`.
- The CSS sets `.demo-media video` to `width: min(100%, 280px)` and to
  `min(100%, 240px)` at viewport widths of 640px or less. Its aspect ratio is
  1080 / 2348: the intended desktop player is approximately 609px tall.
- Live HTML has the repository's video markup (`controls playsinline
  preload="metadata"`). The observed HTML differences are Cloudflare's contact
  email obfuscation and its injected decoder, not tutorial markup.
- Custom-domain CSS returns `Cache-Control: public, max-age=14400,
  must-revalidate`; the Pages alias returns `max-age=0, must-revalidate`.
  A conditional request with the current ETag returned 304. A fresh query
  returned MISS and the same current CSS. No current edge/deployment mismatch
  was found. An existing browser can still reuse an older response while fresh;
  `must-revalidate` does not require revalidation during its freshness lifetime.
- Cloudflare dashboard cache rules and the affected Safari cache contents were
  not accessible. The source of the custom-domain TTL has not been confirmed.

## Safari presentation versus page layout

[Apple documents Video Viewer](https://support.apple.com/en-gb/guide/safari/ibrwf2f09b3a/mac)
as a mode that fills the current window with video and hides the page. Exit with
Esc or Page menu → Exit Video Viewer. A “Video Viewer Available” indicator means
the feature is available; it does not establish that Viewer is active.

The existing `playsinline` attribute enables inline playback on iPhone
([WebKit documentation](https://webkit.org/blog/6784/new-video-policies-for-ios/)).
It is not a guarantee that a user cannot enter a native viewing mode. Shrinking
the CSS, adding a poster, or changing native controls is not justified without
reproducing an inline layout fault.

Direct Safari inspection was blocked by the computer-control error
`Sky Computer Use native pipe startup failed`, including after reconnecting.
Safari Video Viewer therefore remains a hypothesis, not a verified root cause.
Browser rendering and playback verification remain required before merging.

## Minimal proposed mitigation

Version the stylesheet link with the CSS revision (`?v=3bf34b7`) so newly loaded
HTML requests the current CSS rather than a previously cached unversioned URL.
Update that version when CSS changes. This mitigates stale stylesheet reuse;
it does not disable or resize native Video Viewer. No CSS size, controls, media,
Cloudflare settings, or production deployment is changed by this branch.

## Review procedure

1. Serve the repository root locally and open `/return-here/` in Safari and
   Firefox at 100% zoom. Inspect the tutorial before and during playback.
2. At desktop width confirm the inline video width is 280 CSS pixels; at 640px
   or narrower confirm it is at most 240px and fits its container. The portrait
   height is expected to exceed the width.
3. In Safari distinguish the normal page from Video Viewer, fullscreen, and
   Picture in Picture. Enter Viewer deliberately, then exit with Esc; confirm
   the inline layout returns. Do not treat “Available” as evidence of activation.
4. If the normal Safari page is oversized, inspect its loaded stylesheet URL,
   response content and computed width. Compare a fresh tab on the immutable
   Pages preview with the existing custom-domain tab before clearing any cache.
5. Verify playback, keyboard controls, store links, homepage, Privacy and Support
   on the Cloudflare branch preview. Record Safari/Firefox versions and results.
6. Merge only after the Safari cause and review results are confirmed. A green
   deployment check establishes delivery, not correctness of native playback.
