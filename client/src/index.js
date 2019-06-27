import React, {Fragment} from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider, useQuery } from 'react-apollo-hooks';
import ApolloClient, {gql} from 'apollo-boost'
import './styles.scss';
import 'antd/dist/antd.css';
import AppContainer from './components/AppContainer';

import {Icon} from 'antd';

const client = new ApolloClient({ uri: 'http://localhost:4000' })

const App = (props) => {
	/* {({ data, loading, error, refetch, networkStatus }) => { */
	const { data, error, loading, refetch } = useQuery(ALL_MENU_ITEMS, {notifyOnNetworkStatusChange: true});

	if (loading) {
		return (
			<div className='loading'>
				<Icon type='loading' style={{fontSize: 50, color: 'black'}}/>
			</div>
		)
	}

	if (error) {
		console.log(error);
	return (
		<div>
		<div>Error</div>
		</div>
	)
	}

	return (
		<AppContainer data={data} refetch={refetch}/>
	)
}

const ALL_MENU_ITEMS = gql`
{
	allMenuItems {
		id
		imageURL
		name
		price
	}
}
`

ReactDOM.render(
	<ApolloProvider client={client}>
		<App/>
	</ApolloProvider>,
	document.getElementById('root'),
)