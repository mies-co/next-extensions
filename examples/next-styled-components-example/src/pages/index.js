import styled from "styled-components";

const Row = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	height: 100vh;
	justify-content: center;
`;

const Button = styled.button`
	background-color: ${props => props.theme.colors.primary};
	border-width: 0;
	color: white;
	cursor: pointer;
	border-radius: 5px;
	padding: 10px 20px;
`;

export default () => (
	<Row>
		<h1>Next-Styled-Components</h1>
		<p>Easily use styled-components in nextjs.</p>
		<br />
		<Button type="primary">I'm green</Button>
	</Row>
);
