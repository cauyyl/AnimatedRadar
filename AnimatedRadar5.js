//static radar: https://gist.github.com/brianfoody/49e22e66ffff3709904e5e17981c2a4a#file-svgradarchart-tsx-L15
import React, { useEffect, useMemo, useState } from 'react'
import { Animated, View, } from 'react-native'
import lodash from 'lodash'
import Svg, { Circle, Line, Path, Polygon, Text } from 'react-native-svg'
const AnimatedPath = Animated.createAnimatedComponent(Path)

const TEST_DATA = [
    { name: 'label1', score: 1, },
    { name: 'label2', score: 2, },
    { name: 'label3', score: 3, },
    { name: 'label4', score: 4, },
    { name: '2400
const viewBoxCenter = viewBoxSize * 0.5
const radius = viewBoxSize * 0.4

const svgY = (degrees: number) => degrees + 180

function degToRadians(degrees) {
    const pi = Math.PI
    return degrees * (pi/180)
}

function calculateEdgePoint(degree, scale=1) {
    const degreeInRadians = degToRadians(degree)
    const degreeInRadiansY = degToRadians(svgY(degree))
    return [
        viewBoxCenter + Math.cos(degreeInRadians) * radius * scale,
        viewBoxCenter + Math.sin(degreeInRadiansY) * radius * scale
    ]
}

const defDegree = 72
const maxScore = 100

function AnimatedRadar5({scoreData=[]}){
    const anim = new Animated.Value(0)
    const [globalPath, setglobalPath] = useState(`M${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}Z`)
    if(scoreData?.length!=5){
        return null
    }
    useEffect(()=>{

        let pathTemp='M'
        scoreData.map((r, i) => {
            const edgePoint = calculateEdgePoint(i * defDegree + 72 + 18, r.score / maxScore)
            pathTemp+=Math.round(edgePoint[0]) + ','
            pathTemp+=Math.round(edgePoint[1]) + 'L'
            return `${Math.round(edgePoint[0])},${Math.round(edgePoint[1])}`
        })
        pathTemp = pathTemp.slice(0, -1) + 'Z'
        console.log('pathTemp: ', pathTemp)
        setglobalPath(pathTemp)
    }, [])
    useEffect(()=>{
        Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start()
    }, [globalPath])
    const path = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            `M${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}Z`,
            globalPath
        ],
    })

    return (
        <View
            style={{
                paddingVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
                height: viewBoxSize,
            }}
        >
            <Svg height="100%" width="100%" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                <Circle
                    cx={viewBoxCenter}
                    cy={viewBoxCenter}
                    r={radius}
                    stroke="black"
                    strokeOpacity="0.2"
                    strokeWidth="0.5"
                    fill="#F0F0F0"
                />
                {lodash.times(4).map(i => (
                    <Circle
                        key={`circle_outline_${i}`}
                        cx={viewBoxCenter}
                        cy={viewBoxCenter}
                        r={(i + 1) * radius * 0.25}
                        stroke={'#BCDEDE'}
                        // strokeOpacity="0.2"
                        strokeWidth="1"
                        fill={i%2 == 0? '#fff' : '#F5FCFC'}
                    />
                )).reverse()}
                {lodash.times(5).map(i => (
                    <Line
                        key={`cross_hair_${i}`}
                        x1={viewBoxCenter}
                        y1={viewBoxCenter}
                        x2={calculateEdgePoint(i * defDegree + 72 + 18 )[0]}
                        y2={calculateEdgePoint(i * defDegree + 72 + 18)[1]}
                        stroke="black"
                        strokeOpacity="0.2"
                        strokeWidth="0.5"
                        fill="transparent"
                    />
                ))}
                {scoreData.map((r, i)=>{
                    // console.log('r: ', r)
                    return (
                        <Text
                            key={`score_label_${i}`}
                            fill={'#393939'}
                         {12}
                            x={calculateEdgePoint(i * defDegree + 72 + 18, 1.1)[0]}
                            y={calculateEdgePoint(i * defDegree + 72 + 18, 1.1)[1]}
                            textAnchor={i == 0 ||i == 3 || i==4? 'start' : 'end'}
                        >
                            {r.name}
                        </Text>
                    )
                })}
                <AnimatedPath
                    d= {path}
                    stroke={'#1CCCCC'}
                    strokeWidth={1.2}
                    fill={'#1CCCCC4B'}
                    fillOpacity={0.9}
                />

            </Svg>
        </View>
    )
}

export default AnimatedRadar5

