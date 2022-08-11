import "../styles/globals.css";
import Head from "next/head";
import 'antd/dist/antd.css';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="description" content="Atanu Blog App" />
        <meta name="keywords" content="HTML, CSS, JavaScript" />
        <meta name="author" content="Atanu Jana" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CodingLife</title>

        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>

        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
