import { defineChain } from "viem"; 

export const hoodi = defineChain({
    id: 560048, 
    name: "Hoodi", 
    nativeCurrency: {
        name: "ETH", 
        symbol: "ETH", 
        decimals: 18, 
    }, 
    rpcUrls: {
        default: {
            http: ["https://rpc.hoodi.xyz"]
        },
    },
});