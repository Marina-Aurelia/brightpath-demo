$env:CARGO_HOME = 'D:\Codex\toolchains\rust\cargo'
$env:RUSTUP_HOME = 'D:\Codex\toolchains\rust\rustup'
$env:Path = "D:\Codex\toolchains\rust\cargo\bin;$env:Path"

cargo +stable-x86_64-pc-windows-gnu run

