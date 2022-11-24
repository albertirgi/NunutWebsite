import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Menu from '@iso/components/uielements/menu';
import siteConfig from '@iso/config/site.config';
import IntlMessages from '@iso/components/utility/intlMessages';

const SubMenu = Menu.SubMenu;

export default function SidebarMenu({
	item,
	submenuStyle,
	submenuColor,
	...rest
}) {
	const router = useRouter();
	const { key, label, leftIcon, children } = item;

	const url = siteConfig.dashboard;
	const handleClick = (event, linkTo) => {
		event.preventDefault();
		router.push(linkTo);
	};

	if (children) {
		return (
			<SubMenu
				key={key}
				title={
					<span className='isoMenuHolder' style={submenuColor}>
						{leftIcon}
						<span className='nav-text'>
							<IntlMessages id={label} />
						</span>
					</span>
				}
				{...rest}
			>
				{children.map(({ key, label, withoutDashboard }) => {
					const linkTo = withoutDashboard ? `/${key}` : `${url}/${key}`;
					return (
						<Menu.Item style={submenuStyle} key={key}>
							<a
								href={linkTo}
								onClick={(even) => handleClick(event, linkTo)}
								className='isoMenuHolder'
								style={submenuColor}
							>
								<IntlMessages id={label} />
							</a>
						</Menu.Item>
					);
				})}
			</SubMenu>
		);
	}
	return (
		<Menu.Item key={key} {...rest}>
			<Link href={`${url}/${key}`}>
				<a className='isoMenuHolder' style={submenuColor}>
					{leftIcon}
					<span className='nav-text'>
						<IntlMessages id={label} />
					</span>
				</a>
			</Link>
		</Menu.Item>
	);
}
