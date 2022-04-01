# AnimatedRadar5
## data example 
```
const TEST_DATA = [
    { name: 'label1', score: 1, },
    { name: 'label2', score: 2, },
    { name: 'label3', score: 3, },
    { name: 'label4', score: 4, },
]
```
## usage
```
function AnimatedRadar({scoreData=[]}){

    if(scoreData?.length==4){
        return <AnimatedRadar4  scoreData={scoreData} />
    }
    if(scoreData?.length==5){
        return <AnimatedRadar5  scoreData={scoreData} />
    }
    if(scoreData?.length==6){
        return <AnimatedRadar6  scoreData={scoreData} />
    }
    return null

}

export default AnimatedRadar

```
