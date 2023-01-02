import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains([mainnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            retry: 1,
            staleTime: 1000 * 5,
        },
    },
});

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <RecoilRoot>
                <QueryClientProvider client={queryClient}>
                    <WagmiConfig client={wagmiClient}>
                        <RainbowKitProvider chains={chains}>
                            <Component {...pageProps} />
                        </RainbowKitProvider>
                    </WagmiConfig>
                </QueryClientProvider>
            </RecoilRoot>
        </>
    );
}

export default App;
