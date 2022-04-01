//https://gist.github.com/brianfoody/49e22e66ffff3709904e5e17981c2a4a#file-svgradarchart-tsx-L15
import React, { useEffect, useMemo, useState } from 'react'
import { Animated, View, } from 'react-native'
import { IS_PAD, VIEWPORT_WIDTH } from '../../utils/sys'
import lodash from 'lodash'
import Svg, { Circle, Line, Path, Polygon, Text } from 'react-native-svg'
const AnimatedPath = Animated.createAnimatedComponent(Path);

const TEST_DATA = [
    { name: 'label1', score: 90, },
    { name: '2', score: 80, },
    { name: '3', score: 99, },
    { name: '4', score: 70, },
    { name: '5', score: 85, },
    { name: '6', score: 60, },
]

const viewBoxSize = IS_PAD? 300 : Math.min(VIEWPORT_WIDTH-100, 240)
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

const defDegree = 60
const offsetDegree = 60
const maxScore = 100

function AnimatedRadar6({scoreData=[]}){
    const anim = new Animated.Value(0)
    const [globalPath, setglobalPath] = useState(`M${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}Z`)

    useEffect(()=>{

        let pathTemp='M'
        scoreData.map((r, i) => {
            const edgePoint = calculateEdgePoint(i * defDegree + offsetDegree, r.score / maxScore)
            pathTemp+=Math.round(edgePoint[0]) + ','
            pathTemp+=Math.round(edgePoint[1]) + 'L'
            return `${Math.round(edgePoint[0])},${Math.round(edgePoint[1])}`
        })
        pathTemp = pathTemp.slice(0, -1) + 'Z'
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
            `M${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}L${viewBoxCenter},${viewBoxCenter}Z`,
            globalPath
        ],
    })

    return (
        <View
            style={{
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
                {lodash.times(3).map(i => (
                    <Line
                        key={`cross_hair_${i}`}
                        x1={calculateEdgePoint(i * defDegree + offsetDegree)[0]}
                        y1={calculateEdgePoint(i * defDegree + offsetDegree)[1]}
                        x2={calculateEdgePoint(i * defDegree + 180 + offsetDegree)[0]}
                        y2={calculateEdgePoint(i * defDegree + 180 + offsetDegree)[1]}
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
                            fontSize= {IS_PAD? 16 : 12}
                            x={calculateEdgePoint(i * defDegree + offsetDegree, 1.1)[0]}
                            y={calculateEdgePoint(i * defDegree + offsetDegree, 1.1)[1]}
                            textAnchor={i == 0 || i==4 || i==5? 'start' : 'end'}
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

export default AnimatedRadar6

