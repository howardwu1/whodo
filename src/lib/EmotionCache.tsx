'use client';

import * as React from 'react';
import createCache, { Options as CreateCacheOptions } from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';

export function NextAppDirEmotionCacheProvider(props: { options: CreateCacheOptions; children: React.ReactNode }) {
  const options = props.options;

  const [cache] = React.useState(() => {
    const cache = createCache(options);
    (cache as any).compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      if (cache.inserted[name] !== true) {
        styles += cache.inserted[name];
      }
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <>{props.children}</>;
}
