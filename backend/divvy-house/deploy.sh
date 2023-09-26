cargo build-bpf && solana program deploy -u https://api.devnet.solana.com --upgrade-authority ./divvy.json target/deploy/divvyhouse.so
