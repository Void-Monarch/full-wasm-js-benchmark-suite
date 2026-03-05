
use wasm_bindgen::prelude::*;
use sha2::{Sha256, Digest};

#[wasm_bindgen]
pub fn wasm_fib(n: u32) -> u32 {
    if n <= 1 { return n; }
    wasm_fib(n - 1) + wasm_fib(n - 2)
}

#[wasm_bindgen]
pub fn wasm_array_sum(arr: Vec<u32>) -> u32 {
    arr.iter().sum()
}

#[wasm_bindgen]
pub fn wasm_sort(mut arr: Vec<u32>) -> Vec<u32> {
    arr.sort();
    arr
}

#[wasm_bindgen]
pub fn wasm_sha256(data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hasher.finalize().to_vec()
}

#[wasm_bindgen]
pub fn wasm_add(a: i32, b: i32) -> i32 {
    a + b
}
