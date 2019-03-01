import React from 'react';
import { Image, StyleSheet, SafeAreaView } from 'react-native'


class Story extends React.Component{
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <Image source={this.props.story.source} style={{...StyleSheet.absoluteFillObject,width:null,height:null}} />
            </SafeAreaView>
        )
    }
}

export default Story;