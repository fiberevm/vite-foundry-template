# Default deployment target
.PHONY: deploy-all deploy-counter

# Forge binaries
FORGE = ~/.foundry/bin/forge
CAST = ~/.foundry/bin/cast

# Network configuration
RPC_URL = https://rpc.fiber.so
SENDER = 0x38421c898cfC5883ddCEC1247EA3f7Ff087Dd6ca
PRIVATE_KEY = e444a661e2860b70afce0f6f065526889d6312dec69531968eb6dada85daf40d

deploy-all: deploy-counter

deploy-counter:
	@echo "Deploying Counter..."
	$(FORGE) script ./script/Counter.s.sol:CounterScript -vvv \
		--fork-url $(RPC_URL) \
		--broadcast \
		--sender $(SENDER) \
		--private-keys $(PRIVATE_KEY) \
	@echo "Counter deployment complete!"
	@echo "Writing ABI to ./abi/Counter.json"
	$(FORGE) inspect ./src/Counter.sol:Counter abi --json > ./abi/Counter.json