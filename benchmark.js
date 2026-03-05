function jsFib(n) {
  if (n <= 1) return n;
  return jsFib(n - 1) + jsFib(n - 2);
}

function calculateStats(results) {
  const sorted = [...results].sort((a, b) => a - b);
  const mean = results.reduce((a, b) => a + b, 0) / results.length;
  const median = sorted[Math.floor(results.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const variance =
    results.reduce((a, b) => a + (b - mean) ** 2, 0) / results.length;
  const std = Math.sqrt(variance);
  return { mean, median, std, min, max };
}

async function runTest(name, fn) {
  const warmups = 20;
  const runs = 200;
  const results = [];

  for (let i = 0; i < warmups; i++) await fn();

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    results.push(end - start);
  }

  return { name, ...calculateStats(results) };
}

function generateArray(size) {
  return Array.from({ length: size }, (_, i) => size - i);
}

function generateByteArray(bytes) {
  const length = bytes / 4;
  return Array.from({ length }, (_, i) => i);
}

async function runAllBenchmarks() {
  const results = [];

  const arr50k = generateArray(50000);
  const arr200k = generateArray(200000);
  const encoder = new TextEncoder();
  const data1MB = encoder.encode("a".repeat(1024 * 1024));

  // Fibonacci
  results.push(await runTest("JS_Fib_35", () => jsFib(35)));
  results.push(await runTest("WASM_Fib_35", () => wasm.wasm_fib(35)));

  // Sum
  results.push(
    await runTest("JS_Sum_200k", () => arr200k.reduce((a, b) => a + b, 0)),
  );
  results.push(
    await runTest("WASM_ArraySum_200k", () => wasm.wasm_array_sum(arr200k)),
  );

  // Sort
  results.push(
    await runTest("JS_Sort_50k", () => [...arr50k].sort((a, b) => a - b)),
  );
  results.push(await runTest("WASM_Sort_50k", () => wasm.wasm_sort(arr50k)));

  // SHA256
  results.push(
    await runTest("WASM_SHA256_1MB", () => wasm.wasm_sha256(data1MB)),
  );
  results.push(
    await runTest("WebCrypto_SHA256_1MB", async () => {
      await crypto.subtle.digest("SHA-256", data1MB);
    }),
  );

  // Interop test
  results.push(
    await runTest("Interop_JS_to_WASM_100k", () => {
      for (let i = 0; i < 100000; i++) wasm.wasm_add(1, 2);
    }),
  );

  // Array scaling tests
  const sizes = [
    { label: "1KB", bytes: 1024 },
    { label: "100KB", bytes: 1024 * 100 },
    { label: "1MB", bytes: 1024 * 1024 },
  ];

  for (const size of sizes) {
    const arr = generateByteArray(size.bytes);
    results.push(
      await runTest(`JS_ArraySum_${size.label}`, () =>
        arr.reduce((a, b) => a + b, 0),
      ),
    );
    results.push(
      await runTest(`WASM_ArrayTransfer_${size.label}`, () =>
        wasm.wasm_array_sum(arr),
      ),
    );
  }

  return results;
}

window.runAllBenchmarks = runAllBenchmarks;
