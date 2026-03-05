
# Full WASM vs JS Benchmark Suite

## Requirements
- Node.js 18+
- Rust installed
- wasm-pack installed

Install wasm-pack if needed:
    cargo install wasm-pack

---

## Setup

1. Install Node dependencies:
    npm install

2. Install Playwright browsers:
    npx playwright install

3. Build WASM module:
    npm run build:wasm

---

## Run Benchmarks

Chromium:
    npm run start:chromium

Firefox:
    npm run start:firefox

WebKit (Safari engine):
    npm run start:webkit

---

## Output

CSV file generated:
    results_<browser>.csv

Includes:
- Browser
- Benchmark
- Mean
- Median
- Std Dev
- Min
- Max

---

Benchmarks Included:
- JS & WASM Fibonacci(35)
- JS & WASM Sum(200k)
- JS & WASM Sort(50k)
- WASM SHA256(1MB)
- WebCrypto SHA256(1MB)
- JS→WASM interop 100k calls
- Array transfer scaling (1KB, 100KB, 1MB)

Configured for:
- 20 warmups
- 200 measured runs
