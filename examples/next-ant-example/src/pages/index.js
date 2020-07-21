import { Row, Col, Button, Typography } from "antd";

const { Title, Text } = Typography;

export default () => (
	<Row align="middle" justify="center" style={{ height: "100vh", flexDirection: "column" }}>
		<Title>Next-Ant</Title>
		<Text style={{ color: theme.primaryColorDark }}>A theme object is globally available. The scss variables are inside it, in camelCase.</Text>
		<Text>If the button is pink, it means it's working.</Text>
		<br />
		<Button type="primary">Hello</Button>
	</Row>
);
