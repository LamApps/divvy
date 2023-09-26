import "./App.css";
import "flag-icon-css/css/flag-icon.css"
import {lazy, Suspense, useEffect} from 'react';
import ReactGA from 'react-ga';
import { Switch, Route, useLocation } from "react-router-dom";
import { Provider } from 'react-redux'
import * as PATHS from "./constants/paths";
import { store } from './store'
import { DashboardView } from "./views/DashboardView";
import { FaucetView } from "./views/FaucetView";
import { GamesView } from "./views/Games/GamesView";
import { MoonShot } from "./views/Games/MoonShot/MoonShot";
import {MoonshotSocketContext, socket} from "./contexts/moonshot-socket";
import LandingPageView from "./views/LandingPageView";

const load = (Component: any) => (props: any) => (
  <Suspense fallback={<div></div>}>
    <Component {...props} />
  </Suspense>
)
const ChainProvider = load(lazy(() => import("./contexts/chainselect")));
const BetsView = load(lazy(() => import("./views/BetsView")));
const LiquidityView = load(lazy(() => import("./views/LiquidityView")));
const RootContextProvider = load(lazy(() => import("./contexts")));
const BetsProvider = load(lazy(() => import("./contexts/bets")));
function App() {
  ReactGA.initialize("UA-208887655-2");
  const location = useLocation();
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, [location])
  return (
      <Provider store={store}>
        <ChainProvider>
          <RootContextProvider>
            <BetsProvider>
              {/* Routes are ordered specific to general. the '/' route must be placed last */}
              <Switch>
                <Route path={PATHS.GAMES_VIEW_PATH + PATHS.MOONSHOT_VIEW_PATH}>
                  <MoonshotSocketContext.Provider value={socket}>
                    <MoonShot />
                  </MoonshotSocketContext.Provider>
                </Route>
                <Route path={PATHS.FAUCET_VIEW_PATH}>
                  <FaucetView />
                </Route>
                <Route path={PATHS.DASHBOARD_VIEW_PATH}>
                  <DashboardView />
                </Route>
                <Route path={PATHS.LIQUIDITY_VIEW_PATH}>
                  <LiquidityView />
                </Route>
                <Route path={PATHS.GAMES_VIEW_PATH}>
                  <GamesView />
                </Route>
                <Route path={PATHS.LANDING_VIEW_PATH}>
                  <LandingPageView />
                </Route>
                <Route path={PATHS.BETS_VIEW_PATH}>
                  <BetsView />
                </Route>
              </Switch>
            </BetsProvider>
          </RootContextProvider>
        </ChainProvider>
      </Provider>
  );
}

export default App;
