import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

# -----------------------
# Load data
# -----------------------

chromium = pd.read_csv("results_chromium.csv")
firefox = pd.read_csv("results_firefox.csv")
webkit = pd.read_csv("results_webkit.csv")

data = pd.concat([chromium, firefox, webkit], ignore_index=True)

# Create output directory
os.makedirs("figures", exist_ok=True)

sns.set(style="whitegrid", context="paper")

# -----------------------
# CPU BENCHMARKS
# -----------------------

cpu_order = [
"JS_Fib_35",
"WASM_Fib_35",
"JS_Sum_200k",
"WASM_ArraySum_200k",
"JS_Sort_50k",
"WASM_Sort_50k"
]

cpu = data[data["Benchmark"].isin(cpu_order)]

plt.figure(figsize=(10,6))

sns.barplot(
    data=cpu,
    x="Benchmark",
    y="Mean (ms)",
    hue="Browser",
    order=cpu_order
)

plt.yscale("log")  # IMPORTANT

plt.title("CPU Benchmark Performance: JavaScript vs WebAssembly")
plt.ylabel("Mean Execution Time (ms) [log scale]")
plt.xlabel("Benchmark")

plt.xticks(rotation=35)

plt.tight_layout()
plt.savefig("figures/cpu_benchmarks.png", dpi=300)
plt.close()

# -----------------------
# CRYPTOGRAPHY
# -----------------------

crypto = data[data["Benchmark"].isin([
"WASM_SHA256_1MB",
"WebCrypto_SHA256_1MB"
])]

plt.figure(figsize=(8,6))

sns.barplot(
    data=crypto,
    x="Benchmark",
    y="Mean (ms)",
    hue="Browser"
)

plt.title("SHA-256 Hash Performance: WASM vs WebCrypto")
plt.ylabel("Mean Execution Time (ms)")
plt.xlabel("Implementation")

plt.tight_layout()
plt.savefig("figures/crypto_benchmarks.png", dpi=300)
plt.close()

# -----------------------
# INTEROP COST
# -----------------------

interop = data[data["Benchmark"] == "Interop_JS_to_WASM_100k"]

plt.figure(figsize=(6,5))

sns.barplot(
    data=interop,
    x="Browser",
    y="Mean (ms)"
)

plt.title("JavaScript → WebAssembly Interoperability Cost")
plt.ylabel("Mean Execution Time (ms)")
plt.xlabel("Browser")

plt.tight_layout()
plt.savefig("figures/interop_cost.png", dpi=300)
plt.close()

# -----------------------
# ARRAY SUM SCALING
# -----------------------

arraysum_order = [
"JS_ArraySum_1KB",
"JS_ArraySum_100KB",
"JS_ArraySum_1MB"
]

arraysum = data[data["Benchmark"].isin(arraysum_order)]

plt.figure(figsize=(9,6))

sns.lineplot(
    data=arraysum,
    x="Benchmark",
    y="Mean (ms)",
    hue="Browser",
    marker="o"
)

plt.title("JavaScript Array Processing Performance Scaling")
plt.ylabel("Mean Execution Time (ms)")
plt.xlabel("Array Size")

plt.tight_layout()
plt.savefig("figures/arraysum_scaling.png", dpi=300)
plt.close()

# -----------------------
# WASM TRANSFER COST
# -----------------------

transfer_order = [
"WASM_ArrayTransfer_1KB",
"WASM_ArrayTransfer_100KB",
"WASM_ArrayTransfer_1MB"
]

transfer = data[data["Benchmark"].isin(transfer_order)]

plt.figure(figsize=(9,6))

sns.lineplot(
    data=transfer,
    x="Benchmark",
    y="Mean (ms)",
    hue="Browser",
    marker="o"
)

plt.title("WebAssembly Memory Transfer Cost Scaling")
plt.ylabel("Mean Execution Time (ms)")
plt.xlabel("Data Size")

plt.tight_layout()
plt.savefig("figures/wasm_transfer_scaling.png", dpi=300)
plt.close()

print("\nAll graphs generated successfully in /figures\n")