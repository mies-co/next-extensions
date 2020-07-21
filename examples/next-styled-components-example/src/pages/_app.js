import App from "next/app";
import { ThemeProvider, createGlobalStyle } from "styled-components";

const theme = {
	colors: {
		primary: "rgb(0, 128, 86)",
	},
};

const GlobalStyle = createGlobalStyle`
    body {
        color: rgba(0, 0, 0, 0.85);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    }
`;

export default class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;
		return (
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<Component {...pageProps} />
			</ThemeProvider>
		);
	}
}
