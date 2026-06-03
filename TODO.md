# TODO - React Frontend (PHP-like UI)

- [ ] 1) Add React Router to project (routes for: /, /laws, /calculator, /news, /pricing, /certificates, /about, /consult, /track)
- [ ] 2) Copy PHP CSS/JS assets (style.css, main.js, calculator.js) into React public/assets
- [ ] 3) Implement shared layout/header/footer components matching PHP DOM/classes
- [ ] 4) Implement pages/components by porting markup from `panahyar new style/public/*.php`
- [ ] 5) Implement client-side behavior:
  - [ ] flags map modal behavior (reuse main.js or port)
  - [ ] calculator multi-step behavior (reuse calculator.js or port)
- [ ] 6) Connect /consult and /track forms to PHP backend:
  - [ ] Handle CSRF token via session-compatible fetch/GET+extract
  - [ ] Submit multipart/form-data (documents upload)
  - [ ] Render success/errors and tracking messages
- [ ] 7) Run `npm run dev` and verify routes + styling visually
- [ ] 8) Run `npm run build`
- [ ] 9) Commit changes to branch `blackboxai/php-like-frontend-route`

