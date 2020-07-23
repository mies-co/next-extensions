import Link from "next/link";

import { useLng } from "./withLng";

const prefixPathWithLng = ({ lng, path = "" }) => {
	if (path.startsWith("/")) path = path.substr(1);
	if (!path.startsWith(lng)) path = `/${lng}/${path}`;
	return path;
};

const CustomLink = (props) => {
	const { lng } = useLng();
	// TODO - enable params, like next-routes, as well as named routes
	let { href, as, ...rest } = props;

	// Then it means href is the as
	if (!as) {
		href = prefixPathWithLng({ lng, path: href });
	} else {
		href = prefixPathWithLng({ lng: "[lng]", path: href });
		as = prefixPathWithLng({ lng, path: as });
	}

	const compatibleProps = { href: { pathname: href }, passHref: true };
	if (as) compatibleProps.as = as;

	return (
		<Link {...compatibleProps} {...rest}>
			{props.children}
		</Link>
	);
};

export default CustomLink;
