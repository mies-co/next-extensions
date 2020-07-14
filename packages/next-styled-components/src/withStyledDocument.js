import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

import hoistNonReactStatics from "hoist-non-react-statics";

const withStyledComponents = (ComposedComponent) => {
  class DocumentWithStyledComponents extends Document {
    static async getInitialProps(ctx) {
      const sheet = new ServerStyleSheet();
      const originalRenderPage = ctx.renderPage;

      try {
        ctx.renderPage = () =>
          originalRenderPage({
            enhanceApp: (App) => (props) =>
              sheet.collectStyles(<App {...props} />),
          });

        const initialProps = (await Document.getInitialProps(ctx)) || {};

        let composedInitialProps = {};
        if ((ComposedComponent || {}).getInitialProps) {
          composedInitialProps = await ComposedComponent.getInitialProps(ctx);
        }

        return {
          ...initialProps,
          styles: (
            <>
              {initialProps.styles}
              {sheet.getStyleElement()}
            </>
          ),
        };
      } finally {
        sheet.seal();
      }
    }

    render() {
      if (ComposedComponent) {
        return <ComposedComponent />;
      }

      // Provides a default DOM when ComposedComponents does exist
      return (
        <Html>
          <Head />
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
  }

  return DocumentWithStyledComponents;
};

export class StyledDocument extends withStyledComponents() {}
export default withStyledComponents;
