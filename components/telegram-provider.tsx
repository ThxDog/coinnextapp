"use client";

import { type PropsWithChildren, useEffect, useMemo } from "react";
import {
  SDKProvider,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorPage } from "@/components/ErrorPage";

import { useDidMount } from "@/hooks/useDidMount";
import { useInitUser } from "@/hooks/useInitUser";
import { getWebApp } from "@/lib/getWebApp";
import { TonClientProvider } from "@/context/ton-client-context";
import { useTelegramMock } from "@/hooks/useTelegramMock";

function App(props: PropsWithChildren) {
  useInitUser();

  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    miniApp.setHeaderColor("#111111");
    miniApp.setBgColor("#212121");
  }, [miniApp]);

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  return (
    <AppRoot
      appearance="dark"
      platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
    >
      {props.children}
    </AppRoot>
  );
}

function RootInner({ children }: PropsWithChildren) {
  // Mock Telegram environment in development mode if needed.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const manifestUrl = useMemo(() => {
    return new URL("tonconnect-manifest.json", window.location.href).toString();
  }, []);

  const debug = useLaunchParams().startParam === "debug";

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import("eruda").then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/WebAppWalletBot/app_hawk_test",
      }}
    >
      <TonClientProvider>
        <SDKProvider acceptCustomStyles debug={debug}>
          <App>{children}</App>
        </SDKProvider>
      </TonClientProvider>
    </TonConnectUIProvider>
  );
}

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.

  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
