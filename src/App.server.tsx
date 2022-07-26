import {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  FileRoutes,
  type HydrogenRouteProps,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  Route,
  Router,
  ShopifyAnalytics,
  ShopifyProvider,
  CartProvider,
} from '@shopify/hydrogen';

import {HeaderFallback} from '~/components';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {DefaultSeo, NotFound} from '~/components/index.server';

import {OkendoProvider} from '@okendo/shopify-hydrogen';

function App({request}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  return (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
      <ShopifyProvider countryCode={countryCode}>
        <OkendoProvider subscriberId="3134cd22-5f66-47a7-b511-7d1a8a171f6a" />
        <CartProvider countryCode={countryCode}>
          <Suspense>
            <DefaultSeo />
          </Suspense>
          <Router>
            <FileRoutes
              basePath={countryCode ? `/${countryCode}/` : undefined}
            />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
        <ShopifyAnalytics />
      </ShopifyProvider>
    </Suspense>
  );``
}

export default renderHydrogen(App);
