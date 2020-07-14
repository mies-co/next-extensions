// Export StyledDocument directly, or uncomment what's below
export { StyledDocument as default } from "@mies-co/next-styled-components";

// Only uncomment below if you need to override the default Document that
// @mies-co/next-styled-components provides
//
// import Document, { Html, Head, Main, NextScript } from "next/document";
// import { withStyledDocument } from "@mies-co/next-styled-components";
//
// class MyDocument extends Document {
//   static async getInitialProps(ctx) {
//     const initialProps = await Document.getInitialProps(ctx);
//     return { ...initialProps };
//   }

//   render() {
//     return (
//       <Html>
//         <Head />
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }
//
// export default withStyledDocument(MyDocument);
