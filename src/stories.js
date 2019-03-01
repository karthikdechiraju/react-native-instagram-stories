import React, {Component} from 'react';
import {StyleSheet, View , Animated, Dimensions, Platform, StatusBar, Text} from 'react-native';
import stories from './data'
import Story from './components/story'

const { width } = Dimensions.get('window')
const perspective = width;
const angle = Math.atan(perspective / (width / 2));
const ratio = Platform.OS === 'ios' ? 2 : 1.13;

export default class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			x : new Animated.Value(0)
		}
		this.stories = stories.map(() => React.createRef());
		this._scroll;
	}


	componentDidMount() {
		const { x } = this.state;
		x.addListener(() => this.stories.forEach((story, index) => {
			const offset = index * width;
			const inputRange = [offset - width, offset + width];
			const translateX = x.interpolate({
				inputRange,
				outputRange: [width / ratio, -width / ratio],
				extrapolate: 'clamp',
			}).__getValue();

			const rotateY = x.interpolate({
				inputRange,
				outputRange: [`${angle}rad`, `-${angle}rad`],
				extrapolate: 'clamp',
			}).__getValue();


			const parsed = parseFloat(rotateY.substr(0, rotateY.indexOf('rad')), 10);
			const alpha = Math.abs(parsed);
			const gamma = angle - alpha;
			const beta = Math.PI - alpha - gamma;
			const w = width / 2 - ((width / 2) * Math.sin(gamma) / Math.sin(beta));
			const translateX2 = parsed > 0 ? w : -w;

			const style = {
				transform: [{
						perspective
					},
					{
						translateX
					},
					{
						rotateY
					},
					{
						translateX: translateX2
					},
				],
			};
			story.current.setNativeProps({
				style
			});
		}));
	}


	render() {
		const { x } = this.state;
		return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#000" />
			{stories.map((story,index) => (
				<Animated.View ref={this.stories[index]} key={story.id} style={StyleSheet.absoluteFill}>
					<Story story={story} />
				</Animated.View>
			)).reverse()}
			<Animated.ScrollView 
				ref={(ref) => this._scroll = ref}
				style={StyleSheet.absoluteFillObject}
				contentContainerStyle={{width:width * stories.length}}
				showsHorizontalScrollIndicator={false}
				horizontal
				scrollEventThrottle={16}
				snapToAlignment="fast"
				snapToInterval={width}
				decelerationRate="fast"
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: { x },
							},
						},
					],
					{ useNativeDriver: true },
				)}
			/>
		</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});
