import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	Text,
	TextInput,
	Button,
	View,
	SafeAreaView,
	Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import styles from './styles';

const HomePage = ({ navigation }) => {
	const [desc, setDesc] = useState('');
	const [amount, setAmount] = useState('');
	const [total, setTotal] = useState(0);
	const [data, setData] = useState([
		{ date: moment().format('LL'), amount: 2000 },
		{ date: moment().subtract(1, 'days').format('LL'), amount: 2500 },
		{ date: moment().subtract(1, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(1, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(1, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(1, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(1, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(3, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(4, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(5, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(3, 'days').format('LL'), amount: 3500 },
		{ date: moment().format('LL'), amount: 3500 },
		{ date: moment().subtract(1, 'days').format('LL'), amount: 3500 },
		{ date: moment().subtract(2, 'days').format('LL'), amount: 4500 },
		{ date: moment().subtract(2, 'days').format('LL'), amount: 5500 },
	]);
	const [transformedData, setTransformedData] = useState([]);
	const [gigs, setGigs] = useState([]);

	const chartConfig = {
		backgroundColor: '#e26a00',
		backgroundGradientFrom: '#fb8c00',
		backgroundGradientTo: '#ffa726',
		decimalPlaces: 2,
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 16,
		},
		propsForDots: {
			r: '6',
			strokeWidth: '2',
			stroke: '#ffa726',
		},
	};

	useEffect(() => {
		setTotal(gigs.reduce((result, next) => (result += Number(next.amount)), 0));
	}, [gigs]);

	useEffect(() => {
		setTransformedData(transformData(Object.entries(groupBy(data, 'date'))));
	}, [data]);

	const getDates = () => transformedData.map((entry) => entry.date);

	const getAmounts = () => transformedData.map((entry) => entry.amount);

	const groupBy = (array, key) => {
		return array.reduce((result, next) => {
			(result[next[key]] = result[next[key]] || []).push(next);
			return result;
		}, {});
	};

	const transformData = (groupedData) => {
		let transformedArray = [];
		groupedData.forEach((pair) => {
			const total = pair[1].reduce(
				(result, next) => (result += next.amount),
				0
			);
			transformedArray.push({
				date: moment(pair[0]).format('MM/DD'),
				amount: total,
			});
		});
		return transformedArray.sort((a, b) => moment(a.date).diff(moment(b.date)));
	};

	const dataPoints = {
		labels: getDates(),
		datasets: [{ data: getAmounts() }],
	};

	const addGig = () => {
		setGigs([...gigs, { desc, amount }]);
		setData([
			...data,
			{
				date: moment().format('LL'),
				amount: Number(amount),
			},
		]);
		setDesc('');
		setAmount('');
	};

	return (
		<SafeAreaView>
			<View>
				<Text style={styles.titleText}>
					Hello World. Welcome to a React Native App.
				</Text>
			</View>
			<Button title="Login" onPress={() => navigation.navigate('Login')} />
			<View>
				<Text>Daily tracker</Text>
				<LineChart
					data={dataPoints}
					width={Dimensions.get('window').width}
					height={220}
					yAxisLabel="$"
					yAxisInterval={1}
					chartConfig={chartConfig}
					bezier
					style={styles.chart}
				/>
			</View>

			<TextInput
				style={styles.input}
				value={desc}
				placeholder="Enter a description"
				onChangeText={(input) => setDesc(input)}
			/>
			<TextInput
				style={styles.input}
				value={amount}
				placeholder="Enter the amount you made in USD ($)"
				keyboardType="numeric"
				onChangeText={(text) => setAmount(text)}
			/>
			<Button disabled={!desc && !amount} onPress={addGig} title="Add Gig" />
			<ScrollView>
				<Text>Total Income: ${total}</Text>
				{gigs.map((gig, idx) => (
					<Text key={idx}>
						{gig.desc}: ${gig.amount}
					</Text>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomePage;
