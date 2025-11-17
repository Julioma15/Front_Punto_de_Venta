import { Stack } from 'expo-router';

const SlideProducts_Layout = ()=>{
    return (
        <Stack
            screenOptions={{
                headerShown: false //Que no muestre otro menu. Unicamente aparece el del index.jsx
            }}    

        />

    )
}

export default SlideProducts_Layout