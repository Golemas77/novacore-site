// C:\NovaCoreSite\pages\_app.js
import "../styles/globals.css";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundFX from "../components/BackgroundFX";

export default function App({ Component, pageProps }) {
  return (
    <div className="relative isolate min-h-screen text-white flex flex-col">
      <Head>
        <title>NovaCore – WoW privatus serveris</title>
        <meta
          name="description"
          content="NovaCore – modernus, greitas ir pilnai integruotas World of Warcraft privatus serveris (WotLK), paremtas AzerothCore."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b1220" />
        {/* Preload hero paveikslui */}
        <link rel="preload" as="image" href="/bg-lich.jpg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      {/* ANIMUOTAS LEDINIS FONAS */}
      <BackgroundFX />

      {/* TURINYS virš fono */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </div>
  );
}