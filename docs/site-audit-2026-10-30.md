# Site quality audit — 30 October 2026

- 396 generated HTML pages, 36,139 internal references and 334 unique local images checked. No missing routes, broken internal fragments, missing files or invalid SVG/raster files found.
- All 371 curriculum routes retain reading navigation, complete search metadata, and valid progress identifiers.
- Checked 321 unique external reference URLs: 297 succeeded, 6 returned 404, and 18 could not be confirmed because of 403, 429 or 503 responses. These HTTP failures are not proof that the references are permanently unavailable.
- Replaced the six 404 references with verified HTTP 200 primary sources: TI AC/DC controllers; Espressif provisioning documentation; Toshiba TB6612FNG datasheet including required document parameters; Modbus serial guide; Arduino Learn; Bosch BMP280 datasheet.
- Original article text, course order and progress slugs remain unchanged.

## Responsive verification limit

Mobile styles for collapsed progress, narrow reading controls and image-dialog text were reviewed. The available remote browser has no working device viewport or zoom controls. A real mobile/touch test remains unverified; desktop interaction checks cannot establish mobile compatibility.

## Re-running

Run `npm run build`, `node scripts/check-discovery.cjs`, and `python scripts/check-site-links.py` from the repository root. Add `--external` for optional live reference checks; reports go to `/tmp/site-link-audit.json` and `/tmp/site-external-audit.json`. External checks may be rate-limited.
