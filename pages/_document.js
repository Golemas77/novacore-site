import Document, { Html, Head, Main, NextScript } from 'next/document';
import { site } from '../lib/site';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="lt">
        <Head>
          {/* Pagrindiniai meta */}
          <meta name="description" content={site.description} />
          <meta name="theme-color" content="#0b1220" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={site.name} />
          <meta property="og:title" content={site.defaultTitle} />
          <meta property="og:description" content={site.description} />
          <meta property="og:image" content={site.ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="NovaCore – lietuviškas WoW serveris" />
          <meta property="og:locale" content="lt_LT" />

          {/* Twitter (jei reikės) */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={site.ogImage} />
          {site.twitter && <meta name="twitter:site" content={site.twitter} />}

          {/* Favicon’ai */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          {/* Prefetch šriftams (jei naudoji) */}
          {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;