import '../styles/globals.css';
import { useRouter } from 'next/router';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>Snotlex - خدمات تصميم جرافيك وعروض تقديمية</title>
        <meta name="description" content="Snotlex - شركة متخصصة في تصميم الجرافيك والعروض التقديمية الاحترافية" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
