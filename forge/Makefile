# Default deployment target
.PHONY: deploy-all deploy-counter

# Network configuration
RPC_URL = http://18.222.111.101:8545
SENDER = 0x38421c898cfC5883ddCEC1247EA3f7Ff087Dd6ca
PRIVATE_KEY = e444a661e2860b70afce0f6f065526889d6312dec69531968eb6dada85daf40d

deploy-all: deploy-counter

deploy-counter:
	@echo "Deploying Counter..."
	forge script ./script/Counter.s.sol:CounterScript -vvv \
		--fork-url $(RPC_URL) \
		--broadcast \
		--sender $(SENDER) \
		--private-keys $(PRIVATE_KEY) \
	@echo "Counter deployment complete!"
	@echo "Writing ABI to ./abi/Counter.json"
	forge inspect ./src/Counter.sol:Counter --json > ./abi/Counter.json