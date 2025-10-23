# Default deployment target
.PHONY: deploy-all deploy-counter

# Network configuration
RPC_URL = http://18.222.111.101:8545
SENDER = 0x2557794Bf452ec0a9cB923B03b2D2fb550E17357
PRIVATE_KEY = d27798744baaa809fb04fa587023a3f80dfae7a9f6a2978d1fad89571d84d478

deploy-all: deploy-counter

deploy-counter:
	@echo "Deploying Counter..."
	forge script ./script/Counter.s.sol:CounterScript -vvv \
		--fork-url $(RPC_URL) \
		--broadcast \
		--sender $(SENDER) \
		--private-keys $(PRIVATE_KEY) \
		| tee ./logs/counter_deployment.log
	@echo "Counter deployment complete!"